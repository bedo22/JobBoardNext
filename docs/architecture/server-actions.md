# Server Actions Architecture

## Pattern Overview
The application follows a centralized Server Actions pattern to ensure reusability, type safety, and a clear separation between UI and business logic.

## Directory Structure
All server-side actions are located in the `src/actions/` directory, organized by feature area:

- **`src/actions/applications.ts`**:
  - Manages job application states (e.g., `updateApplicationStatus`).
  - Handles database updates in the `applications` table.
- **`src/actions/messaging.ts`**:
  - Logic for conversation initialization and retrieval.
  - `getOrCreateConversation`: Ensures a unique conversation exists between a seeker and an employer for a specific job.
- **`src/actions/profile.ts`**:
  - Handles profile updates and AI-related profile enhancements.

## Benefits
- **Shared Logic**: Actions can be invoked by both Employer and Seeker views without duplication.
- **Maintainability**: Centralizing actions makes it easier to audit database interactions and authentication checks.
- **Type Safety**: Leverages Supabase-generated types for consistent data handling.

## Best Practices
1. **Authentication**: All actions must verify the user's session before performing database operations.
2. **Revalidation**: Use `revalidatePath` or `revalidateTag` to ensure the UI stays in sync with database changes.
3. **Error Handling**: Standardize error returns to provide consistent feedback to the UI (e.g., `{ error: string }`).
