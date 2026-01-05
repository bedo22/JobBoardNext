# Payments Integration Plan (Portfolio-Ready)

Goal: Add a small, credible, client-recognizable billing slice that demonstrates real-world capability without bloating scope.

Recommendation (for portfolio): Stripe Checkout (Hosted) in Test Mode
- Why Stripe: Most recognized by clients, excellent Next.js docs, and shows end-to-end skill (server route + webhook + DB update).
- Why Hosted Checkout: Minimal PCI exposure and UI work; faster to ship; easy to extend later.

What to monetize (MVP)
- Pay per Job Post (one-time). Optional add-on: Featured listing.

Architecture overview
- /pricing: Shows “Pay per Job Post” (test mode badge) and optional Featured add-on.
- /api/checkout (POST): Server creates a Stripe Checkout Session using price IDs.
- /api/webhooks/stripe (POST): Verifies signature; on checkout.session.completed, grant posting rights:
  - Supabase: increment employer_credits or set can_post=true.
- /jobs/post (paywall): If no credits/can_post=false, show a paywall CTA to /api/checkout.
- /success and /cancel routes for user feedback and navigation.

Security & correctness
- Never trust amounts from client; only accept server-side price IDs.
- Verify webhook signature; use idempotency keys; handle retries safely.
- Separate test and live keys; keep keys server-side only.

Optional iteration 2
- Subscriptions (N active listings/month) + Customer Portal.
- Feature flags for “Featured listing” and analytics add-ons.

Alternatives
- Lemon Squeezy (Merchant of Record): Offloads tax/VAT and receipts.
  - Pros: Fastest to ship, MoR handles compliance.
  - Cons: Less universally recognized by clients, less flexible than Stripe.
  - When to pick: If taxes/compliance stress you and you want quick MoR coverage.

Client-facing language (for your gig)
- “I integrate Stripe Checkout (hosted) with secure webhooks to unlock features (e.g., pay-per-job-post). This shows real production capability while keeping your billing simple and compliant.”

Checklist to implement
- [ ] Create Stripe product + price (test mode). Keep price IDs in env.
- [ ] Route: /api/checkout creates sessions securely with metadata (user ID).
- [ ] Webhook: /api/webhooks/stripe verifies signature; updates Supabase (credits/can_post).
- [ ] Paywall on /jobs/post checks credits.
- [ ] Success/Cancel pages wired.
- [ ] README section with demo notes and test card numbers.

Demo notes (test mode)
- Use Stripe test card 4242 4242 4242 4242, any future date, any CVC.
- Mark UI with “Test Mode” badge on pricing.
