# Product Requirements Document: Loyalty Dashboard

## 1. Overview

The Loyalty Dashboard is a desktop-first internal module for loyalty program managers who need a fast, scannable overview of program health inside Voyado Engage. The product should help the team surface the most important loyalty metrics, membership distribution, recent loyalty activity, and enrollment patterns using static JSON data and shared UI components from `@voyado-kth/ui`.

This PRD reflects the BRD, available data files, shared TypeScript types, and team clarifications gathered during the requirements interview. The recommended workshop MVP follows the BRD priority order: KPI Summary Row, Tier Distribution, Recent Activity Feed, and Enrollment Trend. The Top Members Table is kept as a nice-to-have enhancement if time allows.

## 2. User Persona

**Anna - Loyalty Program Manager**

Anna reviews the dashboard regularly to understand whether the loyalty program is growing, how engaged members are, and what important activity happened recently. She needs quick signals she can understand in seconds and reuse in team conversations, not a deep analytics tool.

## 3. Functional Requirements

### FR-1: KPI Summary Row

- **Description:** Render a horizontal row of four KPI cards that summarize the most important loyalty-program metrics for quick morning review.
- **User Story:** As Anna, I want to see the most important loyalty KPIs at the top of the dashboard so that I can immediately assess overall program health.
- **Acceptance Criteria:**
  - [ ] Four `KpiCard` components are rendered in a horizontal row using CSS Grid or Flexbox.
  - [ ] The row includes Total Members, Active Members (30d), Average Points Balance, and Total Points Issued.
  - [ ] Each KPI displays a formatted numeric value with units where relevant.
  - [ ] Each KPI includes a simple trend indicator and percentage change when comparable data is available.
  - [ ] Positive and negative trends use Essence success and danger tokens.
  - [ ] KPI values may be computed from `data/members.json` and other available static data because the current `data/enrollment-stats.json` file does not provide a dedicated `kpis` object.
  - [ ] The row works at desktop width and degrades to a two-column layout on narrower screens when possible.
- **Data Source:** `data/members.json`, `data/enrollment-stats.json`
- **UI Components:** `KpiCard`
- **Priority:** MVP

### FR-2: Tier Distribution

- **Description:** Show a visual breakdown of loyalty-tier membership using tier counts, percentages, and CSS-based horizontal bars.
- **User Story:** As Anna, I want to see how members are distributed across tiers so that I can understand the balance and maturity of the loyalty program.
- **Acceptance Criteria:**
  - [ ] Bronze, Silver, Gold, and Platinum tiers are displayed.
  - [ ] Each tier displays its member count and percentage of the total.
  - [ ] Each tier includes a horizontal visual bar sized proportionally to its share.
  - [ ] Bar colors come from the `color` field in the tier data.
  - [ ] A total-members summary is shown for the section.
  - [ ] The section is wrapped in a shared `Card` component.
- **Data Source:** `data/tiers.json`
- **UI Components:** `Card`, `Badge`
- **Priority:** MVP

### FR-3: Recent Activity Feed

- **Description:** Present the most recent loyalty events in reverse chronological order with lightweight visual tagging for event types and point changes.
- **User Story:** As Anna, I want to review recent loyalty activity so that I can quickly understand what is happening in the program right now.
- **Acceptance Criteria:**
  - [ ] The 10 most recent activities are displayed in reverse chronological order.
  - [ ] Each activity item shows member name, event label, points amount when relevant, and a simple timestamp string.
  - [ ] The MVP feed includes `points_earned`, `points_redeemed`, and `tier_upgrade` events.
  - [ ] `enrollment` events from the data are excluded from the visible MVP feed.
  - [ ] Event types are visually distinguished with `Badge` variants or styling.
  - [ ] Points earned are displayed with a plus sign and points redeemed are displayed as negative values.
  - [ ] The section is wrapped in a shared `Card`.
- **Data Source:** `data/activity.json`
- **UI Components:** `Card`, `Badge`
- **Priority:** MVP

### FR-4: Enrollment Trend

- **Description:** Display monthly new-member enrollments for the last 12 months using a lightweight CSS-based visual chart.
- **User Story:** As Anna, I want to see recent enrollment trends so that I can spot growth patterns and seasonal changes at a glance.
- **Acceptance Criteria:**
  - [ ] Twelve monthly enrollment data points are shown in chronological order.
  - [ ] Each month displays a short label and enrollment value.
  - [ ] A CSS-only bar visualization represents the relative size of each month.
  - [ ] The latest month is visually highlighted.
  - [ ] Each bar includes a `title` attribute or equivalent simple affordance for the exact value.
  - [ ] The section is wrapped in a shared `Card`.
