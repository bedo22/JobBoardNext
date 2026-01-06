# Demo Deployment Guide

This guide explains how to deploy the Job Board as a demo/portfolio project with payment functionality disabled.

## 🎯 Payment Feature Flag System

The project includes a feature flag system that allows you to:
- ✅ Deploy without exposing Stripe API keys
- ✅ Show payment UI in demos/videos
- ✅ Test locally with real Stripe integration
- ✅ Enable payments later without code changes

## 📋 Deployment Options

### Option 1: Demo Mode (Recommended for Portfolio/Free Hosting)

**Use this when:**
- Deploying to portfolio/demo environments
- You don't want to handle real payments
- Showcasing the UI/UX in videos
- Free tier hosting (Vercel, Netlify, etc.)

**Setup:**

1. **Don't set payment environment variables** in your deployment platform
2. **Or explicitly disable payments:**
   ```env
   NEXT_PUBLIC_ENABLE_PAYMENTS=false
   ```

3. **Required env vars only:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_key
   GOOGLE_GENERATIVE_AI_API_KEY=your_key (optional)
   ```

**What happens:**
- Payment buttons show "View Demo" instead of "Subscribe"
- Clicking shows a toast: "💡 Payment Demo Mode - This is a demo project"
- All payment UI remains visible for demonstration
- No Stripe API calls are made
- Safe to deploy publicly

---

### Option 2: Full Production Mode

**Use this when:**
- Running a real job board business
- Need actual payment processing
- Have Stripe account configured

**Setup:**

1. **Enable payments explicitly:**
   ```env
   NEXT_PUBLIC_ENABLE_PAYMENTS=true
   ```

2. **Add all Stripe credentials:**
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PRICE_ID=price_...
   ```

3. **Configure Stripe webhooks:**
   - Webhook URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `invoice.payment_succeeded`

**What happens:**
- Payment buttons show "Subscribe"
- Real Stripe Checkout integration
- Webhooks update subscription status
- Full payment processing

---

## 🎥 For Video Demos/Recording

### Local Testing with Real Stripe (Development)

```env
# .env.local
NEXT_PUBLIC_ENABLE_PAYMENTS=true
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
```

- Use Stripe Test Mode keys
- Use test card: `4242 4242 4242 4242`
- Record full payment flow
- No real charges

### Demo Deployment (Public)

```env
# Production environment
NEXT_PUBLIC_ENABLE_PAYMENTS=false
# OR simply omit all Stripe keys
```

- Safe for public demos
- No risk of exposing keys
- UI shows "View Demo" mode

---

## 🔒 Security Best Practices

### ✅ DO:
- Use environment variables for all secrets
- Enable payments only in trusted environments
- Use Stripe test mode for demos
- Keep secret keys out of client-side code
- Use `.env.local` for local development (gitignored)

### ❌ DON'T:
- Commit `.env` files with real keys
- Expose `STRIPE_SECRET_KEY` in client code
- Use production keys for demos/testing
- Deploy with test keys to production

---

## 📊 Feature Flag Reference

| Flag | Values | Default | Description |
|------|--------|---------|-------------|
| `NEXT_PUBLIC_ENABLE_PAYMENTS` | `"true"` / `"false"` / undefined | `false` | Enables real payment processing |

**Detection Logic:**
```typescript
// src/lib/env.ts
export const features = {
  paymentsEnabled: env.NEXT_PUBLIC_ENABLE_PAYMENTS === 'true',
  stripeConfigured: !!(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && env.STRIPE_SECRET_KEY),
}
```

---

## 🚀 Quick Start Deployment Examples

### Vercel (Demo Mode)
```bash
# Set only required env vars in Vercel dashboard
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
vercel deploy
```

### Netlify (Demo Mode)
```bash
# netlify.toml
[build.environment]
  NEXT_PUBLIC_SUPABASE_URL = "your_url"
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "your_key"
```

### Docker (Production Mode)
```dockerfile
ENV NEXT_PUBLIC_ENABLE_PAYMENTS=true
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
ENV STRIPE_SECRET_KEY=sk_live_...
```

---

## 🎬 Recording Demo Videos

**Recommended Setup:**
1. **Development server** with `NEXT_PUBLIC_ENABLE_PAYMENTS=true`
2. **Stripe test mode** keys
3. **Test cards** from Stripe docs
4. **Ngrok/LocalTunnel** for webhook testing (optional)

**What to show:**
- Full payment UI flow
- Stripe Checkout modal
- Success/error handling
- Subscription confirmation

**What to mention:**
- "Using Stripe test mode for demonstration"
- "In production, this uses real payment processing"
- "Payment integration fully functional"

---

## 🆘 Troubleshooting

### Payments not working in demo
**Expected!** Demo mode disables payments intentionally. Set `NEXT_PUBLIC_ENABLE_PAYMENTS=true` to enable.

### "Stripe keys not configured" error
Check that all Stripe environment variables are set if `NEXT_PUBLIC_ENABLE_PAYMENTS=true`.

### Webhook errors in production
Ensure webhook secret is correct and webhook URL is publicly accessible.

---

## 📝 Example .env Files

### Development (Full Features)
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJxxx
NEXT_PUBLIC_ENABLE_PAYMENTS=true
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_ID=price_xxx
GOOGLE_GENERATIVE_AI_API_KEY=AIzaxxx
```

### Production Demo (Public Portfolio)
```env
# Vercel/Netlify environment
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJxxx
GOOGLE_GENERATIVE_AI_API_KEY=AIzaxxx
# No payment vars = demo mode
```

### Production (Real Business)
```env
# Production environment
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJxxx
NEXT_PUBLIC_ENABLE_PAYMENTS=true
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_ID=price_xxx
```

---

## ✅ Checklist Before Deploying

### Demo Deployment
- [ ] Supabase configured
- [ ] Payment env vars NOT set (or explicitly disabled)
- [ ] Test deployment works
- [ ] Payment buttons show "View Demo"
- [ ] Toast notification works

### Production Deployment
- [ ] All Stripe keys configured (live mode)
- [ ] `NEXT_PUBLIC_ENABLE_PAYMENTS=true`
- [ ] Webhook endpoint configured in Stripe
- [ ] Test with real card
- [ ] Verify subscription creates correctly
- [ ] Monitor Stripe dashboard

---

**Need Help?** Check the [Stripe Testing Guide](../learning/stripe-testing-guide.md) for more details.
