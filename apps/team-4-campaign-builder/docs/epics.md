# Sprint Plan: Campaign Builder

## Epic 1: Project Setup

Replace the placeholder Team 4 experience with a real Campaign Builder page shell, wire in data imports, and update the module exports so implementation can continue from a solid base.

### S1.1: Create the main campaign page layout [S]

Replace the current Coming Soon experience with a real page-level Campaign Builder layout that includes a heading area, space for campaign list content, and a clear Create Campaign entry point.

**Acceptance Criteria:**
- [ ] A new page-level Campaign Builder component exists in `src/pages` and renders inside `TeamPageLayout`.
- [ ] The page includes a title area and a visible Create Campaign action placeholder.
- [ ] The route no longer depends on the `ComingSoon` component for its main UI.

**Files:** `src/pages/CampaignBuilderPage.tsx`, `src/pages/CampaignBuilderPage.module.css`, `src/pages/Index.tsx`
**Data:** None
**Components:** TeamPageLayout, PageHeader, Button, Card

### S1.2: Set up data loading and type imports [S]

Import campaign and template data from the local data folder, define any safe view-model helpers needed for the mismatched JSON shape, and connect shared Campaign and CampaignTemplate types so the page can render typed data.

**Acceptance Criteria:**
- [ ] Campaigns and templates are imported from `data/*.json`.
- [ ] Shared types from `@voyado-kth/shared` are used for campaign-related logic.
- [ ] Any JSON shape mismatch is handled in a local helper or normalization layer without hardcoding data.

**Files:** `src/pages/CampaignBuilderPage.tsx`, `src/types/campaignBuilder.ts`
**Data:** `data/campaigns.json`, `data/templates.json`
**Components:** None

### S1.3: Update module exports to use the new page [S]

Ensure the Team 4 package exports the active page components needed by the shell and stops advertising the placeholder as the primary experience.

**Acceptance Criteria:**
- [ ] `src/index.ts` exports the live page component used by the shell.
- [ ] `Index.tsx` renders the new Campaign Builder page.
- [ ] The module entry stays compatible with the existing shell route.

**Files:** `src/index.ts`, `src/pages/Index.tsx`
**Data:** None
**Components:** None

## Epic 2: Campaign List Experience

Build the marketer’s overview of existing campaigns with the right emphasis on status, schedule, and segment context.

### S2.1: Render campaign overview cards from static data [M]

Create a reusable list section that maps existing campaigns into cards showing campaign name, channel, status, scheduled date, and segment name.

**Acceptance Criteria:**
- [ ] All campaigns from `data/campaigns.json` are displayed on the page.
- [ ] Each card shows name, channel, status, scheduled date, and segment name.
- [ ] The visual layout is scan-friendly on desktop.

**Files:** `src/components/CampaignList.tsx`, `src/components/CampaignList.module.css`, `src/components/CampaignCard.tsx`, `src/components/CampaignCard.module.css`, `src/pages/CampaignBuilderPage.tsx`
**Data:** `data/campaigns.json`
**Components:** Card, Badge, Chip

### S2.2: Add campaign sorting and formatted metadata [S]

Add helper formatting for schedule dates and channel labels, map status to badge variants, and sort campaigns so upcoming scheduled work is easy to spot.

**Acceptance Criteria:**
- [ ] Scheduled date values are formatted into a readable date-time string.
- [ ] Campaign status uses the correct Badge variants.
- [ ] Campaign ordering prioritizes upcoming scheduled items ahead of older sent items.

**Files:** `src/components/CampaignList.tsx`, `src/components/CampaignCard.tsx`, `src/utils/campaignFormatters.ts`
**Data:** `data/campaigns.json`
**Components:** Badge, Chip

## Epic 3: Campaign Creation Wizard

Deliver the full MVP campaign-creation flow using a cards-based wizard with next/back navigation and a strong preview step.

### S3.1: Build wizard shell and step navigation [M]

Create the wizard container, centralize step state, and implement next/back navigation plus a visible step indicator for the four-step flow.

