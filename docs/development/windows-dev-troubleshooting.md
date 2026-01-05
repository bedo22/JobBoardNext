# Windows Dev Troubleshooting (Next.js)

This page lists common fixes for EPERM errors and hydration warnings when developing on Windows.

## 1) EPERM rename errors in `.next` during dev
Symptoms:
- Errors like `EPERM: operation not permitted, rename .next/...` while running `npm run dev`.

Likely causes:
- Antivirus / Windows Defender scanning `.next`
- Indexers / backup tools (e.g., OneDrive) locking files
- Editor search/index locks
- Turbopack file writes being interrupted

Fixes (try in order):
1. Stop the dev server, delete `.next`, restart dev: `rm -r .next` (or delete in Explorer).
2. Exclude your project folder (or at least `.next`) from Windows Defender/antivirus and OneDrive indexing.
3. Run your terminal as Administrator (can release file handle locks).
4. Close tools indexing the project (global search, backup clients).
5. Enable polling watchers (more stable on Windows):
   - PowerShell: `$env:WATCHPACK_POLLING="true"; npm run dev`
   - Or create `.env.development.local` with `WATCHPACK_POLLING=true`.
6. Temporarily disable Turbopack if needed:
   - `NEXT_DISABLE_TURBOPACK=1 npm run dev`
7. If all else fails: clean install
   - Remove `node_modules` and `package-lock.json`, reinstall: `npm install`.
   - Reboot to clear stale file handles.

## 2) Hydration mismatch warnings
Symptoms:
- Console logs: "A tree hydrated but some attributes of the server rendered HTML didn't match the client..."
- Body has attributes like `data-gr-ext-installed` or `data-new-gr-c-s-check-loaded`.

Cause:
- Browser extensions (e.g., Grammarly) inject attributes and modify HTML after SSR.

Fix:
- Disable such extensions for localhost while developing.
- `suppressHydrationWarning` is already present and fine.

## 3) General tips
- Avoid `Date.now()`/`Math.random()` during SSR for content that must match on the client; compute time-sensitive values in an effect or memo on the client side.
- Keep `.env.development.local` out of version control; it can store local-only settings like `WATCHPACK_POLLING=true`.
- If issues persist, try running the webpack dev server temporarily with `NEXT_DISABLE_TURBOPACK=1`.
