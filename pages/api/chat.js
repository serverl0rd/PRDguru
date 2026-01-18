import { createServerClient } from '../../supabase';

// System prompt for the AI
const SYSTEM_PROMPT = `You are a helpful AI assistant that helps users create Product Requirements Documents (PRDs).

Your role is to:
1. Ask clarifying questions to understand the product better
2. Help users think through their product requirements
3. Generate structured PRD content based on the conversation

When you have enough information, respond with a JSON block that updates the PRD fields. Use this exact format:

\`\`\`prd-update
{
  "title": "Product name",
  "objective": "What the product aims to achieve",
  "description": "Detailed product description",
  "functionalRequirements": "List of functional requirements",
  "nonFunctionalRequirements": "Performance, security, scalability requirements",
  "dependencies": "External dependencies and integrations",
  "acceptanceCriteria": "How to verify the product meets requirements"
}
\`\`\`

Only include fields that you have information for. Leave out fields you don't have data for yet.

Keep your responses concise and focused. Guide the user through creating a comprehensive PRD step by step.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const supabase = createServerClient();

  // Verify authentication
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { message, currentPRD, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Check for user's own API key first
  const { data: settings } = await supabase
    .from('user_settings')
    .select('anthropic_api_key')
    .eq('user_id', user.id)
    .single();

  // Check for active subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status, current_period_end')
    .eq('user_id', user.id)
    .single();

  const hasOwnKey = !!settings?.anthropic_api_key;
  const hasActiveSubscription = subscription?.status === 'active' &&
    new Date(subscription.current_period_end) > new Date();

  // Determine which API key to use
  let apiKey = null;

  if (hasOwnKey) {
    apiKey = settings.anthropic_api_key;
  } else if (hasActiveSubscription && process.env.ANTHROPIC_API_KEY) {
    apiKey = process.env.ANTHROPIC_API_KEY;
  }

  // If no API key available, return paywall message
  if (!apiKey) {
    return res.status(200).json({
      message: "To use the AI assistant, you have two options:\n\n**Option 1: Bring Your Own Key**\nAdd your own Anthropic API key in Settings. Get one at console.anthropic.com\n\n**Option 2: Subscribe**\nGet unlimited AI access for $9/month.\n\nGo to Settings to get started!",
      requiresUpgrade: true,
      prdUpdates: null
    });
  }

  try {
    // Build conversation history for Claude
    const messages = [];

    // Add conversation history
    if (history && history.length > 0) {
      history.forEach(msg => {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      });
    }

    // Add current message
    messages.push({
      role: 'user',
      content: `Current PRD state:
${JSON.stringify(currentPRD, null, 2)}

User message: ${message}`
    });

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: messages
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Claude API error:', errorData);

      // Check if it's an invalid API key error
      if (response.status === 401) {
        return res.status(200).json({
          message: "Your API key appears to be invalid. Please check your API key in Settings.",
          prdUpdates: null
        });
      }

      throw new Error('Failed to get response from AI');
    }

    const data = await response.json();
    const assistantMessage = data.content[0].text;

    // Parse PRD updates from the response
    let prdUpdates = null;
    const prdUpdateMatch = assistantMessage.match(/```prd-update\n([\s\S]*?)\n```/);

    if (prdUpdateMatch) {
      try {
        prdUpdates = JSON.parse(prdUpdateMatch[1]);
      } catch (e) {
        console.error('Failed to parse PRD updates:', e);
      }
    }

    // Clean the message (remove the JSON block if present)
    const cleanMessage = assistantMessage.replace(/```prd-update\n[\s\S]*?\n```/g, '').trim();

    return res.status(200).json({
      message: cleanMessage || "I've updated the PRD based on your input. You can see the changes in the preview.",
      prdUpdates
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({
      error: 'Failed to process request',
      message: error.message
    });
  }
}