**Acceptance Criteria:**
- [ ] The page can toggle between campaign list mode and create-campaign wizard mode.
- [ ] The wizard tracks four steps with next/back navigation.
- [ ] The current step is visually indicated and previous choices remain in state when moving backward.

**Files:** `src/components/CampaignWizard.tsx`, `src/components/CampaignWizard.module.css`, `src/components/WizardStepIndicator.tsx`, `src/components/WizardStepIndicator.module.css`, `src/pages/CampaignBuilderPage.tsx`
**Data:** None
**Components:** Card, Badge, Button

### S3.2: Implement channel and template selection steps [M]

Create Step 1 and Step 2 using selectable cards for channels and filtered templates, with disabled progression until a valid choice is made.

**Acceptance Criteria:**
- [ ] Step 1 renders Email, SMS, and Push as selectable cards.
- [ ] Step 2 only shows templates whose channel matches the selected channel.
- [ ] Selected cards have a clear active state and enable progression.

**Files:** `src/components/wizard/ChannelStep.tsx`, `src/components/wizard/ChannelStep.module.css`, `src/components/wizard/TemplateStep.tsx`, `src/components/wizard/TemplateStep.module.css`, `src/components/CampaignWizard.tsx`
**Data:** `data/templates.json`
**Components:** Card, Button, Badge

### S3.3: Implement content editor with split live preview [M]

Create Step 3 with inputs for campaign name and subject plus a desktop split-view editor that previews merge-tag substitutions using sample data.

**Acceptance Criteria:**
- [ ] Step 3 includes fields for campaign name, subject, and content body.
- [ ] The desktop layout shows editor and preview side by side.
- [ ] Supported merge tags are replaced with sample values in the live preview as the user types.

**Files:** `src/components/wizard/ContentStep.tsx`, `src/components/wizard/ContentStep.module.css`, `src/utils/mergeTagPreview.ts`, `src/components/CampaignWizard.tsx`
**Data:** None
**Components:** Input, Card, Chip, Alert

### S3.4: Implement review, schedule, and create action [L]

Create the final wizard step that summarizes the user’s choices, accepts schedule input, and creates a new campaign item shaped like the existing campaigns data so it appears back in the list.

**Acceptance Criteria:**
- [ ] Step 4 shows a readable summary of channel, template, campaign name, subject, content preview, and schedule.
- [ ] The user can enter a schedule value before creating the campaign.
- [ ] Submitting the wizard creates a new campaign entry in local UI state and returns to the campaign list.

**Files:** `src/components/wizard/ReviewStep.tsx`, `src/components/wizard/ReviewStep.module.css`, `src/components/CampaignWizard.tsx`, `src/pages/CampaignBuilderPage.tsx`
**Data:** `data/campaigns.json`, `data/templates.json`
**Components:** Card, Input, Button, Badge, Alert

## Epic 4: Future Campaign Management

Capture the deferred ideas for drill-down and campaign state changes without blocking the MVP demo path.

### S4.1: Add read-only campaign detail view [M]

Create a detail view for a selected campaign that surfaces richer metadata and optional rendered content preview for later iteration.

**Acceptance Criteria:**
- [ ] Selecting a campaign can open a detail surface or dedicated view.
- [ ] The view shows core campaign metadata including status, template reference, scheduled date, and segment name.
- [ ] A back action returns the user to the main list.

**Files:** `src/components/CampaignDetail.tsx`, `src/components/CampaignDetail.module.css`, `src/pages/CampaignBuilderPage.tsx`
**Data:** `data/campaigns.json`, `data/templates.json`
**Components:** Card, Badge, Button, Chip

### S4.2: Add status transition controls and feedback [M]

Extend the future detail view with allowed status transitions and a lightweight confirmation message after changes.

**Acceptance Criteria:**
- [ ] Only valid status actions are shown for the selected campaign status.
- [ ] Sent campaigns show no editable status actions.
- [ ] A confirmation message is displayed after a successful status change.

**Files:** `src/components/CampaignDetail.tsx`, `src/components/CampaignStatusActions.tsx`, `src/components/CampaignStatusActions.module.css`, `src/utils/campaignStatus.ts`
**Data:** `data/campaigns.json`
**Components:** Badge, Button, Alert
