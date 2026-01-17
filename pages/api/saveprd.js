import { createServerClient } from '../../supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
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

  const prd = req.body;

  // Map camelCase to snake_case for database
  const dbRecord = {
    user_id: user.id,
    title: prd.title || '',
    objective: prd.objective || '',
    description: prd.description || '',
    functional_requirements: prd.functionalRequirements || '',
    non_functional_requirements: prd.nonFunctionalRequirements || '',
    dependencies: prd.dependencies || '',
    acceptance_criteria: prd.acceptanceCriteria || '',
  };

  try {
    const { data, error } = await supabase
      .from('prds')
      .insert([dbRecord])
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({ id: data.id });
  } catch (e) {
    console.error('Error adding document:', e);
    res.status(500).json({ error: 'Error adding document: ' + e.message });
  }
}
