import { createServerClient } from '../../../supabase';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return res.status(500).json({
      error: 'Razorpay is not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.'
    });
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

  try {
    // Check if user already has a subscription record
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('razorpay_customer_id, razorpay_subscription_id, status')
      .eq('user_id', user.id)
      .single();

    // If already has active subscription, return error
    if (existingSub?.status === 'active') {
      return res.status(400).json({ error: 'You already have an active subscription' });
    }

    // Create subscription
    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.RAZORPAY_PLAN_ID,
      total_count: 12, // 12 months max
      customer_notify: 1,
      notes: {
        user_id: user.id,
        email: user.email
      }
    });

    // Save subscription ID to database
    await supabase
      .from('subscriptions')
      .upsert({
        user_id: user.id,
        razorpay_subscription_id: subscription.id,
        status: 'created',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    return res.status(200).json({
      subscriptionId: subscription.id,
      keyId: process.env.RAZORPAY_KEY_ID,
      amount: 90000, // ₹900 in paise (or your price)
      currency: 'INR',
      name: 'PRD Guru Pro',
      description: 'Monthly subscription for unlimited AI access',
      prefill: {
        email: user.email
      }
    });

  } catch (error) {
    console.error('Razorpay error:', error);
    return res.status(500).json({ error: error.message });
  }
}
