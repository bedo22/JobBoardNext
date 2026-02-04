# Hybrid Performance: Dashboards with Zero-Wait

## Goal

Eliminate the "Loading your dashboard..." spinner on initial visit while maintaining the **instant, client-side filtering** speed that makes the dashboard feel snappy.

## Why Hybrid?

- **Current (Pure Client):** User hits `/dashboard` -> Next.js sends empty shell -> Browser requests data (Waterfall) -> User sees spinner for 1-2s -> Data arrives.
- **Hybrid (Proposed):** User hits `/dashboard` -> Server fetches data -> Next.js sends HTML with data already inside -> **Data is visible instantly** -> Client "hydrates" and takes over for instant filtering.

## Proposed Changes

### 1. [MODIFY] [dashboard/page.tsx](<file:///e:/Freelancer/Next.js/job-board/src/app/(dashboard)/dashboard/page.tsx>)

- Convert component to an `async` Server Component.
- Fetch `profile` and `jobs` data directly on the server.
- Pass the fetched data to `OverviewView` and `SeekerView`.

### 2. [MODIFY] [hooks/use-jobs.ts](file:///e:/Freelancer/Next.js/job-board/src/hooks/use-jobs.ts) (If exists)

- Ensure data fetching logic is reusable on both server and client (Server Actions).

### 3. [MODIFY] [overview-view.tsx](file:///e:/Freelancer/Next.js/job-board/src/components/features/dashboard/overview-view.tsx)

- Accept `initialJobs` as props.
- Initialize state with the server-passed data.
- Maintain existing local filtering logic.

## Verification Plan

### Automated Verification

- `npm run build` to ensure no SSR/hydration mismatches.
- Check bundle size to ensure we aren't sending redundant data.

### Manual Verification

1.  Hard refresh (`Cmd+R`) on the dashboard.
2.  **Verify**: The data is present on the first frame (no "Loading..." pulse).
3.  **Verify**: Clicking "Last 7d" or "All Time" still results in **instant** chart updates.
