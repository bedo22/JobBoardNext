# Stripe Test Environment Setup (Step-by-Step)

You now have a Stripe test account. Here's how to connect it to your Job Board project and test the full payment flow.

---

## Step 1: Get Your API Keys (2 minutes)

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com/test/dashboard)
2. Make sure you're in **Test Mode** (toggle in top-right should say "Test mode")
3. Click **Developers** → **API Keys**
4. You'll see two keys:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`) - Click "Reveal test key"

---

## Step 2: Create a Test Product (3 minutes)

**Stripe Terminology Simplified:**

- **Product:** The "Idea" of what you sell (e.g., "Pro Plan").
- **Price:** The "Cost" and "Frequency" (e.g., "$20 per month"). **This gives you the `price_id` we need for the code.**
- **Subscription:** When a user actually pays for a Price.

**Execution Steps:**

1. In Stripe Dashboard, go to **Product Catalog** (or **Products**).
2. Click **Add Product**.
3. Fill in:
   - **Name:** "Pro Subscription"
   - **Description:** "Premium job board access"
   - **Pricing:**
     - Model: Recurring
     - Price: $20
     - Billing period: Monthly
4. Click **Save Product** (this creates the Product _and_ the Price at the same time).
5. On the next screen, scroll down to the **Pricing** section.
6. Look for a code that starts with `price_...`. **Copy this ID.**

---

## Step 3: Update Your .env File (1 minute)

Open `e:\Freelancer\Next.js\job-board\.env` and add/update these lines:

```env
# Stripe Keys (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE  # We'll get this in Step 5

# Stripe Product
STRIPE_PRICE_ID=price_YOUR_PRICE_ID_HERE
```

---

## Step 4: Install Stripe CLI (5 minutes)

The Stripe CLI lets you test webhooks on localhost without deploying.

### Windows Installation (Terminal):

The fastest way to install the Stripe CLI on Windows without Scoop is using **winget** (which is built into your Windows terminal):

```powershell
# Run this in your terminal
winget install stripe.stripe-cli
```

_Note: After running this, شما need to **restart your terminal** for the `stripe` command to be recognized._

### Alternative: Manual Download (If winget fails):

1. **Download the CLI:**
   - Go to: https://github.com/stripe/stripe-cli/releases/latest
   - Download `stripe_X.X.X_windows_x86_64.zip` (get the latest version)

2. **Extract the ZIP file:**
   - Right-click the downloaded file → Extract All
   - Choose a permanent location (e.g., `C:\stripe`)

3. **Add to PATH (so you can run it from anywhere):**

   Open PowerShell **as Administrator** and run:

   ```powershell
   # Add Stripe to your PATH permanently
   [Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\stripe", "Machine")
   ```

   Then **close and reopen** your terminal.

4. **Verify Installation:**

   ```powershell
   stripe --version
   ```

   You should see something like `stripe version 1.x.x`

5. **Login to Stripe:**
   ```powershell
   stripe login
   ```
   This will open your browser to authenticate with your Stripe test account.

---

## Step 5: Start Webhook Forwarding (Critical!)

This is the "magic" that makes webhooks work on localhost.

```powershell
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Important:** This command will output a **webhook signing secret** like:

```
> Ready! Your webhook signing secret is whsec_1234567890abcdef...
```

**Copy this secret** and add it to your `.env` file as `STRIPE_WEBHOOK_SECRET`.

**Keep this terminal open!** It needs to run while you test.

---

## Step 6: Start Your Dev Server (New Terminal)

Open a **second terminal** and run:

```powershell
npm run dev
```

Your app should now be running on `http://localhost:3000`.

---

## Step 7: Test the Full Flow (10 minutes)

### 7.1: Create a Test User

1. Go to `http://localhost:3000`
2. Sign up with a test email (e.g., `test@example.com`)
3. Log in

### 7.2: Navigate to Pricing Page

1. Go to `http://localhost:3000/pricing`
2. Click **Subscribe** on the Pro plan

### 7.3: Complete Test Payment

1. You should be redirected to Stripe Checkout
2. Use the test card: `4242 4242 4242 4242`
3. Expiry: Any future date (e.g., `12/34`)
4. CVC: Any 3 digits (e.g., `123`)
5. Click **Subscribe**

### 7.4: Watch the Magic Happen

In your **Stripe CLI terminal**, you should see:

```
[200] POST /api/webhooks/stripe [evt_1234...]
```

In your **Next.js terminal**, you should see:

```
User abc123 upgraded to PRO via Checkout.
```

### 7.5: Verify in Database

Check your Supabase `profiles` table:

- `is_pro` should be `true`
- `subscription_status` should be `'active'`
- `stripe_customer_id` should be populated

---

## Step 8: Test Webhook Events Manually (Optional)

You can trigger specific events without going through the UI:

```powershell
# Simulate a successful payment
stripe trigger payment_intent.succeeded

# Simulate a subscription cancellation
stripe trigger customer.subscription.deleted
```

Watch your webhook handler respond in real-time!

---

## Troubleshooting

### "Webhook signature verification failed"

- Make sure `STRIPE_WEBHOOK_SECRET` in `.env` matches the one from `stripe listen`
- Restart your dev server after updating `.env`

### "No such price: price\_..."

- Double-check the `STRIPE_PRICE_ID` in your `.env`
- Make sure you're using the **Price ID**, not the Product ID

### Webhooks not firing

- Is `stripe listen` still running?
- Check the Stripe CLI terminal for errors
- Verify the webhook URL is `localhost:3000/api/webhooks/stripe`

---

## Next Steps After Testing

Once everything works locally:

1. **Deploy to Vercel** (or your hosting platform)
2. **Create a Production Webhook** in Stripe Dashboard:
   - Go to **Developers** → **Webhooks** → **Add endpoint**
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`
3. **Update Production .env** with the production webhook secret

---

## You're Done! 🎉

You now have a fully functional Stripe integration that:

- ✅ Creates checkout sessions
- ✅ Processes payments
- ✅ Handles webhooks
- ✅ Updates user status in real-time

**This is portfolio gold.** Record a Loom walkthrough showing this flow for your Upwork proposals!
