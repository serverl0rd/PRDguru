import { createServerClient } from '../../../supabase';
import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Razorpay webhook secret not configured');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  // Verify webhook signature
  const signature = req.headers['x-razorpay-signature'];
  const body = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex');

  if (signature !== expectedSignature) {
    console.error('Invalid webhook signature');
    return res.status(400).json({ error: 'Invalid signature' });
  }

  const supabase = createServerClient();
  const event = req.body;

  try {
    const eventType = event.event;
    const payload = event.payload;

    switch (eventType) {
      case 'subscription.activated': {
        const subscription = payload.subscription.entity;
        const currentPeriodEnd = new Date(subscription.current_end * 1000);

        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            current_period_end: currentPeriodEnd.toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('razorpay_subscription_id', subscription.id);

        break;
      }

      case 'subscription.charged': {
        const subscription = payload.subscription.entity;
        const currentPeriodEnd = new Date(subscription.current_end * 1000);

        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            current_period_end: currentPeriodEnd.toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('razorpay_subscription_id', subscription.id);

        break;
      }

      case 'subscription.pending': {
        const subscription = payload.subscription.entity;

        await supabase
          .from('subscriptions')
          .update({
            status: 'past_due',
            updated_at: new Date().toISOString()
          })
          .eq('razorpay_subscription_id', subscription.id);

        break;
      }

      case 'subscription.halted':
      case 'subscription.cancelled': {
        const subscription = payload.subscription.entity;

        await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            updated_at: new Date().toISOString()
          })
          .eq('razorpay_subscription_id', subscription.id);

        break;
      }

      case 'subscription.completed': {
        const subscription = payload.subscription.entity;

        await supabase
          .from('subscriptions')
          .update({
            status: 'inactive',
            updated_at: new Date().toISOString()
          })
          .eq('razorpay_subscription_id', subscription.id);

        break;
      }
    }

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Webhook handler error:', error);
    return res.status(500).json({ error: error.message });
  }
}
