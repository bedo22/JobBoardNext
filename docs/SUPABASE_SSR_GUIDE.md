# Understanding `@supabase/ssr` (The Modern Standard)

In this project, we are using the newer `@supabase/ssr` library. If you have used Supabase before, you likely used the "Auth Helpers" or just the "Browser Client." Here is why we switched.

---

## 1. Evolution of Supabase in Next.js

| Library | Era | Best For | Status |
| :--- | :--- | :--- | :--- |
| **`supabase-js`** | Early Days | Client-side only apps (Vite/CRA) | Active (but tricky for SSR) |
| **`auth-helpers-nextjs`** | Next 13/14 | Pages Router + Early App Router | **Deprecated/Legacy** |
| **`@supabase/ssr`** | **Next 15/16+** | **App Router (Server Components)** | **Current Standard** |

---

## 2. Why use `@supabase/ssr`?

Next.js 16 is "Server First." This means the server needs to know who the user is *before* the page sends any HTML to the browser.

1. **Shared Cookies**: `@supabase/ssr` automatically handles the complex logic of writing and reading cookies that work on both the **Server** (Server Actions/Middleware) and the **Client** (Browser hooks).
2. **PKCE Flow**: It uses a more secure authentication flow that prevents hackers from intercepting login codes.
3. **No "Flicker"**: Because the server handles the session, you don't get that annoying 1-second delay where the site says "Loading..." before showing the user's name.

---

## 3. How it works in our Architecture

We create two different "Clients":

### A. The Server Client (`src/lib/supabase/server.ts`)
Used inside **Server Components** and **Server Actions**. It reads cookies directly from the request header.
```typescript
// Example usage:
const supabase = await createClient()
const { data: jobs } = await supabase.from('jobs').select('*')
```

### B. The Browser Client (`src/lib/supabase/client.ts`)
Used inside **Client Components** (`"use client"`). It uses the browser's cookies automatically.
```typescript
// Example usage:
const supabase = createBrowserClient()
```

---

## 4. Dark Mode & Emerald Tech Strategy

When we switch to **Emerald Tech**, Dark Mode needs special attention:

- **Light Mode**: We use **Emerald-600** (`#059669`). It looks great against white.
- **Dark Mode**: We shift to **Emerald-400** (`#34d399`) or **Teal-400**. 
  - **Why?** Dark backgrounds "absorb" dark colors. To make the UI "pop" in Dark Mode, we use lighter, more luminous versions of our primary color.
  - **Accessibility**: We ensure the text on Emerald buttons remains readable (switching between white and dark text depending on the theme).

---

## 5. Summary: What we used before?
In your old **Vite project**, you only used the Browser Client. There was no "Server," so authentication was simpler but less secure and slower for SEO. 

By moving to `@supabase/ssr`, you are leveling up to **Production-Grade Enterprise Architecture**.
