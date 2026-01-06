'use server'

import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function createCheckoutSession(priceId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'You must be logged in to subscribe.' };
    }

    try {
        // 1. Check if user already has a stripe_customer_id in our DB
        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single();

        let customerId = profile?.stripe_customer_id;

        // 2. If not, create a new customer in Stripe and update our DB
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: {
                    supabase_uid: user.id
                }
            });
            customerId = customer.id;

            await supabase
                .from('profiles')
                .update({ stripe_customer_id: customerId })
                .eq('id', user.id);
        }

        // 3. Create the Checkout Session
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard?session_id={CHECKOUT_SESSION_ID}&payment=success`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/pricing`,
            metadata: {
                supabase_uid: user.id
            }
        });

        if (!session.url) {
            throw new Error('Failed to create checkout session URL');
        }

        // Return the URL for the client to redirect
        return { url: session.url };

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to initiate payment.';
        console.error('Stripe Checkout Error:', error);
        return { error: message };
    }
}
