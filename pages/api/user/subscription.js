import { createServerClient } from '../../../supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
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

  // Get subscription status
  const { data, error } = await supabase
    .from('subscriptions')
    .select('status, current_period_end')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    return res.status(500).json({ error: error.message });
  }

  const isActive = data?.status === 'active' &&
    new Date(data.current_period_end) > new Date();

  return res.status(200).json({
    isSubscribed: isActive,
    status: data?.status || 'inactive',
    currentPeriodEnd: data?.current_period_end
  });
}
