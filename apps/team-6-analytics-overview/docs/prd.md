# Product Requirements Document: Analytics Overview

## 1. Overview

The Analytics Overview is an executive-facing dashboard for quick weekly review of business performance. The product should help Johan, Head of Marketing & CRM, understand revenue health at a glance, compare campaign outcomes, and scan channel mix without drilling into raw records.

This workshop implementation should stay intentionally lean. The recommended scope is a presentation-ready desktop dashboard with a strong KPI summary and a few supporting visual sections. Since the current static datasets do not provide true range-specific variants for every view, the date range selector will be treated as a simplified control rather than a full data-switching engine in MVP.

## 2. User Persona

**Primary user:** Johan, Head of Marketing & CRM

Johan prepares for leadership meetings and wants a fast, visual summary of performance. He values revenue-first reporting, clear comparisons, and high readability over deep interactivity.

## 3. Functional Requirements

### FR-1: KPI Summary Row

- **Description:** Render four hero KPI cards at the top of the dashboard for Revenue, Active Customers, Average Order Value, and Retention Rate.
- **User Story:** As Johan, I want to see the most important business metrics immediately so that I can assess performance in a few seconds.
- **Acceptance Criteria:**
  - [ ] Four KPI cards are shown in a single desktop-first row.
  - [ ] Each card shows label, current value, previous value context, trend direction, and percentage change.
  - [ ] Revenue and average order value are formatted with `SEK`.
  - [ ] Retention rate is formatted with `%`.
  - [ ] Counts are shown as whole numbers with separators.
  - [ ] Positive and negative trends are visually differentiated.
  - [ ] KPI data is loaded from `apps/team-6-analytics-overview/data/kpis.json`.
- **Data Source:** `data/kpis.json`
- **UI Components:** `KpiCard`
- **Priority:** MVP

### FR-2: Revenue Trend Chart

- **Description:** Show a CSS-only bar chart of monthly revenue across the available 12-month series.
- **User Story:** As Johan, I want to scan revenue over time so that I can identify momentum and seasonal peaks quickly.
- **Acceptance Criteria:**
  - [ ] Revenue data is rendered in chronological order as vertical bars.
  - [ ] Bar heights are proportional to the largest value in the dataset.
  - [ ] Each bar shows a month label.
  - [ ] Exact values are available on hover or as inline labels.
  - [ ] The highest-value month is visually highlighted.
  - [ ] The chart is wrapped in a section card with a clear heading.
- **Data Source:** `data/revenue-trend.json`
- **UI Components:** `Card`
- **Priority:** MVP

### FR-3: Campaign Performance Table

- **Description:** Display campaign results in a sortable-looking executive table focused on comparison, with conversion-led ordering by default.
- **User Story:** As Johan, I want to compare recent campaigns quickly so that I can identify which channels and campaigns are performing best.
- **Acceptance Criteria:**
  - [ ] A table lists campaign name, channel, open rate, click rate, and conversion rate.
  - [ ] Rows are ordered by conversion rate descending by default.
  - [ ] Channel is displayed with a readable label and visual indicator.
  - [ ] Each rate is shown as a percentage with one decimal place.
  - [ ] Open, click, and conversion metrics include compact inline visual bars for comparison.
  - [ ] The table is wrapped in a section card with a heading.
- **Data Source:** `data/campaign-performance.json`
- **UI Components:** `Card`, `Badge`
- **Priority:** MVP

### FR-4: Channel Revenue Breakdown

- **Description:** Show the revenue split across Web, App, and In-store using a compact visual breakdown and supporting totals.
- **User Story:** As Johan, I want to understand channel contribution so that I can see where revenue is concentrated.
- **Acceptance Criteria:**
  - [ ] All three channels are displayed with name, revenue value, and percentage of total.
  - [ ] A visual distribution element makes proportions easy to scan.
  - [ ] The total revenue across channels is displayed.
  - [ ] The section uses the color values provided by the data.
  - [ ] The section is wrapped in a card with a clear heading.
- **Data Source:** `data/channel-breakdown.json`
- **UI Components:** `Card`, `Badge`
- **Priority:** Nice-to-have

### FR-5: Simplified Date Range Selector

