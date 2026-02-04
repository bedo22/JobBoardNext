# JobBoard Elite - Backend Architecture Documentation

**Last Updated:** January 22, 2026  
**Project:** JobBoard Elite (Next.js 16 + Supabase)  
**Purpose:** Complete backend reference for freelance proposals and technical interviews

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Authentication System](#2-authentication-system)
3. [Database Layer (Supabase)](#3-database-layer-supabase)
4. [Server Actions](#4-server-actions)
5. [API Routes](#5-api-routes)
6. [AI Integration](#6-ai-integration)
7. [Payment Processing (Stripe)](#7-payment-processing-stripe)
8. [Notification System](#8-notification-system)
9. [Security & Middleware](#9-security--middleware)
10. [Environment Configuration](#10-environment-configuration)

---

## 1. Architecture Overview

### Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** Supabase (PostgreSQL + Auth + RLS)
- **AI:** Google Gemini (via Vercel AI SDK)
- **Payments:** Stripe (Subscriptions)
- **Deployment:** Vercel

### Architecture Pattern

```
┌─────────────────────────────────────────────────────┐
│  Client (React Server Components + Client Islands)  │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│  Next.js 16 Middleware (proxy.ts)                   │
│  • Session Management                               │
│  • Security Headers                                 │
│  • Request Tracing                                  │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
┌───────▼────────┐   ┌────────▼────────┐
│ Server Actions │   │   API Routes    │
│ (src/actions)  │   │   (src/app/api) │
└───────┬────────┘   └────────┬────────┘
        │                     │
        └──────────┬──────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│  Supabase Client (SSR-optimized)                    │
│  • Auth (JWT + Cookies)                             │
│  • Database (PostgreSQL + RLS)                      │
│  • Real-time Subscriptions                          │
└─────────────────────────────────────────────────────┘
```

---

## 2. Authentication System

### Implementation Files

- **Middleware:** `src/lib/supabase/middleware.ts`
- **Server Client:** `src/lib/supabase/server.ts`
- **Proxy:** `src/proxy.ts`

### Flow Diagram

```
User Request
    │
    ▼
[proxy.ts] → Inject Security Headers + Request ID
    │
    ▼
[middleware.ts] → Check Session (Supabase SSR)
    │
    ├─ Protected Route + No Session → Redirect to /login
    │
    └─ Valid Session → Continue to Page
```

### Key Features

#### 1. Session Management (`middleware.ts`)

```typescript
// Optimized for performance
export async function updateSession(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isProtectedRoute =
        path.startsWith('/dashboard') ||
        path.startsWith('/jobs/post')

    // Skip auth check for public routes without cookies
    const hasAuthCookies = request.cookies.getAll()
        .some(cookie => cookie.name.startsWith('sb-'))

    if (!isProtectedRoute && !hasAuthCookies) {
        return NextResponse.next()
    }

    // Supabase SSR Client
    const supabase = createServerClient(...)
    const { data: { session } } = await supabase.auth.getSession()

    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return response
}
```

**Protected Routes:**

- `/dashboard/*` (All dashboard pages)
- `/jobs/post` (Job posting form)

#### 2. Server-Side Client (`server.ts`)

```typescript
// Used in Server Components and Server Actions
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );
}
```

**Usage Pattern:**

```typescript
const supabase = await createClient();
const {
  data: { user },
} = await supabase.auth.getUser();
```

---

## 3. Database Layer (Supabase)

### Schema Overview

#### Core Tables

1. **`profiles`** - User profiles (extends Supabase Auth)
2. **`jobs`** - Job postings
3. **`applications`** - Job applications
4. **`saved_jobs`** - Saved/bookmarked jobs
5. **`notifications`** - In-app notifications
6. **`conversations`** - Messaging threads
7. **`messages`** - Individual messages

### Row-Level Security (RLS)

**Example: Jobs Table**

```sql
-- Employers can only update their own jobs
CREATE POLICY "Employers can update own jobs"
ON jobs FOR UPDATE
USING (auth.uid() = employer_id);

-- Anyone can view published jobs
CREATE POLICY "Anyone can view jobs"
ON jobs FOR SELECT
USING (true);
```

### Database Functions

#### 1. Increment Job Views (Atomic Counter)

```sql
CREATE OR REPLACE FUNCTION increment_job_views(job_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE jobs
    SET views_count = views_count + 1
    WHERE id = job_id;
END;
$$ LANGUAGE plpgsql;
```

**Usage in Server Action:**

```typescript
await supabase.rpc("increment_job_views", { job_id: jobId });
```

---

## 4. Server Actions

**Location:** `src/actions/*.ts`

All server actions use the `"use server"` directive and follow this security pattern:

### Security Pattern

```typescript
"use server";

export async function secureAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // ✅ SECURE: Server determines identity from session
  // ❌ NEVER accept userId as a parameter from client
  const userId = user.id;

  // Perform action...
}
```

### Available Actions

#### Jobs (`actions/jobs.ts`)

- **`incrementJobView(jobId)`** - Atomic view counter
- **`getEmployerJobsWithStats()`** - Fetch employer's jobs with applicant counts

#### Applications (`actions/applications.ts`)

- **`submitApplication({ jobId, coverLetter, resumeUrl })`**
  - Inserts application
  - Sends notification to employer
  - Revalidates cache
- **`updateApplicationStatus(applicationId, status, jobId)`**
  - Verifies job ownership
  - Updates status
  - Notifies applicant

#### Notifications (`actions/notifications.ts`)

- **`sendNotification({ userId, type, title, message, link })`**
- **`markNotificationAsRead(notificationId)`**
- **`markAllNotificationsAsRead()`**

#### Profile (`actions/profile.ts`)

- **`updateProfile(profileData)`** - Updates user profile with validation

#### Saved Jobs (`actions/saved-jobs.ts`)

- **`toggleSaveJob(jobId)`** - Bookmark/unbookmark jobs

#### Stripe (`actions/stripe.ts`)

- **`createCheckoutSession(priceId)`** - Initiates Stripe subscription flow

---

## 5. API Routes

**Location:** `src/app/api/*`

### 1. AI Completion (`/api/completion`)

```typescript
// POST /api/completion
// Generates job requirements using Gemini AI

export async function POST(req: Request) {
  const { jobTitle, jobDescription } = await req.json();

  const result = await streamText({
    model: aiModel,
    prompt: `Generate 5-7 job requirements for: ${jobTitle}...`,
  });

  return result.toDataStreamResponse();
}
```

**Client Usage:**

```typescript
const { completion } = useCompletion({
  api: "/api/completion",
  body: { jobTitle, jobDescription },
});
```

### 2. Stripe Webhook (`/api/webhooks/stripe`)

```typescript
// POST /api/webhooks/stripe
// Handles Stripe events (subscription created, updated, canceled)

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

  switch (event.type) {
    case "checkout.session.completed":
      // Update user subscription status
      break;
    case "customer.subscription.deleted":
      // Handle cancellation
      break;
  }

  return new Response("OK", { status: 200 });
}
```

---

## 6. AI Integration

**Location:** `src/lib/ai.ts`

### Configuration

```typescript
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export function getAIModel(modelId?: string) {
  const selectedModel = modelId || env.AI_GOOGLE_MODEL || "gemini-1.5-flash";
  return google(selectedModel);
}

export const aiModel = getAIModel();
```

### Use Cases

#### 1. Profile Bio Generation

```typescript
export async function generateProfileBio({ name, role, skills, experience }) {
  const prompt = `
        Write a professional bio for a ${role} named ${name}.
        Skills: ${skills.join(", ")}
        Experience: ${experience || "Not specified"}
    `;

  const { text } = await generateText({
    model: aiModel,
    prompt,
  });

  return text.trim();
}
```

#### 2. Job Requirements (Streaming)

Used in the Post Job page for real-time AI-generated requirements.

---

## 7. Payment Processing (Stripe)

**Location:** `src/actions/stripe.ts`, `src/lib/stripe.ts`

### Flow

```
User clicks "Subscribe"
    │
    ▼
createCheckoutSession(priceId)
    │
    ├─ Check/Create Stripe Customer
    │
    ├─ Create Checkout Session
    │
    └─ Return session.url
    │
    ▼
User redirected to Stripe Checkout
    │
    ▼
Payment Success → Webhook → Update DB
```

### Implementation

```typescript
export async function createCheckoutSession(priceId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Get or create Stripe customer
  let customerId = profile?.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_uid: user.id },
    });
    customerId = customer.id;
    // Save to DB
  }

  // 2. Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${siteUrl}/dashboard?payment=success`,
    cancel_url: `${siteUrl}/pricing`,
  });

  return { url: session.url };
}
```

---

## 8. Notification System

**Location:** `src/lib/notification-service.ts`

### Architecture

Centralized service for all notification types with proper routing and metadata.

### Notification Types

```typescript
type NotificationType =
  | "message" // New message received
  | "application" // New application
  | "status_change" // Application status updated
  | "system"; // System announcements
```

### Key Functions

#### 1. Message Notifications

```typescript
await sendMessageNotification({
  userId: recipientId,
  senderId: currentUserId,
  conversationId,
  jobId,
  jobTitle,
  messagePreview,
  senderName,
  recipientRole: "employer" | "seeker",
});
```

**Routing Logic:**

- Employer → `/messages/${conversationId}`
- Seeker → `/messages/${conversationId}`

#### 2. Application Notifications

```typescript
await sendApplicationNotification({
  userId: employerId,
  applicationId,
  jobId,
  jobTitle,
  applicantName,
});
```

**Link:** `/dashboard/applicants/${jobId}`

### Admin Client Pattern

```typescript
// Singleton pattern for performance
let adminClientInstance: ReturnType<typeof createSupabaseClient> | null = null;

function getAdminClient() {
  if (!adminClientInstance) {
    adminClientInstance = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }
  return adminClientInstance;
}
```

---

## 9. Security & Middleware

**Location:** `src/proxy.ts`

### Security Headers Injected

```typescript
export default async function proxy(request: NextRequest) {
  const requestId = crypto.randomUUID();
  let response = await updateSession(request);

  // Security Headers
  response.headers.set("X-Request-ID", requestId);
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  return response;
}
```

### Request Tracing

Every request gets a unique `X-Request-ID` for debugging and monitoring.

### Route Protection

```typescript
const isProtectedRoute =
  path.startsWith("/dashboard") || path.startsWith("/jobs/post");

if (isProtectedRoute && !session) {
  return NextResponse.redirect(new URL("/login", request.url));
}
```

---

## 10. Environment Configuration

**Location:** `src/lib/env.ts`

### Required Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# AI (Google Gemini)
AI_GOOGLE_API_KEY=AIzaSyxxx...
AI_GOOGLE_MODEL=gemini-1.5-flash

# Stripe (Optional - Demo mode if not set)
STRIPE_SECRET_KEY=sk_test_xxx...
STRIPE_PUBLISHABLE_KEY=pk_test_xxx...
STRIPE_WEBHOOK_SECRET=whsec_xxx...

# App
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Validation Pattern

```typescript
import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  AI_GOOGLE_API_KEY: z.string().min(1),
  // ... other fields
});

export const env = envSchema.parse(process.env);
```

---

## Quick Reference: Common Patterns

### 1. Fetch User Data in Server Component

```typescript
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return <div>{data.full_name}</div>
}
```

### 2. Create a Server Action

```typescript
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function myAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  // Perform action
  const { error } = await supabase
    .from("table")
    .insert({ user_id: user.id, ...data });

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}
```

### 3. Send a Notification

```typescript
import { sendNotification } from "@/actions/notifications";

await sendNotification({
  userId: targetUserId,
  type: "status_change",
  title: "Application Updated",
  message: 'Your application status changed to "Reviewed"',
  link: "/dashboard/applications",
});
```

---

## Performance Optimizations

### 1. Middleware Optimization

- Skip auth check for public routes without Supabase cookies
- Reduces unnecessary database calls

### 2. Server Actions

- Use `revalidatePath()` for targeted cache invalidation
- Avoid full page reloads

### 3. Database

- RLS policies prevent unauthorized access at the database level
- Atomic operations (e.g., `increment_job_views`) prevent race conditions

### 4. Singleton Pattern

- Admin Supabase client reused across notification calls
- AI model instance cached

---

## Deployment Checklist

- [ ] Set all environment variables in Vercel
- [ ] Configure Stripe webhook endpoint
- [ ] Run Supabase migrations
- [ ] Enable RLS on all tables
- [ ] Test protected routes
- [ ] Verify Stripe test mode works
- [ ] Test AI generation with rate limits
- [ ] Configure CORS for API routes (if needed)

---

## Support & Maintenance

### Monitoring

- **Request Tracing:** Use `X-Request-ID` header for debugging
- **Error Logs:** Check Vercel logs for server action errors
- **Stripe Dashboard:** Monitor subscription events

### Common Issues

1. **"Not authenticated" errors:** Check cookie settings and session expiry
2. **RLS violations:** Verify policies match user roles
3. **Stripe webhook failures:** Confirm webhook secret matches

---

**End of Backend Documentation**
