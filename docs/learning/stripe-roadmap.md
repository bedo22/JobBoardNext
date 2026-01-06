# Stripe Mastery Roadmap (2026)

Mastering Stripe is a high-value skill for any freelancer. Clients pay a premium for "Payments that don't break."

## 1. The Core 5 Concepts (Understand these FIRST)

Before writing code, you must understand how Stripe thinks:

1.  **Product & Price:** The "What" and "How Much." (e.g., "Pro Subscription" at "$20/month").
2.  **Customer:** The "Who." Every user in your Supabase DB should eventually map to a `cus_xxx` ID in Stripe.
3.  **Checkout Session:** The "Transaction." A temporary URL where the payment actually happens.
4.  **Subscription:** The "Cycle." A recurring link between a Customer and a Price.
5.  **Webhooks:** The "Notifier." How Stripe tells your server: "Hey, the payment actually worked! Give the user Pro access."

---

## 2. Learning Resources (ranked by effectiveness)

### 🥇 The "Gold Standard": Stripe Documentation

Stripe is famous for having the **best documentation in the world.**

- **URL:** [stripe.com/docs](https://stripe.com/docs)
- **Specific Guide:** [Accept a Payment (Next.js)](https://stripe.com/docs/checkout/quickstart?framework=next-js)
- **Why:** It's interactive. If you're logged into Stripe, the code samples will actually use your real test API keys.

### 🥈 Stripe University (YouTube)

- **Search for:** "Stripe Developers" channel.
- **Key Series:** "Getting Started with Stripe" and "Stripe Webhooks 101."
- **Why:** Great for visual learners to see the "flow" of data.

### 🥉 Project-Based Learning (Your Current App)

You already have a Stripe setup! The best way to learn is to **break it and fix it.**

- **Exercise:** Try to add a "One-time payment" option (like a $5 Tip) alongside the subscription.
- **Exercise:** Try to implement a "Customer Portal" so users can cancel their own subscriptions via Stripe's UI.

---

## 3. The 3-Step Learning Path

### Step 1: The "Happy Path" (2 days)

Successfully redirect a user to Stripe Checkout and get them back to a `success_url`.

- Learn to use the **Stripe CLI** for testing.
- Command: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### Step 2: The "Fulfillment Path" (3 days)

Mastering **Webhooks**. This is the hardest part.

- Learn to handle `invoice.payment_succeeded` and `customer.subscription.deleted`.
- Learn how to verify signatures so hackers can't "fake" payments to your server.

### Step 3: The "Management Path" (2 days)

Mastering the **Stripe Dashboard**.

- Learn how to refund a payment.
- Learn how to pause a subscription.
- Learn how to look at **Events** and **Logs** to debug why a payment failed.

---

## 4. Pro-Freelancer Tip: The "Test Clock"

When building subscriptions, you don't want to wait 30 days to see if the second payment works.

- Google: **"Stripe Test Clocks."**
- They allow you to "fast-forward" time in test mode to see if your webhooks handle renewals and expirations correctly.

---

## 5. Your Current Project Status

You have already implemented:

- [x] Stripe Client Initialization (`lib/stripe.ts`)
- [x] Checkout Session Creation (`actions/stripe.ts`)
- [x] Basic Webhook Handler (`api/webhooks/stripe/route.ts`)

**Your Homework:**

1. Log into your [Stripe Dashboard](https://dashboard.stripe.com).
2. Create a test Product called "Demo Pro".
3. Copy the `Price ID` into your `.env`.
4. Run the app and try to "buy" it using a test card (4242 4242...).
5. Watch the Stripe CLI logs as the webhooks fire.
