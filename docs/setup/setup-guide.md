# Setup Guide for Job Board (Next.js)

Since we migrated the project to a fresh scaffold, follow these steps to finish the setup and start your application.

## 1. Install Dependencies
Run this command in your terminal inside the `job-board` folder:

```bash
npm install @hookform/resolvers @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-navigation-menu @radix-ui/react-radio-group @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slot @radix-ui/react-tabs @supabase/supabase-js @supabase/auth-helpers-nextjs class-variance-authority clsx date-fns lucide-react next-themes react-hook-form react-markdown recharts sonner tailwind-merge zod
```

### Why these packages?

#### **UI Components & Radix UI**
We are using **Shadcn UI**, which is an *unstyled* component library that gives you the code directly in your project (in `src/components/ui`). It doesn't install as a single npm package. Instead, it relies on headless primitives from **Radix UI** for functionality (accessibility, keyboard nav) and **Tailwind CSS** for styling.

*   `@radix-ui/*`: The core logic for complex interactive components (Dialogs, Dropdowns, Tabs, etc.). Shadcn components import these internally.
*   `class-variance-authority`: A helper to manage different component variants (e.g., button colors/sizes) efficiently.
*   `clsx` & `tailwind-merge`: Utilities to conditionally join class names and resolve conflicts (essential for Tailwind).
*   `lucide-react`: The icon library used throughout the application.
*   `next-themes`: Handles Dark Mode/Light Mode switching.
*   `sonner`: A beautiful toast notification library.

#### **Forms & Validation**
*   `react-hook-form`: The library used for managing form state and submission.
*   `zod`: A schema validation library to define rules for your data (e.g., "email is required").
*   `@hookform/resolvers`: Connects `zod` validation rules to `react-hook-form`.

#### **Backend & Authentication**
*   `@supabase/supabase-js`: The core client to interact with your Supabase database.
*   `@supabase/auth-helpers-nextjs`: Specialized helpers to make Supabase Auth work smoothly with Next.js specific features like Server Components and Proxy.

#### **Data Display & Utilities**
*   `react-markdown`: Renders the Job Description markdown text as formatted HTML.
*   `recharts`: A charting library used for the analytics graphs in the Employer Dashboard.
*   `date-fns`: A library for formatting dates (e.g., "posted 2 days ago").

---

## 2. Install Development Dependencies
Run this for the animation library used by some Shadcn components:

```bash
npm install -D tw-animate-css
```

## 3. Environment Variables
Ensure your `.env` file contains your Supabase credentials:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 4. Run the Project
Start the development server:

```bash
npm run dev
```

## 5. Troubleshooting
If you see any "Cannot find module" errors after running the installs, try restarting your IDE (VS Code) to refresh the TypeScript cache.
