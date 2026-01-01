JobBoard is a modern, production-ready job marketplace built with Next.js, Supabase, and a polished component system. It demonstrates full-stack competence suitable for freelance and startup work: posting jobs, browsing with filters and infinite scroll, analytics for employers, authentication, and AI-assisted content.

## Features

- Browse jobs with fast filters and infinite scroll
- Post new jobs (server actions + Zod validation)
- Employer dashboard with analytics (Recharts)
- Authentication with Supabase (SSR and client)
- Theming, accessible UI primitives, and skeletons
- AI-assisted requirements generator

## Tech Stack

- Framework: Next.js (App Router)
- Database/Auth: Supabase (@supabase/ssr)
- UI: Tailwind CSS v4, Radix UI, shadcn-inspired components, sonner
- Charts: Recharts
- Forms/Validation: React Hook Form, Zod
- AI: ai + @ai-sdk/google
- TypeScript, ESLint (Next core web vitals)

## Architecture

- app/: App Router pages, server actions, API routes
- components/: UI, layout, analytics
- lib/: env validation, supabase clients, utils, validation schemas
- hooks/: auth, jobs
- types/: generated Supabase types, app types

## Setup

1) Prerequisites
- Node 18+
- Supabase project with jobs table and auth enabled

2) Environment variables
Create a .env.local file:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# Optional AI
GOOGLE_GENERATIVE_AI_API_KEY=...
AI_GOOGLE_MODEL=gemini-1.5-flash
```

3) Install and run

```bash
npm install
npm run dev
```

## Scripts

- dev: start Next dev server
- build/start: production build
- lint: run ESLint

## Demo data (optional)

A seed script can populate sample jobs and accounts for demos. (Planned in roadmap.)

## Deployment

- Vercel or Cloudflare Pages (see docs/setup-guide.md)
- Ensure env vars are set; consider adding observability and rate limiting in production

## Roadmap and Docs

See docs/README.md for the full documentation and the improvement plan.



Alternatively, run with bun/pnpm/yarn as you prefer.

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
