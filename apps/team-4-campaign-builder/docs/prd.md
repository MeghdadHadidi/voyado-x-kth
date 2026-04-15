# Product Requirements Document: Campaign Builder

## 1. Overview

The Campaign Builder is a marketer-facing workflow for viewing existing campaigns and creating new multi-channel campaigns across email, SMS, and push. The product should help a marketing manager move from campaign overview to campaign creation quickly, with a guided wizard that reduces decision fatigue and provides confidence before scheduling.

For the workshop MVP, the product should prioritize a polished campaign list and a complete 4-step creation flow. The implementation should use the existing static JSON files in `data/` as the source of truth for seeded campaigns and templates, while allowing newly created campaigns to follow the same data shape as `campaigns.json`.

## 2. User Persona

**Marcus — Marketing Manager**

Marcus plans recurring retail campaigns, selects the right channel and template, tailors messaging, and schedules sends to the right audience. He wants a fast and guided experience with clear status visibility and minimal friction.

## 3. Functional Requirements (FRs)

### FR-1: Campaign List Overview

- **Description:** Display all existing campaigns in a scannable list view that gives a quick operational overview.
- **User Story:** As Marcus, I want to review all campaigns in one place so that I can understand upcoming and past campaign activity at a glance.
- **Acceptance Criteria:**
  - [ ] All campaigns from `data/campaigns.json` are rendered in a list or card layout.
  - [ ] Each campaign displays `name`, `channel`, `status`, `scheduledDate`, and `segmentName`.
  - [ ] Status uses the correct `Badge` variant mapping: `draft` -> `neutral`, `scheduled` -> `info`, `sent` -> `success`, `paused` -> `warning`.
  - [ ] Scheduled date is formatted in a readable date-time format.
  - [ ] Campaigns are ordered by scheduled date, with upcoming campaigns prioritized ahead of older sent campaigns.
  - [ ] A prominent `Create Campaign` action is visible above the list.
- **Data Source:** `apps/team-4-campaign-builder/data/campaigns.json`
- **UI Components:** `Card`, `Badge`, `Button`, `Chip`
- **Priority:** MVP

### FR-2: Wizard Step 1 — Channel Selection

- **Description:** Let the user choose one campaign channel from email, SMS, or push using large selectable cards.
- **User Story:** As Marcus, I want to choose a campaign channel first so that I can narrow the rest of the campaign setup flow.
- **Acceptance Criteria:**
  - [ ] Three channel options are displayed as interactive cards.
  - [ ] Only one channel can be selected at a time.
  - [ ] The selected channel has a clear visual active state.
  - [ ] The `Next` action is disabled until a channel is selected.
  - [ ] Returning to the step preserves the chosen value.
- **Data Source:** Static channel options derived from `CampaignChannel`
- **UI Components:** `Card`, `Button`, `Badge`
- **Priority:** MVP

### FR-3: Wizard Step 2 — Template Selection

- **Description:** Display templates filtered by the chosen channel and allow the user to select one.
- **User Story:** As Marcus, I want to pick a template that matches my channel so that I can start from an appropriate campaign structure.
- **Acceptance Criteria:**
  - [ ] Templates are loaded from `data/templates.json`.
  - [ ] Only templates whose `channel` matches the selected channel are shown.
  - [ ] Each template is presented as a selectable card with name and thumbnail or placeholder styling.
  - [ ] Only one template can be selected at a time.
  - [ ] The `Next` action remains disabled until a template is selected.
  - [ ] Returning to the step preserves the selected template.
- **Data Source:** `apps/team-4-campaign-builder/data/templates.json`
- **UI Components:** `Card`, `Button`, `Badge`
- **Priority:** MVP

### FR-4: Wizard Step 3 — Campaign Content Editor

- **Description:** Provide a form to define campaign metadata and messaging, with a split-view live preview on desktop.
- **User Story:** As Marcus, I want to edit the campaign name and message content while seeing a live preview so that I can validate the message before scheduling it.
- **Acceptance Criteria:**
  - [ ] The step includes inputs for campaign name and subject.
  - [ ] The step includes a text area for message content, even though seeded `campaigns.json` entries may not include `content`.
  - [ ] The layout uses a two-column split view on desktop: form on the left, preview on the right.
  - [ ] The preview replaces supported merge tags with sample values: `{{first_name}}`, `{{last_name}}`, `{{tier}}`, `{{points_balance}}`.
  - [ ] Supported sample replacements are visible immediately as the user types.
  - [ ] Returning to the step preserves all entered values.
  - [ ] New campaign drafts created through the wizard follow the `campaigns.json` template, with any additional editor-only content handled consistently in implementation.
- **Data Source:** `apps/team-4-campaign-builder/data/campaigns.json` for target shape, merge-tag sample values defined in `requirements.md`
- **UI Components:** `Input`, `Card`, `Button`, `Chip`, `Alert`
- **Priority:** MVP

### FR-5: Wizard Step 4 — Review and Schedule

