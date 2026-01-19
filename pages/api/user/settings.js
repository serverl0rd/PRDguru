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
      .select('api_key, ai_provider')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ error: error.message });
    }

    // Mask the API key for display
    const maskedKey = data?.api_key
      ? `${data.api_key.slice(0, 7)}...${data.api_key.slice(-4)}`
      : null;

    return res.status(200).json({
      hasApiKey: !!data?.api_key,
      maskedKey,
      provider: data?.ai_provider || 'anthropic'
    });
  }

  if (req.method === 'POST') {
    const { apiKey, provider } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    if (!provider) {
      return res.status(400).json({ error: 'Provider is required' });
    }

    // Validate API key format based on provider
    const validPrefixes = {
      anthropic: 'sk-ant-',
      openai: 'sk-',
      gemini: 'AI'
    };

    const expectedPrefix = validPrefixes[provider];
    if (expectedPrefix && !apiKey.startsWith(expectedPrefix)) {
      return res.status(400).json({
        error: `Invalid API key format for ${provider}. Expected key starting with "${expectedPrefix}"`
      });
    }

    // Upsert user settings
    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: user.id,
        api_key: apiKey,
        ai_provider: provider,
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
      .update({
        api_key: null,
        ai_provider: null,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
