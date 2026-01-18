import { createServerClient } from '../../../supabase';
import Stripe from 'stripe';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const supabase = createServerClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata.user_id;
        const subscriptionId = session.subscription;

        // Get subscription details
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            stripe_customer_id: session.customer,
            stripe_subscription_id: subscriptionId,
            status: 'active',
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;

        await supabase
          .from('subscriptions')
          .update({
            status: subscription.status === 'active' ? 'active' : subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id);

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;

        await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id);

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;

        await supabase
          .from('subscriptions')
          .update({
            status: 'past_due',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_customer_id', invoice.customer);

        break;
      }
    }

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Webhook handler error:', error);
    return res.status(500).json({ error: error.message });
  }
}
