import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV === 'production') {
    throw new Error('STRIPE_SECRET_KEY is missing');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-12-18.acacia' as any, // Using the version compatible with the SDK
    appInfo: {
        name: 'JobBoard Elite',
        version: '1.0.0',
    },
});