- **Description:** Provide a prominent date range control to support the executive-dashboard feel, but implement it as a simplified UI state in this workshop build because the current data files do not provide complete per-range datasets for all sections.
- **User Story:** As Johan, I want to see familiar reporting range controls so that the dashboard feels aligned with analytics workflows.
- **Acceptance Criteria:**
  - [ ] The UI shows four options: Last 7 days, Last 30 days, Last 90 days, Last 12 months.
  - [ ] Last 30 days is the default active option.
  - [ ] The active option has a clear selected state.
  - [ ] The control does not misrepresent unsupported data switching.
  - [ ] The PRD and implementation note clearly state that full cross-section range switching is deferred until range-specific data is available.
- **Data Source:** UI state only in MVP; no full multi-range data mapping yet
- **UI Components:** `Tabs` or `Button`
- **Priority:** MVP

## 4. Non-Functional Requirements

- **NFR-1: Executive Readability** — The dashboard must be optimized for presentation and fast scanning on desktop screens.
- **NFR-2: Responsive Layout** — The layout must work at desktop widths of `1024px+`; smaller screens should degrade cleanly without broken layout.
- **NFR-3: Design System Compliance** — Use Essence design tokens and existing `@voyado-kth/ui` components wherever possible.
- **NFR-4: Type Safety** — Use shared types from `@voyado-kth/shared` for analytics data.
- **NFR-5: Performance** — Use static JSON imports and lightweight CSS-only visualizations; no charting libraries.
- **NFR-6: Accessibility** — Use semantic headings, readable tables, sufficient contrast, and keyboard-accessible controls.
- **NFR-7: Code Organization** — Keep components split into focused files with CSS Modules for styling.

## 5. Data Model

| Data File | Real Shape | Shared Type | Notes |
|---|---|---|---|
| `data/kpis.json` | `KpiMetric[]` | `KpiMetric[]` | Current file is flat, not keyed by date range. |
| `data/revenue-trend.json` | `TimeSeriesDataPoint[]` | `TimeSeriesDataPoint[]` | Monthly series already suitable for the trend chart. |
| `data/campaign-performance.json` | `Array<{ name: string; channel: string; openRate: number; clickRate: number; conversionRate: number }>` | No dedicated shared type currently available | Use a local typed transform only if needed. |
| `data/channel-breakdown.json` | `ChannelBreakdown[]` | `ChannelBreakdown[]` | Includes channel color values in the dataset. |
| `workshop.json` | Workshop metadata | Workshop types in `packages/shared/src/types/workshop.ts` | Used by shell layout and team wrapper, not analytics content itself. |

## 6. Component Inventory

| Component | Purpose |
|---|---|
| `TeamPageLayout` | Wrap the team page in the existing shell/team presentation structure. |
| `PageHeader` | Present the page title and optional dashboard subtitle. |
| `Tabs` | Simplified date range selector. |
| `KpiCard` | KPI summary row. |
| `Card` | Revenue trend, campaign performance, and channel breakdown sections. |
| `Badge` | Channel labels and small status indicators. |
| `Grid` or CSS Grid | Page section layout and KPI row layout. |

## 7. Out of Scope

- No drill-down views, modal detail panels, or row-level exploration.
- No live backend, API integration, or server state.
- No external charting library.
- No advanced empty, error, or loading states beyond simple placeholders if needed.
- No full implementation of real multi-range dataset switching until the data files support it.
- No metric comparison section in this workshop build.

## 8. MVP Definition

The MVP should include these requirements:

| Requirement | Why It’s In MVP |
|---|---|
| FR-1 KPI Summary Row | Highest-value executive snapshot and strongest first impression. |
| FR-2 Revenue Trend Chart | Directly supports the revenue-first presentation goal. |
| FR-3 Campaign Performance Table | Adds actionable comparison without much implementation risk. |
| FR-5 Simplified Date Range Selector | Supports the analytics framing and layout, even in downgraded form. |

Nice-to-have after MVP:

- FR-4 Channel Revenue Breakdown

## 9. Delivery Notes

- Build for speed and polish, not breadth.
- Prefer a clean desktop composition with strong spacing and typography over adding extra widgets.
- If implementation time gets tight, finish FR-1 and FR-2 completely before starting FR-3.
