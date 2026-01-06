import Stripe from 'stripe';

// Only initialize Stripe if credentials are provided
// This allows deployment in demo mode without Stripe keys
const stripeKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeKey
    ? new Stripe(stripeKey, {
          // @ts-expect-error: Stripe SDK types are stricter than necessary for versioning
          apiVersion: '2024-12-18.acacia',
          appInfo: {
              name: 'JobBoard Elite',
              version: '1.0.0',
          },
      })
    : null;

export const isStripeConfigured = !!stripeKey;
