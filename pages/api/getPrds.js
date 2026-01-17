import { createServerClient } from '../../supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const supabase = createServerClient();

  // Get the user from the authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { data, error } = await supabase
      .from('prds')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map snake_case to camelCase for frontend
    const prds = data.map(prd => ({
      id: prd.id,
      title: prd.title,
      objective: prd.objective,
      description: prd.description,
      functionalRequirements: prd.functional_requirements,
      nonFunctionalRequirements: prd.non_functional_requirements,
      dependencies: prd.dependencies,
      acceptanceCriteria: prd.acceptance_criteria,
      createdAt: prd.created_at,
      updatedAt: prd.updated_at,
    }));

    res.status(200).json(prds);
  } catch (e) {
    console.error('Error fetching documents:', e);
    res.status(500).json({ error: 'Error fetching documents: ' + e.message });
  }
}
