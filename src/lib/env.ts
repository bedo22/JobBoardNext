import { z } from 'zod'

const EnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(10),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_ID: z.string().optional(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(10).optional(),
  AI_GOOGLE_MODEL: z.string().optional(),
  NEXT_PUBLIC_ENABLE_PAYMENTS: z.string().optional(),
})

// Read from process.env but validate once at module load
const parsed = EnvSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  STRIPE_PRICE_ID: process.env.STRIPE_PRICE_ID,
  GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  AI_GOOGLE_MODEL: process.env.AI_GOOGLE_MODEL,
  NEXT_PUBLIC_ENABLE_PAYMENTS: process.env.NEXT_PUBLIC_ENABLE_PAYMENTS,
})

if (!parsed.success) {
  const formatted = parsed.error.format()
  // Throw a clear error to fail fast in dev/build
  throw new Error(`Invalid environment variables: ${JSON.stringify(formatted, null, 2)}`)
}

export const env = parsed.data

// Feature flags
export const features = {
  paymentsEnabled: env.NEXT_PUBLIC_ENABLE_PAYMENTS === 'true',
  stripeConfigured: !!(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && env.STRIPE_SECRET_KEY),
}
