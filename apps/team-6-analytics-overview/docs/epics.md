# Sprint Plan: Analytics Overview

## Epic 1: Project Setup

Replace the placeholder route with a real dashboard shell, connect the analytics data files, and ensure the module exports the real entry point for implementation.

### S1.1: Create analytics dashboard page scaffold [S]

Replace the current placeholder usage in the main page with a real dashboard shell inside `TeamPageLayout`, including a page heading area, top-level sections, and a desktop-first grid structure ready for KPI cards and content cards.

**Acceptance Criteria:**
- [ ] Index page renders a dashboard scaffold instead of the ComingSoon placeholder
- [ ] The page includes a title area and placeholder sections for KPI row and main content
- [ ] A desktop-first layout is defined with CSS Modules or existing layout helpers

**Files:** `src/pages/Index.tsx`, `src/pages/AnalyticsOverviewPage.tsx`, `src/pages/AnalyticsOverviewPage.module.css`  
**Data:** None  
**Components:** TeamPageLayout, PageHeader, Card

### S1.2: Set up typed analytics data imports and view-model helpers [S]

Import the analytics JSON files, connect them to shared types where available, and create small formatting or sorting helpers for KPI values, revenue labels, campaign ordering, and channel totals.

**Acceptance Criteria:**
- [ ] KPI, revenue trend, campaign, and channel data are imported from the data folder
- [ ] Shared analytics types are used for KPI, trend, and channel data
- [ ] Helper logic exists for formatting numbers and sorting campaigns by conversion rate

**Files:** `src/pages/AnalyticsOverviewPage.tsx`, `src/utils/analytics.ts`  
**Data:** `data/kpis.json`, `data/revenue-trend.json`, `data/campaign-performance.json`, `data/channel-breakdown.json`  
**Components:** None

### S1.3: Update module exports to expose the dashboard page [S]

Ensure the team module exports the real analytics page entry point and no longer depends on the ComingSoon placeholder as the main experience.

**Acceptance Criteria:**
- [ ] `src/index.ts` exports the dashboard page entry cleanly
- [ ] The route can render the dashboard through the existing module entry point
- [ ] The placeholder page remains optional or removable without affecting the route

**Files:** `src/index.ts`, `src/pages/Index.tsx`  
**Data:** None  
**Components:** None

## Epic 2: KPI and Range Controls

Build the top-of-page executive summary area with KPI cards and a simplified date range selector.

### S2.1: Render the KPI summary row [S]

Map the KPI dataset into four `KpiCard` components with consistent value formatting, trend handling, and spacing that works for executive presentation.

**Acceptance Criteria:**
- [ ] Four KPI cards are rendered from `data/kpis.json`
- [ ] Value formatting matches `SEK`, percentages, and whole-number counts
- [ ] Trend direction and percentage changes are visible on each card

**Files:** `src/pages/AnalyticsOverviewPage.tsx`, `src/components/KpiSummaryRow.tsx`, `src/components/KpiSummaryRow.module.css`  
**Data:** `data/kpis.json`  
**Components:** KpiCard

### S2.2: Add a simplified date range selector [S]

Create a visible range control with four options and a default active state for Last 30 days, but keep it as presentational UI state only so the implementation stays honest about current data limitations.

**Acceptance Criteria:**
- [ ] The selector shows Last 7 days, Last 30 days, Last 90 days, and Last 12 months
- [ ] Last 30 days is selected by default
- [ ] The selected state is visually clear and does not imply unsupported data switching

**Files:** `src/pages/AnalyticsOverviewPage.tsx`, `src/components/DateRangeSelector.tsx`, `src/components/DateRangeSelector.module.css`  
**Data:** None  
**Components:** Tabs

## Epic 3: Revenue and Campaign Insights

Deliver the main supporting analysis sections for the executive dashboard: revenue trend and campaign comparison.

### S3.1: Build the revenue trend bar chart [M]

Render the monthly revenue series inside a `Card` using a CSS-only vertical bar chart with proportional heights, clear labels, and a visual highlight for the peak month.

**Acceptance Criteria:**
- [ ] All monthly revenue points are shown in chronological order
- [ ] Bar heights are scaled relative to the maximum value
- [ ] The highest-value month is visually highlighted and exact values are available

**Files:** `src/pages/AnalyticsOverviewPage.tsx`, `src/components/RevenueTrendCard.tsx`, `src/components/RevenueTrendCard.module.css`  
**Data:** `data/revenue-trend.json`  
**Components:** Card

### S3.2: Create the campaign performance table [M]

Render campaign data inside a `Card` as a comparison table with channel badges, one-decimal percentage formatting, inline rate bars, and conversion-rate-first ordering.

**Acceptance Criteria:**
- [ ] Campaign rows are ordered by conversion rate descending
- [ ] The table shows campaign, channel, open rate, click rate, and conversion rate
- [ ] Each rate column includes both a formatted percentage and an inline visual bar

**Files:** `src/pages/AnalyticsOverviewPage.tsx`, `src/components/CampaignPerformanceCard.tsx`, `src/components/CampaignPerformanceCard.module.css`  
**Data:** `data/campaign-performance.json`  
**Components:** Card, Badge

## Epic 4: Channel Breakdown Finish

Add the final nice-to-have section showing the revenue split by channel once MVP stories are complete.

### S4.1: Add the channel revenue breakdown card [S]

Create a compact channel breakdown section with a visual distribution bar or stacked segments, channel labels, formatted `SEK` values, and a displayed total revenue summary.

**Acceptance Criteria:**
- [ ] Web, App, and In-store are rendered with their provided colors
- [ ] Each channel shows value and percentage of total revenue
- [ ] A total revenue summary is visible in the card

**Files:** `src/pages/AnalyticsOverviewPage.tsx`, `src/components/ChannelBreakdownCard.tsx`, `src/components/ChannelBreakdownCard.module.css`  
**Data:** `data/channel-breakdown.json`  
**Components:** Card, Badge

## Suggested Implementation Order

1. `S1.1`
2. `S1.2`
3. `S1.3`
4. `S2.1`
5. `S2.2`
6. `S3.1`
7. `S3.2`
8. `S4.1`

MVP stories: `S1.1`, `S1.2`, `S1.3`, `S2.1`, `S2.2`, `S3.1`, `S3.2`
