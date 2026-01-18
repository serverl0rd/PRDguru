import { createServerClient } from '../../../supabase';

export default async function handler(req, res) {
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

  if (req.method === 'GET') {
    // Get user settings
    const { data, error } = await supabase
      .from('user_settings')
      .select('anthropic_api_key')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ error: error.message });
    }

    // Mask the API key for display
    const maskedKey = data?.anthropic_api_key
      ? `sk-ant-...${data.anthropic_api_key.slice(-8)}`
      : null;

    return res.status(200).json({ hasApiKey: !!data?.anthropic_api_key, maskedKey });
  }

  if (req.method === 'POST') {
    const { apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    // Validate the API key format
    if (!apiKey.startsWith('sk-ant-')) {
      return res.status(400).json({ error: 'Invalid Anthropic API key format' });
    }

    // Upsert user settings
    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: user.id,
        anthropic_api_key: apiKey,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  }

  if (req.method === 'DELETE') {
    // Remove API key
    const { error } = await supabase
      .from('user_settings')
      .update({ anthropic_api_key: null, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
