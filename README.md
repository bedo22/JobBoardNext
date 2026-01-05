# JobBoard — Modern Job Marketplace (Next.js + Supabase)

A polished, responsive job marketplace built with Next.js. It’s designed to demonstrate production-quality full‑stack work for clients: fast job browsing with filters and infinite scroll, clean posting flow, employer analytics, strong mobile UX, and accessible UI.

## Highlights clients care about
- Fast job search with responsive filters and infinite scroll
- Clean job posting flow (validated with Zod)
- Employer dashboard with charts (Pie/Bar toggle, totals, %)
- Mobile-first design, no horizontal scroll, accessible dialogs and focus states
- SEO-ready metadata and viewport set correctly

## Demo (What you’ll see)
- Home: Hero with tasteful background and quick category chips
- Jobs: Filter by keyword/location/type/remote; URL updates; infinite scroll
- Job details: Full requirements; clean layout
- Dashboard (employer): Job type distribution chart with toggle and tooltips
- Pricing (demo): Ready to extend with Stripe Checkout (test mode) to sell job posts

## Why this is portfolio‑ready
- Next.js (App Router), Tailwind v4, Radix UI, TypeScript
- Supabase auth + queries (SSR-ready)
- Recharts analytics with solid UX (toggle, totals, % in tooltip)
- Lint/type/build discipline; Playwright smoke tests scaffolded
- Accessibility fixes (DialogTitle for sheets, alt text, focus outlines)

## AI integration (what’s implemented vs planned)
- Implemented now (server-side, streaming):
  - /api/completion uses ai + @ai-sdk/google (Gemini) to stream a concise list of requirements from a job title + description.
  - Auth required (Supabase user check). Demo-grade IP rate limiting (10 req / 10 min) and 30s max duration.
  - Strict prompt: returns 5–8 line-separated requirements, no bullets, suitable for quick paste into the form.
  - Intended usage in the Post Job flow via a “Generate requirements” button that streams into the requirements textarea.
- Why it matters for clients:
  - Shows practical, safe AI integration patterns: server-only keys, streaming UX, input constraints, and basic abuse protection.
- Planned enhancements (kept small and portfolio-friendly):
  - Cover letter draft from seeker profile + job description (server-side, streamed).
  - Optional moderation and length guards around prompts.
  - Caching short-lived results for quick retries.

## Roadmap for clients (quick wins I can ship)
- Stripe Checkout (hosted) in test mode with webhook to unlock “Pay‑per‑post”
- SSR variant of /jobs for SEO‑first browsing (searchParams)
- Trusted‑by logos strip and insights card on Home

## Setup (for reviewers)
1) Env
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
GOOGLE_GENERATIVE_AI_API_KEY=
AI_GOOGLE_MODEL=

```

2) Install & run
```
npm install
npm run dev
```

3) Test (optional)
```
npx playwright install
npm run build && npm start
npm run test:e2e
```

## Tech stack
- Framework: Next.js 16 (App Router)
- Styling: Tailwind CSS v4, Radix UI primitives, shadcn‑inspired components
- Data/Auth: Supabase (@supabase/ssr)
- Charts: Recharts
- Forms: React‑Hook‑Form + Zod
- Toaster: sonner

## Contact
Looking for a fast, modern landing or small app in Next.js? I offer:
- Landing Page + SEO Starter
- Mobile & Accessibility Polish Sprint
- Forms + Validation add‑on

Let’s talk about your project.
