import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

async function setPro(userId: string | null, customerId: string | null, isPro: boolean) {
  const admin = getSupabaseAdmin();
  let uid = userId;
  if (!uid && customerId) {
    const { data } = await admin.from('profiles').select('id').eq('stripe_customer_id', customerId).maybeSingle();
    uid = data?.id ?? null;
  }
  if (!uid) return;
  const patch: Record<string, unknown> = { is_pro: isPro };
  if (customerId) patch.stripe_customer_id = customerId;
  await admin.from('profiles').update(patch).eq('id', uid);
  await admin.from('pages').update({ is_pro: isPro }).eq('user_id', uid);
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const apiKey = process.env.STRIPE_SECRET_KEY;
  const sig = req.headers.get('stripe-signature');
  if (!secret || !apiKey || !sig) {
    return NextResponse.json({ error: 'not configured' }, { status: 400 });
  }

  const stripe = new Stripe(apiKey);
  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch {
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const s = event.data.object as Stripe.Checkout.Session;
      await setPro(s.client_reference_id ?? null, typeof s.customer === 'string' ? s.customer : null, true);
    } else if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object as Stripe.Subscription;
      await setPro(null, typeof sub.customer === 'string' ? sub.customer : null, false);
    }
  } catch (e) {
    console.error('webhook handler error', e);
    return NextResponse.json({ error: 'handler failed' }, { status: 500 });
  }
  return NextResponse.json({ received: true });
}
