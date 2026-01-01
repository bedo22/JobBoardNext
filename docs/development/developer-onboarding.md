# Developer Onboarding: Quickstart Architecture Guide

If this is your first time seeing this project, this guide will help you understand the "Mental Model" of the app in **10 minutes** so you can start adding value immediately.

---

## 1. The Architectural "Stack"
This app follows a **Clean Hybrid** architecture:
- **Routing & Shell**: Next.js 16 (App Router).
- **Persistence**: Supabase (Database & Auth).
- **UI Logic**: React Client Components (for interactivity).
- **Styling**: Tailwind CSS v4 + Shadcn UI.

---

## 2. Trace the "Data Life Cycle"
To understand any feature, follow this path:

1. **The Entry Point**: Look in `src/app/` (e.g., `app/jobs/page.tsx`).
2. **The Logic Bridge**: Look for a **Hook** (e.g., `src/hooks/use-jobs.ts`). This is where the Supabase query lives.
3. **The Data Source**: Check `src/lib/supabase/client.ts`. This is the global configuration.
4. **The UI Component**: Shadcn components live in `src/components/ui`. Functional components (like `JobCard`) live in `src/components/`.

---

## 3. How to "Add Value" in Your First 2 Hours
If you want to impress a client or prove your ability, don't try to refactor the whole app. Focus on these **Value Hotspots**:

### ⚡️ The "Jobs Detail" Hotspot (`src/app/jobs/[id]/page.tsx`)
- **Action**: Add a "Share to LinkedIn" button or improve the "Company Info" display.
- **Why**: It's one of the most viewed pages and touches both data fetching and UI.

### ⚡️ The "Form Validation" Hotspot (`src/app/jobs/post/page.tsx`)
- **Action**: Add better error messages or a "Character Counter" for the job description.
- **Why**: Proves you care about User Experience (UX) and data integrity.

### ⚡️ The "Global Search" Hotspot (`src/components/job-filters.tsx`)
- **Action**: Add a new filter (e.g., "Remote Only" toggle or "Salary Range").
- **Why**: High visual impact. Clients love seeing functional filters.

---

## 4. The "File Mapper" (Cheat Sheet)

| If you want to change... | Go to... |
| :--- | :--- |
| **Login/Signup Logic** | `src/hooks/use-auth.ts` |
| **Site Branding (Colors/Fonts)** | `src/index.css` |
| **Navigation Menu Items** | `src/components/layout/navbar.tsx` |
| **Database Queries** | `src/lib/supabase/` |
| **Permissions/Security** | `src/proxy.ts` |

---

## 5. Success Path for a "Day 1" Developer
1. **Run**: `npm run dev` and navigate the site.
2. **Break it**: Change a color in `index.css` or text in `navbar.tsx` to see it reflect.
3. **Audit**: Open `use-jobs.ts` and see how it calls `supabase.from('jobs')`.
4. **Fix/Add**: Pick one small thing from the "Value Hotspots" above and implement it.

**Done.** You are now a productive contributor to this JobBoard!
