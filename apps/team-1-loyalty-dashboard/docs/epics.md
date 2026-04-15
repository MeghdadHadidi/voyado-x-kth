# Sprint Plan: Loyalty Dashboard

## Epic 1: Project Setup
Replace the placeholder module with the page shell, data wiring, and exports needed to begin feature implementation.

### S1.1: Create the loyalty dashboard page shell [S]
Create a `LoyaltyDashboardPage` component and page CSS module that replace the placeholder-only route with a dashboard scaffold inside `TeamPageLayout`.
**Acceptance Criteria:**
- [ ] A new page component renders a dashboard heading and section placeholders inside TeamPageLayout.
- [ ] The page uses CSS Modules for the main layout and spacing.
- [ ] The current ComingSoon-only experience is no longer the main rendered content.
**Files:** `src/pages/Index.tsx`, `src/pages/LoyaltyDashboardPage.tsx`, `src/pages/LoyaltyDashboardPage.module.css`
**Data:** `data/team.json`
**Components:** TeamPageLayout, PageHeader, Card

### S1.2: Set up typed data imports and dashboard helpers [M]
Create helper utilities and typed view-model helpers for KPI, activity, and formatting needs using shared types and imported JSON data.
**Acceptance Criteria:**
- [ ] Dashboard code imports shared types from `@voyado-kth/shared`.
- [ ] A helper module exists for formatting and derived dashboard calculations.
- [ ] Data imports for members, tiers, activity, and enrollment stats are wired into the page layer without hardcoded values.
**Files:** `src/pages/LoyaltyDashboardPage.tsx`, `src/lib/dashboardData.ts`, `src/lib/dashboardFormatters.ts`
**Data:** `data/members.json`, `data/tiers.json`, `data/activity.json`, `data/enrollment-stats.json`
**Components:** None

### S1.3: Update module exports to replace ComingSoon [S]
Update the module entrypoint so the shell resolves to the new dashboard page rather than relying on the placeholder component.
**Acceptance Criteria:**
- [ ] `src/index.ts` exports the dashboard page entry used by the shell.
- [ ] The module route resolves to the dashboard page through `Index.tsx`.
- [ ] Unused placeholder-only exports are removed or no longer relied on for the route.
**Files:** `src/index.ts`, `src/pages/Index.tsx`
**Data:** None
**Components:** TeamPageLayout

## Epic 2: KPI Overview
Implement the dashboard's top KPI row so the user can evaluate loyalty performance immediately.

### S2.1: Compute loyalty KPI values from static data [M]
Derive the four KPI values and simple trend metadata from the available members and enrollment datasets.
**Acceptance Criteria:**
- [ ] Helpers return values for total members, active members, average points balance, and total points issued.
- [ ] Trend values are available in a shape that can be passed into `KpiCard`.
- [ ] Numeric outputs are formatted consistently for dashboard display.
**Files:** `src/lib/dashboardData.ts`, `src/lib/dashboardFormatters.ts`
**Data:** `data/members.json`, `data/enrollment-stats.json`
**Components:** KpiCard

### S2.2: Render the KPI summary row [S]
Build the visible KPI row using four `KpiCard` components and responsive layout styling.
**Acceptance Criteria:**
- [ ] Four KpiCard components render in the dashboard header section.
- [ ] Positive and negative trends use Essence success and danger styles.
- [ ] The KPI row adapts to narrower widths without overlapping.
**Files:** `src/pages/LoyaltyDashboardPage.tsx`, `src/pages/LoyaltyDashboardPage.module.css`
**Data:** `data/members.json`, `data/enrollment-stats.json`
**Components:** KpiCard, Grid

## Epic 3: Member Distribution
Visualize the loyalty base across tiers using color-coded bars and summary information.

### S3.1: Build the tier distribution card [M]
Create the tier distribution section with counts, percentages, and bars based on the tier JSON file.
**Acceptance Criteria:**
- [ ] All four tiers render with name, count, and percentage.
- [ ] Each tier includes a horizontal bar styled from the tier color field.
- [ ] The section is wrapped in a Card and includes a visible total-members summary.
**Files:** `src/components/TierDistributionCard.tsx`, `src/components/TierDistributionCard.module.css`, `src/pages/LoyaltyDashboardPage.tsx`
**Data:** `data/tiers.json`
**Components:** Card, Badge

## Epic 4: Recent Activity
Add a lightweight operational feed that highlights the latest important loyalty events.

### S4.1: Prepare filtered activity feed data [S]
Sort activity newest-first, limit to 10 items, exclude enrollment events, and map event types to UI labels.
**Acceptance Criteria:**
- [ ] The helper returns at most 10 activities in reverse chronological order.
- [ ] Enrollment events are excluded from the MVP feed.
- [ ] Event labels and point-display values are ready for rendering.
**Files:** `src/lib/dashboardData.ts`, `src/lib/dashboardFormatters.ts`
**Data:** `data/activity.json`
**Components:** Badge

### S4.2: Render the recent activity feed card [M]
Build the feed UI inside a Card using badges, simple timestamp formatting, and clear spacing.
**Acceptance Criteria:**
- [ ] The activity feed renders member name, event label, timestamp, and points when relevant.
- [ ] Event badges visually distinguish earned, redeemed, and tier-upgrade events.
- [ ] The list is readable and consistent across the 10 displayed items.
**Files:** `src/components/RecentActivityCard.tsx`, `src/components/RecentActivityCard.module.css`, `src/pages/LoyaltyDashboardPage.tsx`
**Data:** `data/activity.json`
**Components:** Card, Badge

## Epic 5: Enrollment Trend
Show monthly enrollment momentum with a CSS-only chart treatment.

### S5.1: Build the enrollment trend card [M]
Render the 12 monthly enrollment data points in chronological order as a lightweight bar chart.
**Acceptance Criteria:**
- [ ] All 12 monthly data points are displayed in chronological order.
- [ ] Bars scale relative to the maximum value in the dataset and show exact values via title attributes.
- [ ] The latest month is visually highlighted from the rest of the chart.
**Files:** `src/components/EnrollmentTrendCard.tsx`, `src/components/EnrollmentTrendCard.module.css`, `src/pages/LoyaltyDashboardPage.tsx`
**Data:** `data/enrollment-stats.json`
**Components:** Card

## Epic 6: Top Members Leaderboard
Add the optional leaderboard once the MVP work is complete.

### S6.1: Build the top members table with sorting [L]
Create a leaderboard card for the top 10 members by points balance with basic column sorting.
**Acceptance Criteria:**
- [ ] The table initially shows the top 10 members by points balance descending.
- [ ] Users can sort by at least name, tier, points balance, and last activity date.
- [ ] The current sort direction is visible in the table header.
**Files:** `src/components/TopMembersCard.tsx`, `src/components/TopMembersCard.module.css`, `src/pages/LoyaltyDashboardPage.tsx`
**Data:** `data/members.json`
**Components:** Card, Badge
