# Migration Guide: Vite (React) to Next.js

Migrating a project from Vite to Next.js is a common move to improve SEO, performance (through SSR/SSG), and developer experience. Based on our experience with this project, here are the three primary strategies.

---

## 1. The "In-Place" Refactor
In this approach, you modify the existing project directory. You remove Vite-specific files and install Next.js dependencies directly.

### Pros
- **Maintains Git History**: You keep all your commit history on every file.
- **No Path Changes**: Your local Git configuration and folder structure remain intact.
- **Speed (for small apps)**: For very simple apps, you can be up and running in minutes.

### Cons
- **Configuration Ghosting**: Old `vite.config.ts`, `index.html`, or `tsconfig.node.json` files can cause confusion/conflicts later if not cleaned perfectly.
- **Dependency Hell**: Existing versions of React or ESLint might conflict with Next.js specific requirements.
- **Broken Scripts**: You have to manually rewrite every script in `package.json`.

---

## 2. The Fresh Scaffold (Porting)
This is the approach we finally used. You generate a clean Next.js project using `create-next-app` and then copy your `src` and assets into it.

### Pros
- **Pristine Foundation**: You start with the exact configuration (TypeScript, ESLint, Tailwind, App Router) recommended by the Next.js team.
- **Zero Configuration Conflict**: There are no leftover Vite or legacy build files to cause sneaky errors.
- **Latest Features**: Ensures you are using the newest conventions (like the `proxy.ts` convention in Next.js 16).

### Cons
- **Manual Migration**: You have to move files folder-by-folder and verify imports.
- **"The Wall of Installs"**: You must remember to install every third-party library (like Radix, Supabase, etc.) that your components import.
- **Git Overhead**: Moving files to a "New" project can sometimes break simple Git tracking unless you are careful with the `.git` folder move.

---

## 3. Incremental Migration (Monorepo/Proxy)
Used for massive enterprise applications where you cannot afford downtime or a total "stop-work" period.

### Pros
- **Low Risk**: You move one page at a time. The rest of the app stays on Vite.
- **Continuous Deployment**: You can keep shipping features while refactoring.

### Cons
- **Highly Complex**: Requires a reverse proxy (like Nginx or Vercel Edge Middleware) to route traffic between the Vite build and the Next.js build.
- **Shared State Issues**: Managing shared login sessions between two different frameworks is very difficult.

---

## Strategy Comparison Table

| Feature | In-Place Refactor | Fresh Scaffold (Porting) | Incremental |
|:---|:---:|:---:|:---:|
| **Complexity** | Medium | Low | Very High |
| **Cleanliness** | Medium | **High** | Medium |
| **Risk of Legacy Bugs** | High | **Low** | Medium |
| **Best For** | Medium sized apps | **New feature-heavy apps** | Large legacy apps |

---

## Key Technical Shifts to Remember

### 1. Routing
- **Vite**: Uses `react-router-dom`. Routes are defined in code.
- **Next.js**: Uses File-system routing inside the `app/` folder.

### 2. Rendering
- **Vite**: Everything is a Client Component by default.
- **Next.js**: Everything is a **Server Component** by default. You must add `"use client"` to the top of files that use `useState` or `useEffect`.

### 3. Environment Variables
- **Vite**: Uses `import.meta.env.VITE_...`
- **Next.js**: Uses `process.env.NEXT_PUBLIC_...`

### 4. Entry Point
- **Vite**: Relies on `index.html` and `main.tsx`.
- **Next.js**: Relies on `layout.tsx` (the root wrapper) and `page.tsx`.

---

## Final Recommendation
For 90% of cases (including this JobBoard project), the **Fresh Scaffold** is the winner. It takes a bit more manual "moving" work at the start, but it prevents 10+ hours of debugging weird configuration conflicts between the old Vite setup and the new Next.js engine.
