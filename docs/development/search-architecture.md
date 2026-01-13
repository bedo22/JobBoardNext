# Search and Filter Architecture: Client‑Side Today, Server‑Side Tomorrow

## Overview
- Goal: Fast, modern job search with filters and infinite scroll.
- Current implementation: Client‑Side Rendering (CSR) on `/jobs` for instant, app‑like interactions.
- Future plan: Add a Server‑Rendered (RSC/SSR) route for SEO‑first pages without losing UX quality.

## Current Approach (CSR on `/jobs`)
**What’s implemented**
- Filters (keyword, location, type, remote/hybrid) update instantly.
- URL reflects state (query params), enabling shareable links.
- Infinite scroll loads more results smoothly via `IntersectionObserver`.

**Why CSR first**
- Faster to build and iterate for a first Next.js project.
- Highly responsive UI with minimal complexity.
- Reuses shared components cleanly (`JobCard`, `JobFilters`, UI primitives).

**Trade‑offs**
- SEO: Search engines may index less reliably since results are fetched after JS loads.
- The initial HTML is a shell; content appears after client fetch.

## Planned Enhancement (SSR/RSC Route)
**What I’ll add next**
- A server‑rendered page (e.g., `/jobs-ssr`) that reads `searchParams` and fetches jobs on the server.
- Returns HTML for crawlers and link previews, improving SEO and shareability.
- Keep infinite scroll for subsequent pages via a small client component (best of both worlds).

**UX behavior**
- Changing filters updates the URL; the server re‑renders and streams updated HTML.
- Show a quick route‑level skeleton via `loading.tsx` or `Suspense` for smooth perception.

**SEO and performance**
- Crawlers receive HTML‑first results for any filtered URL.
- Can leverage Next caching (`revalidate` or cache tags) for stable data; auth‑sensitive paths use `no-store`.
- Optional `generateMetadata` to reflect current filters in title/description.

## Architecture Sketch
- Shared UI: `JobCard`, `JobFilters`, skeletons.
- Shared logic: helpers to parse/build filters from `searchParams`.
- Data access:
  - Server route uses a server Supabase client for initial HTML.
  - Client infinite scroll uses an API route or client Supabase for pages > 1.
- Link strategy:
  - Public nav can point to `/jobs-ssr` for SEO wins.
  - `/jobs` remains for instant, app‑like browsing.
  - Canonical tags can avoid duplicate content.

## Minimal SSR Example (Outline)
```tsx
// app/jobs-ssr/page.tsx (Server Component)
import { createClient } from "@/lib/supabase/server";

export default async function JobsSSR({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const filters = parseFilters(searchParams);
  const supabase = createClient();

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    // apply filters here
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">All Jobs (SSR)</h1>
      <div className="space-y-6">
        {jobs?.map(job => <JobCard key={job.id} job={job} />)}
      </div>
    </div>
  );
}

function parseFilters(searchParams: Record<string, any>) {
  // convert query params to your filter shape (search, location, type[], remote, hybrid)
  return {
    search: String(searchParams.search || ""),
    location: String(searchParams.location || ""),
    type: String(searchParams.type || "")?.split(",").filter(Boolean),
    remote: searchParams.remote === "true",
    hybrid: searchParams.hybrid === "true",
  };
}
```

## Why This Demonstrates Skill
- Shows understanding of modern Next.js patterns (App Router, Server Components, `searchParams`).
- Balances product goals: instant UX (CSR) and strong SEO (SSR/RSC).
- Clear migration path with minimal duplication via shared components and helpers.

## Optional Demo Plan (If Time Permits)
- Add `/jobs-ssr` as a minimal server‑rendered page; link to “Try instant client mode” (`/jobs`).
- Compare Lighthouse and crawlability between the two.
