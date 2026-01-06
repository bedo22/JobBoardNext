# Feature: Real-time Messaging

## Overview
The application features a real-time messaging system built on Supabase, allowing Employers and Seekers to communicate directly regarding specific job applications.

## Components

### 1. Database Schema
- **`conversations`**: Tracks unique chat instances between participants.
- **`messages`**: Stores individual chat entries with sender tracking and timestamps.

### 2. Live Communication
- **Supabase Realtime**: The `ChatWindow` component subscribes to the `messages` table for the specific `conversation_id`.
- **Instant Updates**: New messages appear in the UI immediately without page refreshes.

### 3. Logic: `useChat` Hook
To maintain consistency and simplify views, chat logic is encapsulated in a custom `useChat` hook.
- **Functions**: `openChat`, `closeChat`.
- **State**: Tracks `activeChat` (conversation details) and `isChatOpening` (loading state).

## User Flows

### Employer Side
1. Navigate to a job's applicant list.
2. Click the "Message" icon on an applicant card.
3. The Chat Sheet opens, and messages are synced to that specific candidate.

### Seeker Side
1. Navigate to the Seeker Dashboard.
2. View applications and click "Message Employer".
3. A similar chat interface allows follow-up or responding to queries.
