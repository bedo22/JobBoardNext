# Lint Resolution Report

This document summarizes the linting errors resolved during the codebase optimization and refactoring phase.

## 1. Type Safety (`no-explicit-any`)

### Issue
Widespread use of the `any` type in server actions and hooks, which bypasses TypeScript's type checking.

### Reason
Occurred mainly in legacy code or when handling complex Supabase return types where specific interfaces weren't defined.

### Solution
- Defined specific interfaces (e.g., `MessageWithProfile`, `ApplicationWithProfile`) in `src/types/app.ts`.
- Replaced `any` with `unknown` and used type guards or assertions when the exact shape was guaranteed.
- Example: Changed `data as any` to `(data as unknown as MessageWithProfile[])`.

---

## 2. React Hook Dependencies (`react-hooks/exhaustive-deps`)

### Issue
`useEffect` hooks were missing dependencies, or functions defined inside the component were being used in effects without stability.

### Reason
Standard React performance and correctness rule to ensure effects run when necessary data changes.

### Solution
- Wrapped member functions (like `fetchApplicants`) in `useCallback` to prevent them from changing on every render.
- Added all missing variables to the dependency arrays.

---

## 3. Render Purity (`react-hooks/purity`)

### Issue
Two types of purity violations were found:
1. **Impure function calls**: Calling `Date.now()` directly during render (or within `useMemo`).
2. **Synchronous setState**: Calling `setNow()` inside a `useEffect` on every mount, which can cause cascading renders.

### Reason
React components must be pure (idempotent). `Date.now()` returns a different value on every call, making the render unpredictable. Calling `setState` in an effect immediately after render is inefficient.

### Solution
- **Lazy Initializer**: Used the `useState(() => Date.now())` pattern. The initializer function only runs once during the initial mount, satisfying the purity requirement.
- **Removed useEffect for State Initialization**: Moved one-time calculations to the state initializer.

---

## 4. Unused Variables & Imports (`no-unused-vars`)

### Issue
Leftover imports (e.g., `MapPin`, `Badge`) and unused function parameters (especially `error` in `catch` blocks).

### Reason
Code rot from previous versions and standard ESLint rules to keep the bundle small and the code clean.

### Solution
- Cleaned up all unused imports across 10+ files.
- Removed unused `error` variables from `catch` blocks (`catch { ... }` instead of `catch (error) { ... }`).
- Removed unused variables in `generateMetadata` and other server actions.

---

## 5. JSX Escaping (`react/no-unescaped-entities`)

### Issue
Single quotes and characters like `>` being used directly in JSX text.

### Reason
Security (XSS prevention) and preventing HTML parsing ambiguities.

### Solution
- Replaced `'` with `&apos;` and `"` with `&quot;`.

---

## 6. Generated Files Parsing Error

### Issue
`src/types/supabase.ts` was being flagged as a binary file or having encoding issues.

### Reason
Automatically generated files by Supabase CLI sometimes contain characters or encodings that ESLint's default parser struggles with.

### Solution
- Updated `eslint.config.mjs` to add `src/types/supabase.ts` to the `globalIgnores` list. Documentation/generated files usually shouldn't be linted for style.
