import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV === 'production') {
    throw new Error('STRIPE_SECRET_KEY is missing');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    // @ts-expect-error: Stripe SDK types are stricter than necessary for versioning
    apiVersion: '2024-12-18.acacia',
    appInfo: {
        name: 'JobBoard Elite',
        version: '1.0.0',
    },
});
