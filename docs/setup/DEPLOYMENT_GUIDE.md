# Deployment Strategy: Vercel vs. Cloudflare

**Recommendation:** Start with **Vercel**. 
Move to **Cloudflare** only if you hit scale limits or specific cost constraints later.

---

## Option 1: Vercel (Recommended for MVP/Portfolios)
Vercel is the "native" home of Next.js. It requires zero configuration.

### Steps to Deploy
1.  **Push to GitHub:**
    Ensure your latest code (with the `Job` type fixes) is on your `main` branch.
    ```bash
    git add .
    git commit -m "Ready for deployment"
    git push origin main
    ```

2.  **Connect to Vercel:**
    *   Log in to [vercel.com](https://vercel.com).
    *   Click **"Add New..."** > **"Project"**.
    *   Select your `job-board` repository.

3.  **Configure Project:**
    *   **Framework Preset:** Next.js (Auto-detected).
    *   **Build Command:** `npm run build` (Default).
    *   **Environment Variables:** Copy these from your `.env.local`:
        *   `NEXT_PUBLIC_SUPABASE_URL`
        *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
        *   `GOOGLE_GENERATIVE_AI_API_KEY`

4.  **Deploy:**
    *   Click **Deploy**.
    *   Vercel will build your site and give you a `https://job-board-xyz.vercel.app` domain.

### Why Vercel?
*   **Zero Config:** Server Actions, Images, and SSR work out of the box.
*   **Logs:** Real-time logs make debugging production issues easy.
*   **Speed:** It's optimized for Next.js caching strategies.

---

## Option 2: Cloudflare Pages (Advanced / "Level 2")
Cloudflare is cheaper for high-traffic sites but requires an adapter (`@cloudflare/next-on-pages`) and limits some Node.js features because it runs on the "Edge".

**Use this only if:**
*   Vercel becomes too expensive.
*   You specifically want to learn Edge computing.
*   You want to "show off" advanced DevOps skills.


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

