import { google } from '@ai-sdk/google'
import { streamText } from 'ai'
import { env } from '@/lib/env'
import { createClient } from '@/lib/supabase/server'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

// Simple in-memory rate limiter per IP (demo-grade)
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const RATE_LIMIT_MAX = 10 // 10 requests per window
const requestLog = new Map<string, number[]>()

function isRateLimited(ip: string) {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_WINDOW_MS
  const times = requestLog.get(ip)?.filter(t => t > windowStart) ?? []
  if (times.length >= RATE_LIMIT_MAX) return true
  times.push(now)
  requestLog.set(ip, times)
  return false
}

export async function POST(req: Request) {
  try {
    // Basic auth: require logged-in user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    // Rate limit by IP
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown'
    if (isRateLimited(ip)) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429 })
    }

    const { prompt, context } = await req.json()

    const modelId = env.AI_GOOGLE_MODEL || 'gemini-1.5-flash'

    const result = await streamText({
      model: google(modelId),
      system: `You are a professional HR assistant and technical recruiter.
Your task is to generate a concise, high-quality list of job requirements based on the provided job title and description.

Guidelines:
- Provide 5-8 specific, actionable requirements.
- Each requirement should be on a new line.
- Do NOT include numbering, bullet points (like * or -), or introductory text.
- Focus on skills, experience, and educational background appropriate for the role.
- Output ONLY the requirements, one per line.`,
      prompt: `Job Title: ${context.title}\nJob Description: ${context.description}\n\nAdditional context or request: ${prompt}`,
    })

    return result.toTextStreamResponse()
  } catch (err) {
    console.error('Completion API error', err)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}
