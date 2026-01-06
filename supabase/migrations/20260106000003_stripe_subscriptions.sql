-- Add Stripe subscription fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT;

-- Index for faster customer id lookups (used in webhooks)
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON public.profiles(stripe_customer_id);

-- Add comment for clarity
COMMENT ON COLUMN public.profiles.is_pro IS 'Indicates if the user has an active premium subscription';
COMMENT ON COLUMN public.profiles.stripe_customer_id IS 'Unique Stripe customer identifier for billing';
COMMENT ON COLUMN public.profiles.subscription_status IS 'The current state of the Stripe subscription (active, trialing, past_due, etc.)';
