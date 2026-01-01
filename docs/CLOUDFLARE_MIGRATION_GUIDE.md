# Migration Guide: Vite to Next.js on Cloudflare Pages

This document outlines the critical steps to migrate your existing React Vite project to Next.js 16 (App Router) while preserving your Git history and ensuring successful deployment on Cloudflare Pages.

## 1. Architectural Changes
Moving from Vite (Client-Side Rendering) to Next.js (Server-Side Rendering + Edge Functions) requires a different build process. You cannot simply deploy the Next.js app with the old Vite settings.

## 2. Git Strategy (Safety First)
**Goal:** Keep your history but don't break the live site immediately.

1.  **Create a Migration Branch:**
    ```bash
    git checkout -b feature/nextjs-migration
    ```
2.  **Commit your changes:**
    ```bash
    git add .
    git commit -m "Refactor: Migrate to Next.js 16 with Supabase"
    ```
3.  **Push to remote:**
    ```bash
    git push origin feature/nextjs-migration
    ```

## 3. Project Configuration for Cloudflare
Cloudflare Pages needs an adapter to run Next.js Server Actions and API routes on the Edge.

### Step 3.1: Install Adapter
```bash
npm install --save-dev @cloudflare/next-on-pages
```

### Step 3.2: Update `package.json`
Add the `pages:build` script. This is the command Cloudflare MUST use.
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "pages:build": "npx @cloudflare/next-on-pages",
  "start": "next start",
  "lint": "eslint"
}
```

## 4. Cloudflare Dashboard Settings
**Crucial Step:** You must update your build settings in the Cloudflare Dashboard before merging to main, or the build will fail.

Go to: **Settings > Builds & deployments > Edit Configuration**

| Setting | Old Value (Vite) | **New Value (Next.js)** |
| :--- | :--- | :--- |
| **Framework Preset** | Vite / React | **Next.js (Static/Edge)** OR `None` |
| **Build Command** | `npm run build` | `npm run pages:build` |
| **Output Directory** | `dist` | `.vercel/output/static` |

**Note:** If `.vercel/output/static` doesn't work, ensure you are using the latest version of `@cloudflare/next-on-pages`.

## 5. Environment Variables
You must add your new keys to Cloudflare (Settings > Environment variables). These are required for the build and runtime.

*   `NEXT_PUBLIC_SUPABASE_URL`
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
*   `GOOGLE_GENERATIVE_AI_API_KEY` (Required for AI features)

## 6. Testing Strategy
1.  Push the branch.
2.  Wait for Cloudflare to build the **Preview Deployment**.
3.  **Test specific Next.js features:**
    *   **Server Actions:** Try posting a job. If it fails (405 Method Not Allowed), the Cloudflare adapter isn't configured correctly.
    *   **Auth:** Try logging in.
    *   **AI:** Try generating a description.

## 7. Troubleshooting
*   **Error:** "Edge Runtime is not supported"
    *   **Fix:** Ensure you are using the `pages:build` command, not `next build`.
*   **Error:** Form submissions fail.
    *   **Fix:** Check if your page needs `export const runtime = 'edge'` (though usually auto-detected).

---
**Verdict:** Do not overwrite your `main` branch until the Preview Deployment on Cloudflare is 100% functional.
