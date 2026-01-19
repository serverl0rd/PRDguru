import { createServerClient } from '../../supabase';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

// Call Anthropic Claude API
async function callAnthropic(apiKey, messages) {
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
    if (response.status === 401) {
      throw new Error('Invalid Anthropic API key');
    }
    throw new Error('Failed to get response from Anthropic');
  }

  const data = await response.json();
  return data.content[0].text;
}

// Call OpenAI API
async function callOpenAI(apiKey, messages) {
  const openai = new OpenAI({ apiKey });

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 2048,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ]
  });

  return response.choices[0].message.content;
}

// Call Google Gemini API
async function callGemini(apiKey, messages) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Convert messages to Gemini format
  const history = messages.slice(0, -1).map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  const chat = model.startChat({
    history,
    systemInstruction: SYSTEM_PROMPT
  });

  const lastMessage = messages[messages.length - 1];
  const result = await chat.sendMessage(lastMessage.content);
  return result.response.text();
}

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
    .select('api_key, ai_provider')
    .eq('user_id', user.id)
    .single();

  // Check for active subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status, current_period_end')
    .eq('user_id', user.id)
    .single();

  const hasOwnKey = !!settings?.api_key;
  const hasActiveSubscription = subscription?.status === 'active' &&
    new Date(subscription.current_period_end) > new Date();

  // Determine which API key and provider to use
  let apiKey = null;
  let provider = 'anthropic';

  if (hasOwnKey) {
    apiKey = settings.api_key;
    provider = settings.ai_provider || 'anthropic';
  } else if (hasActiveSubscription && process.env.ANTHROPIC_API_KEY) {
    apiKey = process.env.ANTHROPIC_API_KEY;
    provider = 'anthropic';
  }

  // If no API key available, return paywall message
  if (!apiKey) {
    return res.status(200).json({
      message: "To use the AI assistant, you have two options:\n\n**Option 1: Bring Your Own Key**\nAdd your own API key (OpenAI, Anthropic, or Gemini) in Settings.\n\n**Option 2: Subscribe**\nGet unlimited AI access for ₹99/month.\n\nGo to Settings to get started!",
      requiresUpgrade: true,
      prdUpdates: null
    });
  }

  try {
    // Build conversation history
    const messages = [];

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

    // Call the appropriate AI provider
    let assistantMessage;

    switch (provider) {
      case 'openai':
        assistantMessage = await callOpenAI(apiKey, messages);
        break;
      case 'gemini':
        assistantMessage = await callGemini(apiKey, messages);
        break;
      case 'anthropic':
      default:
        assistantMessage = await callAnthropic(apiKey, messages);
        break;
    }

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

    // Handle invalid API key errors
    if (error.message.includes('Invalid') || error.message.includes('API key')) {
      return res.status(200).json({
        message: `Your ${provider} API key appears to be invalid. Please check your API key in Settings.`,
        prdUpdates: null
      });
    }

    return res.status(500).json({
      error: 'Failed to process request',
      message: error.message
    });
  }
}
