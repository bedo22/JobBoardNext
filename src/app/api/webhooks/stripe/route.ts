import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe, isStripeConfigured } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import type Stripe from 'stripe';

// Initialize Supabase Admin Client for database updates
// We use a direct client here instead of the helper to ensure we have SERVICE ROLE access
// independently of the current request context (webhooks are system-to-system)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY!
);

export async function POST(req: Request) {
    // Return early if Stripe is not configured (demo mode)
    if (!isStripeConfigured || !stripe) {
        return new NextResponse('Stripe not configured', { status: 503 });
    }
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Webhook signature verification failed.', message);
        return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session | Stripe.Invoice | Stripe.Subscription;

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                // This fires when the user successfully pays seamlessly
                const checkoutSession = session as Stripe.Checkout.Session;
                const customerId = checkoutSession.customer as string;
                const userId = checkoutSession.metadata?.supabase_uid;

                if (userId) {
                    // Update user to PRO immediately
                    await supabaseAdmin
                        .from('profiles')
                        .update({
                            is_pro: true,
                            stripe_customer_id: customerId,
                            subscription_status: 'active'
                        })
                        .eq('id', userId);
                    
                    console.log(`User ${userId} upgraded to PRO via Checkout.`);
                }
                break;
            }

            case 'invoice.payment_succeeded': {
                // This fires for recurring payments (renewals)
                const customerId = session.customer;
                
                // Find user by stripe_customer_id since invoice doesn't always have metadata
                const { data: profile } = await supabaseAdmin
                    .from('profiles')
                    .select('id')
                    .eq('stripe_customer_id', customerId)
                    .single();

                if (profile) {
                    await supabaseAdmin
                        .from('profiles')
                        .update({
                            is_pro: true,
                            subscription_status: 'active'
                        })
                        .eq('id', profile.id);
                        
                    console.log(`User ${profile.id} subscription renewed.`);
                }
                break;
            }

            case 'customer.subscription.deleted': {
                // This fires when a subscription is canceled or expires
                const customerId = session.customer;

                const { data: profile } = await supabaseAdmin
                    .from('profiles')
                    .select('id')
                    .eq('stripe_customer_id', customerId)
                    .single();

                if (profile) {
                    await supabaseAdmin
                        .from('profiles')
                        .update({
                            is_pro: false,
                            subscription_status: 'canceled'
                        })
                        .eq('id', profile.id);
                        
                    console.log(`User ${profile.id} subscription canceled.`);
                }
                break;
            }
        }
    } catch (error) {
        console.error('Webhook processing error:', error);
        return new NextResponse('Webhook handler failed', { status: 500 });
    }

    return new NextResponse(null, { status: 200 });
}
