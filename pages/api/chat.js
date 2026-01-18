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
    return res.status(401).json({ error: 'Missing authorization header' });
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

  // Check if ANTHROPIC_API_KEY is set
  if (!process.env.ANTHROPIC_API_KEY) {
    // Return a helpful mock response when API key is not set
    return res.status(200).json({
      message: "I'd love to help you create a PRD! However, the AI integration isn't configured yet. Please add your ANTHROPIC_API_KEY to the environment variables.\n\nIn the meantime, you can manually describe your product idea and I'll generate a sample PRD structure for you.",
      prdUpdates: message.toLowerCase().includes('task') || message.toLowerCase().includes('todo') ? {
        title: "Task Management Application",
        objective: "Build a modern task management solution that helps teams organize, track, and complete their work efficiently.",
        description: "A web-based task management platform that enables teams to create, assign, and track tasks with features like due dates, priorities, labels, and progress tracking.",
      } : null
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
        'x-api-key': process.env.ANTHROPIC_API_KEY,
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
