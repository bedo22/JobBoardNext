# AI Integration Architecture

## Overview
The JobBoard application utilizes a centralized AI integration pattern to provide features like automated requirement generation and professional bio creation.

## Centralized AI Provider
All AI model interactions are managed through a single utility: `src/lib/ai.ts`.

### Key Components:
- **`getAIModel(modelId?: string)`**: 
  - Retrieves a configured Google Generative AI model instance.
  - Respects the `AI_GOOGLE_MODEL` environment variable.
  - Defaults to `gemini-1.5-flash`.
- **`generateProfileBio`**:
  - A server-side utility function that crafts professional summaries using Gemini.

## API Routes
- **`/api/completion`**:
  - Handles streaming AI responses for job requirements.
  - Uses the centralized `getAIModel` helper.
  - Includes authentication and basic rate limiting.

## Security & Best Practices
- **Server-Only Execution**: AI SDK calls are restricted to server-side logic (Server Actions and API Routes) to protect API keys.
- **Environment Variables**: Managed via `env.GOOGLE_GENERATIVE_AI_API_KEY`.
- **Response Constraints**: Prompt engineering is used to ensure concise, formatted output suitable for UI consumption.