- **Description:** Present a final read-only summary of campaign selections and capture scheduling information before creation.
- **User Story:** As Marcus, I want to review all campaign details before creation so that I can confidently schedule the message.
- **Acceptance Criteria:**
  - [ ] The step summarizes the selected channel, template, campaign name, subject, preview content, and schedule value.
  - [ ] The user can enter a schedule date and time.
  - [ ] The `Back` action preserves all previously entered wizard data.
  - [ ] The `Create Campaign` action creates a new campaign object shaped consistently with `data/campaigns.json`.
  - [ ] After creation, the user is returned to the campaign list and the new campaign is visible in the UI.
  - [ ] If the team chooses to persist seeded demo data during implementation, the PRD allows writing new campaigns in the same shape as `campaigns.json`.
- **Data Source:** `apps/team-4-campaign-builder/data/campaigns.json`, `apps/team-4-campaign-builder/data/templates.json`
- **UI Components:** `Card`, `Input`, `Button`, `Badge`, `Alert`
- **Priority:** MVP

### FR-6: Campaign Detail View

- **Description:** Provide a read-only detail view for a selected campaign with campaign metadata and rendered content preview.
- **User Story:** As Marcus, I want to inspect a campaign in more detail so that I can understand its setup without editing it.
- **Acceptance Criteria:**
  - [ ] Clicking a campaign from the list opens a dedicated detail view.
  - [ ] The detail view displays campaign name, channel, status, template reference, scheduled date, and segment name.
  - [ ] If content is available, merge tags are rendered with sample values in the preview.
  - [ ] A back action returns the user to the campaign list.
- **Data Source:** `apps/team-4-campaign-builder/data/campaigns.json`, `apps/team-4-campaign-builder/data/templates.json`
- **UI Components:** `Card`, `Badge`, `Button`, `Chip`
- **Priority:** Nice-to-have

### FR-7: Campaign Status Management

- **Description:** Allow status changes for eligible campaigns from the detail view using guided actions.
- **User Story:** As Marcus, I want to update a campaign's status so that I can pause, resume, or re-draft campaigns when plans change.
- **Acceptance Criteria:**
  - [ ] The current status is shown clearly in the detail view.
  - [ ] Only valid actions are presented for the current status.
  - [ ] `sent` campaigns are not editable.
  - [ ] Status changes update the visible campaign state immediately.
  - [ ] A success confirmation is shown after a valid status update.
- **Data Source:** `apps/team-4-campaign-builder/data/campaigns.json`
- **UI Components:** `Badge`, `Button`, `Alert`
- **Priority:** Nice-to-have

## 4. Non-Functional Requirements (NFRs)

- **NFR-1: Responsive Layout** — Must work on desktop-first layouts at 1024px+ and remain usable on narrower widths.
- **NFR-2: Design System Compliance** — Must use Essence design tokens and components from `@voyado-kth/ui`.
- **NFR-3: Type Safety** — Must use shared types from `@voyado-kth/shared`, especially `Campaign`, `CampaignChannel`, `CampaignStatus`, and `CampaignTemplate`.
- **NFR-4: Performance** — Must remain lightweight, avoid heavy dependencies, and fit the existing lazy-loaded workspace app structure.
- **NFR-5: Accessibility** — Must use semantic HTML, clear labels, visible focus states, and keyboard-accessible controls.
- **NFR-6: Code Organization** — Must use CSS Modules, one component per file where practical, and co-located styles within the team app.

## 5. Data Model

| Data File / Source | TypeScript Interface | Notes |
|---|---|---|
| `apps/team-4-campaign-builder/data/campaigns.json` | `Campaign` | Existing seeded data is close to `Campaign` but currently includes extra fields such as `segmentId`, `segmentName`, `recipientCount`, `openRate`, and `clickRate`. The implementation should normalize or extend handling as needed. |
| `apps/team-4-campaign-builder/data/templates.json` | `CampaignTemplate` | Matches template selection needs for channel-specific filtering. |
| Wizard channel selection | `CampaignChannel` | Used for the Step 1 selection model. |
| Campaign status display and transitions | `CampaignStatus` | Used for badge styling and optional later status-management logic. |

## 6. Component Inventory

Required components from `@voyado-kth/ui`:

- `Card`
- `Badge`
- `Button`
- `Input`
- `Chip`
- `Alert`

Optional but useful:

- `Tabs`
- `PageHeader`
- `Grid`
- `Flex`

## 7. Out of Scope

- Real backend persistence or API integration
- True message sending or scheduling infrastructure
- Rich analytics dashboards for campaign performance
- Advanced filtering, searching, or sorting controls beyond the core list view
- Template editing or template creation
- Full status-management workflow in the MVP
- Production-grade validation and error-recovery flows beyond workshop scope

## 8. MVP Definition

The Team 4 MVP for the workshop includes:

- **FR-1:** Campaign List Overview
- **FR-2:** Wizard Step 1 — Channel Selection
- **FR-3:** Wizard Step 2 — Template Selection
- **FR-4:** Wizard Step 3 — Campaign Content Editor
- **FR-5:** Wizard Step 4 — Review and Schedule

MVP experience goals:

- Users can view campaigns with emphasis on `status`, `scheduledDate`, and `segmentName`.
- Users can complete the full create-campaign flow from channel selection through review.
- The wizard uses a `cards + next/back` structure overall.
- Step 3 uses a split-view live preview to create a stronger demo experience.

Deferred but intentionally retained for later:

- **FR-6:** Campaign Detail View
- **FR-7:** Campaign Status Management