- **Data Source:** `data/enrollment-stats.json`
- **UI Components:** `Card`, `Tooltip` (optional)
- **Priority:** MVP

### FR-5: Top Members Table

- **Description:** Provide a sortable leaderboard of the top 10 members by points balance as a stretch feature.
- **User Story:** As Anna, I want to identify the most engaged members so that I can understand who is driving loyalty value.
- **Acceptance Criteria:**
  - [ ] A table displays the top 10 members, initially sorted by points balance descending.
  - [ ] The table includes Name, Tier, Points Balance, and Last Activity Date columns.
  - [ ] The Tier column uses a visual tier indicator such as `Badge`.
  - [ ] Clicking a sortable column header toggles sorting direction.
  - [ ] The active sort column shows a simple direction indicator.
  - [ ] Numeric values are formatted with thousands separators.
  - [ ] The feature remains optional if workshop time runs short.
- **Data Source:** `data/members.json`
- **UI Components:** `Card`, `Badge`
- **Priority:** Nice-to-have

## 4. Non-Functional Requirements

- **NFR-1: Responsive Layout** - Must work reliably on desktop screens at 1024px and above, with sensible stacking on narrower viewports when practical.
- **NFR-2: Design System Compliance** - Must use Essence design tokens and shared styles from `@voyado-kth/ui/tokens/essence-tokens.css`.
- **NFR-3: Type Safety** - Must use shared types from `@voyado-kth/shared` instead of redefining local data shapes.
- **NFR-4: Performance** - Must stay lightweight, use existing static JSON, and avoid heavy charting or table dependencies.
- **NFR-5: Accessibility** - Must use semantic HTML, clear headings, readable labels, and keyboard-accessible interactive elements.
- **NFR-6: Code Organization** - Must use CSS Modules and keep components split into focused files with co-located styles where appropriate.
- **NFR-7: Practical Workshop Scope** - Implementation should be broken into small tasks that fit 10-15 minute workshop increments.
- **NFR-8: Data Resilience** - The UI should handle missing optional fields and small data inconsistencies without crashing.

## 5. Data Model

| Data File | Primary Interface / Shape | Notes |
|---|---|---|
| `data/members.json` | `Customer[]` | Used for KPI calculations and the top-members leaderboard. |
| `data/tiers.json` | `LoyaltyTierInfo[]` | Contains tier names, minimum thresholds, display colors, and member counts. |
| `data/enrollment-stats.json` | `TimeSeriesDataPoint[]` | Current file is a plain array of monthly values rather than an object with a `kpis` field. |
| `data/activity.json` | Custom activity array | The shared types do not currently define this activity shape, so the module will likely use a local inferred JSON type for event records while still using shared domain types where applicable. |
| Customer tier fields | `LoyaltyTier` | Shared union used across member and tier-related displays. |
| KPI display data | `KpiMetric` | Useful as a view-model shape even if values are computed locally from available JSON. |

## 6. Component Inventory

Required shared UI components from `@voyado-kth/ui`:

- `KpiCard`
- `Card`
- `Badge`

Optional shared UI components:

- `Tooltip`
- `Chip`
- `Tabs`

Likely supporting patterns:

- CSS Grid or Flex layouts from standard CSS or shared layout primitives such as `Grid` and `Flex`
- Semantic list markup for activity
- Native table markup for the leaderboard

## 7. Out of Scope

- Deep analytics, drill-down reporting, or multi-page exploration flows
- Real-time backend integration, APIs, or live updates
- Advanced chart libraries or heavy visualization packages
- Member detail pages, editing workflows, or admin actions
- Filtering and tabbed activity views unless time remains after MVP
- Enrollment events shown in the MVP activity feed
- Mobile-first optimization beyond basic responsive support

## 8. MVP Definition

The recommended MVP for the workshop includes:

| FR | Feature | Why It Is MVP |
|---|---|---|
| FR-1 | KPI Summary Row | Highest-value summary for quick dashboard comprehension. |
| FR-2 | Tier Distribution | Gives immediate program-composition insight with simple implementation. |
| FR-3 | Recent Activity Feed | Adds timely context and makes the dashboard feel operational. |
| FR-4 | Enrollment Trend | Extends the overview with useful growth context once the core summary is in place. |

FR-5, Top Members Table, is explicitly deferred unless the team finishes the MVP ahead of schedule.
