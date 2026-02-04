# 🚀 Fast-Track Codebase Understanding Guide

## Your Codebase: JobBoard Elite

A Next.js 16 job marketplace with AI, real-time features, and Stripe payments.

---

## 📋 **30-Minute Understanding Strategy**

### **Phase 1: High-Level Overview** (5 minutes)

#### 1. **Read Core Documentation**

- ✅ [README.md](file:///e:/Freelancer/Next.js/job-board/README.md) - Tech stack, features, setup
- [docs/ROADMAP.md](file:///e:/Freelancer/Next.js/job-board/docs/ROADMAP.md) - Future plans
- [docs/development/project-tasks.md](file:///e:/Freelancer/Next.js/job-board/docs/development/project-tasks.md) - Current work

#### 2. **Understand the Tech Stack**

```
Frontend:  Next.js 16 + React 19 + TypeScript + Tailwind v4
Backend:   Supabase (PostgreSQL + Auth + Realtime)
Payments:  Stripe Checkout + Webhooks
AI:        Google Gemini 2.5 Flash + Vercel AI SDK
UI:        Radix UI + Framer Motion + Glassmorphism
```

---

### **Phase 2: Architecture Map** (10 minutes)

#### **Project Structure**

```
src/
├── app/                    # Next.js App Router (pages)
│   ├── (auth)/            # Auth pages (login, signup)
│   ├── dashboard/         # Employer dashboard
│   ├── jobs/              # Job listings & details
│   ├── messages/          # Real-time chat
│   └── api/               # API routes (webhooks, AI)
│
├── components/            # React components
│   ├── features/          # Feature-specific components
│   │   ├── dashboard/     # Dashboard views
│   │   ├── jobs/          # Job cards, forms
│   │   ├── marketing/     # Landing page components
│   │   └── messaging/     # Chat components
│   ├── layout/            # Navbar, Footer
│   └── ui/                # Shadcn/Radix primitives
│
├── actions/               # Server Actions
│   ├── jobs.ts            # Job CRUD operations
│   ├── payments.ts        # Stripe integration
│   └── messaging.ts       # Chat operations
│
├── hooks/                 # Custom React hooks
│   ├── use-auth.ts        # Authentication state
│   ├── use-notifications.ts  # Real-time notifications
│   └── use-chat.ts        # Real-time messaging
│
├── lib/                   # Utilities & configs
│   ├── supabaseClient.ts  # Supabase client
│   ├── stripe.ts          # Stripe client
│   └── ai/                # AI integration
│
└── types/                 # TypeScript definitions
    ├── app.ts             # Core types (Job, Profile)
    └── supabase.ts        # Auto-generated DB types
```

#### **Key Architectural Patterns**

1. **Server Components by Default**
   - Most pages are Server Components
   - Client Components marked with `"use client"`
   - Server Actions for mutations

2. **Feature-Based Organization**
   - Components grouped by feature (`dashboard/`, `jobs/`, `messaging/`)
   - Each feature has its own views, forms, and logic

3. **Real-Time Architecture**
   - Supabase Realtime for WebSocket connections
   - Custom hooks manage subscription lifecycles
   - Optimistic UI updates

---

### **Phase 3: Data Flow** (10 minutes)

#### **Database Schema (Supabase)**

```sql
profiles          # User accounts (employer/seeker)
jobs              # Job listings
applications      # Job applications
messages          # Chat messages
notifications     # User notifications
subscriptions     # Stripe subscriptions
```

#### **Authentication Flow**

```
1. User signs up → Supabase Auth creates user
2. Trigger creates profile record
3. User selects role (employer/seeker)
4. RLS policies enforce data access
```

#### **Key Data Flows**

**Job Posting Flow:**

```
1. Employer fills form → /jobs/post
2. Optional: AI generates requirements
3. Server Action: createJob()
4. Supabase insert with RLS check
5. Redirect to dashboard
```

**Real-Time Messaging:**

```
1. useChat hook subscribes to messages
2. User sends message → Server Action
3. Supabase broadcasts to subscribers
4. UI updates optimistically
```

**Payment Flow:**

```
1. User clicks subscribe → Stripe Checkout
2. Stripe redirects back with session_id
3. Webhook confirms payment
4. Server Action updates subscription
```

---

### **Phase 4: Critical Files** (5 minutes)

#### **Must-Read Files**

| File                                                                                             | Purpose               | Priority  |
| ------------------------------------------------------------------------------------------------ | --------------------- | --------- |
| [src/app/layout.tsx](file:///e:/Freelancer/Next.js/job-board/src/app/layout.tsx)                 | Root layout, metadata | 🔴 High   |
| [src/app/dashboard/page.tsx](file:///e:/Freelancer/Next.js/job-board/src/app/dashboard/page.tsx) | Main dashboard logic  | 🔴 High   |
| [src/hooks/use-auth.ts](file:///e:/Freelancer/Next.js/job-board/src/hooks/use-auth.ts)           | Auth state management | 🔴 High   |
| [src/lib/supabaseClient.ts](file:///e:/Freelancer/Next.js/job-board/src/lib/supabaseClient.ts)   | Database client       | 🔴 High   |
| [src/actions/jobs.ts](file:///e:/Freelancer/Next.js/job-board/src/actions/jobs.ts)               | Job operations        | 🟡 Medium |
| [src/actions/payments.ts](file:///e:/Freelancer/Next.js/job-board/src/actions/payments.ts)       | Stripe integration    | 🟡 Medium |

---

## 🎯 **Quick Navigation Strategies**

### **Strategy 1: Follow User Journeys**

**Employer Journey:**

```
1. Landing page → src/app/page.tsx
2. Sign up → src/app/(auth)/signup/page.tsx
3. Dashboard → src/app/dashboard/page.tsx
4. Post job → src/app/jobs/post/page.tsx
5. View applicants → src/app/dashboard/applicants/[jobId]/page.tsx
```

**Job Seeker Journey:**

```
1. Browse jobs → src/app/jobs/page.tsx
2. View details → src/app/jobs/[id]/page.tsx
3. Apply → Server Action in src/actions/jobs.ts
4. Chat → src/app/messages/page.tsx
```

### **Strategy 2: Trace Features**

**Want to understand AI integration?**

1. Start: [docs/architecture/ai-integration.md](file:///e:/Freelancer/Next.js/job-board/docs/architecture/ai-integration.md)
2. API: `src/app/api/ai/generate-requirements/route.ts`
3. Usage: `src/components/features/jobs/job-post-form.tsx`

**Want to understand payments?**

1. Docs: [docs/learning/stripe-roadmap.md](file:///e:/Freelancer/Next.js/job-board/docs/learning/stripe-roadmap.md)
2. Actions: [src/actions/payments.ts](file:///e:/Freelancer/Next.js/job-board/src/actions/payments.ts)
3. Webhook: `src/app/api/webhooks/stripe/route.ts`

### **Strategy 3: Search by Pattern**

**Find all Server Actions:**

```bash
# Search for "use server"
grep -r "use server" src/actions/
```

**Find all Client Components:**

```bash
# Search for "use client"
grep -r "use client" src/components/
```

**Find all API routes:**

```bash
# List all route.ts files
find src/app/api -name "route.ts"
```

---

## 🔍 **Deep Dive Checklist**

When you need to modify a feature:

- [ ] **Find the page** - Check `src/app/` for the route
- [ ] **Identify components** - Look in `src/components/features/`
- [ ] **Check Server Actions** - Review `src/actions/`
- [ ] **Understand data flow** - Trace from UI → Action → Database
- [ ] **Check types** - Review `src/types/app.ts` for data structures
- [ ] **Test locally** - Run `npm run dev` and verify changes

---

## 💡 **Pro Tips**

### **1. Use TypeScript as Documentation**

- Hover over functions to see types
- Check `src/types/app.ts` for core interfaces
- Auto-generated types in `src/types/supabase.ts`

### **2. Follow the Imports**

- Start from a page component
- Follow imports to understand dependencies
- Use "Go to Definition" (F12) aggressively

### **3. Check Recent Changes**

- Review conversation history for context
- Check `docs/development/project-tasks.md` for current work
- Look at git history for recent modifications

### **4. Run the App**

```bash
npm run dev
```

- Click through the UI
- Open DevTools → Network tab
- See what API calls are made
- Inspect component hierarchy

### **5. Read Error Messages**

- Linter errors point to problematic patterns
- TypeScript errors reveal data flow
- Console logs show runtime behavior

---

## 🎓 **Learning Path by Role**

### **If You're a Frontend Developer:**

1. Start with `src/components/`
2. Understand component composition
3. Check `src/hooks/` for state management
4. Review Framer Motion animations

### **If You're a Backend Developer:**

1. Start with `src/actions/`
2. Understand Server Actions pattern
3. Review database schema in Supabase
4. Check RLS policies

### **If You're Full-Stack:**

1. Follow a complete user journey
2. Trace data from UI → Server → Database
3. Understand real-time subscriptions
4. Review payment integration

---

## 🚨 **Common Gotchas**

1. **"use client" vs Server Components**
   - Server Components can't use hooks or browser APIs
   - Client Components can't directly access server-only code

2. **Supabase RLS Policies**
   - All database access is restricted by Row Level Security
   - Check policies if queries return empty results

3. **Environment Variables**
   - `NEXT_PUBLIC_*` are exposed to browser
   - Others are server-only
   - Check `.env.example` for required vars

4. **Date.now() in Render**
   - React Compiler enforces purity
   - Use `useMemo` or calculate in parent component
   - (You just fixed this! ✅)

---

## 📚 **Additional Resources**

- [Next.js 16 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Integration Guide](https://stripe.com/docs/payments/checkout)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)

---

**🎯 Bottom Line:** Start with user journeys, follow the data flow, and use TypeScript as your guide. You'll understand 80% of the codebase in 30 minutes!
