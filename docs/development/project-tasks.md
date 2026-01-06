# Project Tasks & Roadmap

This document captures the ongoing and planned tasks for the JobBoard project.

## ✅ Completed Tasks (Recent)
- [x] Create Centralized AI Provider (`src/lib/ai.ts`)
- [x] Refactor Completion API and Profile Actions
- [x] Centralize Server Actions (`src/actions/`)
- [x] Reorganize Components into Feature Folders
- [x] Extract `ApplicationCard` and create `useChat` hook
- [x] Clean up legacy files and organize documentation
- [x] **Smart Job View Tracking**: Track 24h-session based views with secure RPC.
- [x] **Real-time Notification Center**: Instant alerts for status changes and messages.

## 🚀 Ongoing / Upcoming
- [ ] **Type Safety**: Audit manual interfaces in `src/types/app.ts` and replace with Supabase schema where applicable.
- [ ] **Onboarding Flow**: Implement a "Role Selection" page for newly registered users.
- [ ] **Stripe Integration**: Connect the pricing cards to a hosted Stripe Checkout session.

## 🛠️ Ideas for Future
- [ ] AI-powered resume parsing for auto-filling seeker profiles.
- [ ] Email notifications using Resend for application feedback.
- [ ] Collaborative hiring tools (allowing multiple employers to review candidates).
