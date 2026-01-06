# 💼 JobBoard Elite: Premium Job Marketplace
### *Next.js 16 | Supabase Realtime | Gemini 2.5 Flash | Postgres RPC*

**JobBoard Elite** is a high-performance, real-time job marketplace designed as a "Proof of Competence" portfolio piece. It demonstrates mastery of modern full-stack architecture, AI orchestration, and production-grade security.

---

## 🚀 The Four Engineering Pillars

### 1. 🤖 AI Orchestration (HR Intelligence)
- **Engine**: Gemini 2.5 Flash + Vercel AI SDK.
- **Features**: 
    - **Smart Requirements Generator**: Real-time streaming (0ms latency feel) of structured job requirements.
    - **AI Career Coach**: Specialized system prompting to generate recruiter-grade professional bios.
- **Technical Highlight**: Implemented server-side streaming via Edge APIs with custom rate-limiting and auth-guards.

### 2. ⚡ Real-Time Pipeline (Unified Event Loop)
- **Engine**: Supabase Realtime (CDC + Broadcast).
- **Messaging**: Instant candidate-employer chat with optimistic UI updates.
- **Notification Engine**: Event-driven architecture that synchronizes unread counts and toast alerts across all active browser tabs.
- **Technical Highlight**: Custom React hooks (`useNotifications`, `useChat`) managing complex WebSocket state lifecycles.

### 3. 📊 High-Integrity Analytics Engine
- **Engine**: PostgreSQL RPC + Recharts.
- **Traffic Tracking**: Custom database functions to bypass client-side manipulation, ensuring "Unique View" accuracy.
- **Conversion Insights**: Multi-period distribution analysis (7d, 30d, All) with premium visual feedback.
- **Technical Highlight**: Strategic session-based debouncing to prevent view-stat inflation.

### 4. 🛡️ Enterprise-Grade Architecture
- **Framework**: Next.js 16 (Turbopack) with Feature-Scoped structure (`src/features`).
- **Security**: Strict Row Level Security (RLS) policies and modern revocable API key infrastructure.
- **Aesthetics**: "Midnight Emerald" theme using OKLCH color space for 100% color accuracy and premium glassmorphic UI.
- **Stable 16.1 Features**: Utilizing `'use cache'` for explicit performance control and the mandatory `proxy.ts` architecture. [[Learn More]](docs/architecture/proxy-gatekeeper.md)

---

## 🎨 Visual Excellence (Option B: Fluid Motion)

Designed to *wow* at first glance:
- **Hero Section**: Subtle animated gradient mesh and 3D-motion entry.
- **The Intelligence Feed**: A unified activity dashboard that makes the app feel "alive."
- **Premium Components**: Staggered animations, glassmorphism, and spotlight interactive cards.

---

## 🛠️ Technical Stack

| Category | Technology |
| :--- | :--- |
| **Core** | Next.js 16 (App Router), TypeScript 5, React 19.2 |
| **Styling** | Tailwind CSS v4, Framer Motion, Radix UI |
| **Backend** | Supabase SSR, PostgreSQL, Server Actions |
| **Real-time** | Supabase Realtime (WebSockets) |
| **AI** | Google Gemini (SDK), Vercel AI SDK |
| **Analytics** | Recharts, Custom SQL RPCs |
| **Forms/Validation** | React-Hook-Form, Zod |

---

## ⚙️ Environment Configuration

```env
# Supabase (Modern Keys)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SECRET_KEY=...

# AI Configuration
GOOGLE_GENERATIVE_AI_API_KEY=...
AI_GOOGLE_MODEL=gemini-2.5-flash
```

---

## 🚀 Getting Started

1.  **Clone & Install**:
    ```bash
    git clone ...
    npm install
    ```
2.  **Environment Setup**:
    - Copy `.env.example` to `.env` and fill in credentials.
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
4.  **Build Verification**:
    ```bash
    npm run build
    ```

---

## 👨‍💻 Developer & Portfolio

Built to demonstrate readiness for high-stakes SaaS development. Focus areas include performance optimization (Zero CLS), type-safe infrastructure, and delightful UX engineering.

**[Contact Me for Your Next Project]**
