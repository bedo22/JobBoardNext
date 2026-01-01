import { z } from 'zod'

const EnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(10),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(10).optional(),
  AI_GOOGLE_MODEL: z.string().optional(),
})

// Read from process.env but validate once at module load
const parsed = EnvSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  AI_GOOGLE_MODEL: process.env.AI_GOOGLE_MODEL,
})

if (!parsed.success) {
  const formatted = parsed.error.format()
  // Throw a clear error to fail fast in dev/build
  throw new Error(`Invalid environment variables: ${JSON.stringify(formatted, null, 2)}`)
}

export const env = parsed.data
