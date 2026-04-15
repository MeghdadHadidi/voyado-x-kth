# Product Requirements Document: Customer Segments

## 1. Overview

The Customer Segments module helps CRM marketers define and inspect target audiences using static customer data. The product should support a balanced workshop MVP: users can browse existing segments, inspect how they are defined, and create a new segment through a visual rule-building flow with a preview of matching customers.

This module is desktop-first and should feel like a single workspace rather than a series of disconnected screens. The default experience should make it easy to move between the segment list, creation flow, preview state, and read-only detail view without losing context.

## 2. User Persona

**Lisa - CRM Marketer**

Lisa creates campaign audiences based on customer behavior, loyalty status, and location. She is not technical and needs a visual, confidence-building workflow that helps her define rules and quickly understand whether a segment is too broad or too narrow.

## 3. Functional Requirements (FRs)

### FR-1: Segment List

- **Description:** Display all existing segments from static data in a browsable list as the default landing state.
- **User Story:** As Lisa, I want to browse existing segments so that I can understand what audiences already exist and quickly inspect them.
- **Acceptance Criteria:**
  - [ ] All segments from `data/segments.json` are rendered in a vertical list.
  - [ ] Each list item shows the segment name, truncated description, customer count, and created date.
  - [ ] Segments are sorted by `createdDate` descending.
  - [ ] Clicking a segment opens the detail view within the same page workspace.
  - [ ] A prominent `Create Segment` action is available near the list header.
  - [ ] If there are no segments, an empty state explains the situation and points to the create action.
- **Data Source:** `apps/team-3-customer-segments/data/segments.json`
- **UI Components:** `PageHeader`, `Card`, `Badge`, `Button`, `Alert`
- **Priority:** MVP

### FR-2: Read-Only Segment Detail

- **Description:** Show a selected segment's description, rule summary, and matching customers in a read-only detail panel or section.
- **User Story:** As Lisa, I want to inspect an existing segment so that I can understand who is included before reusing it in a campaign.
- **Acceptance Criteria:**
  - [ ] Selecting a segment shows its name and description.
  - [ ] All existing rules are displayed visually as chips or compact cards.
  - [ ] The matching customer count is shown prominently.
  - [ ] A customer table shows Name, Email, Tier, City, and Total Spend.
  - [ ] A `Back to Segments` or equivalent reset action returns focus to the list state.
  - [ ] If an existing segment uses operators outside the workshop MVP builder scope, the UI still renders the segment safely in a readable way.
- **Data Source:** `apps/team-3-customer-segments/data/segments.json`, `apps/team-3-customer-segments/data/customers.json`
- **UI Components:** `Card`, `Badge`, `Chip`, `Button`, `Alert`
- **Priority:** MVP

### FR-3: Create Segment Basics

- **Description:** Allow the user to start a new segment by entering a name and optional description before defining rules.
- **User Story:** As Lisa, I want to name and describe a segment so that I can organize it before I build targeting logic.
- **Acceptance Criteria:**
  - [ ] Clicking `Create Segment` opens a creation area in the single-page workspace.
  - [ ] The form includes `Segment Name` and `Description`.
  - [ ] The segment name is required and must be at least 3 characters.
  - [ ] Validation errors are shown clearly before moving forward.
  - [ ] The `Next: Add Rules` action is disabled until the name is valid.
  - [ ] Cancelling returns the user to the list without saving a new segment.
- **Data Source:** Local React state seeded from `apps/team-3-customer-segments/data/segments.json`
- **UI Components:** `Card`, `Input`, `Button`, `Alert`
- **Priority:** MVP

### FR-4: Rule Builder

- **Description:** Provide a visual rule builder for new segments using AND logic and the BRD-defined field/operator combinations only.
- **User Story:** As Lisa, I want to build rules visually so that I can define a precise audience without writing queries.
- **Acceptance Criteria:**
  - [ ] The builder starts with zero or one editable rule row and supports adding more rows.
  - [ ] Each rule row includes Field, Operator, and Value controls.
  - [ ] Supported fields are `tier`, `city`, `totalSpend`, `lastPurchaseDate`, and `pointsBalance`.
  - [ ] Supported operators are limited to the BRD scope: `equals`, `not_equals`, `greater_than`, `less_than`, and `contains`.
  - [ ] Operator options update based on the selected field.
  - [ ] Value input type adapts to the selected field.
  - [ ] Users can remove any rule row.
  - [ ] AND labels or separators communicate that all rules must match.
  - [ ] The user cannot preview until at least one complete rule exists.
- **Data Source:** Rule configuration stored in local React state; evaluated against `apps/team-3-customer-segments/data/customers.json`
- **UI Components:** `Card`, `Input`, `Select`, `Button`, `Chip`, `Alert`
- **Priority:** MVP

### FR-5: Segment Preview

- **Description:** Evaluate the current rule set against customer data and show a clear preview result with strong feedback for no-match cases.
- **User Story:** As Lisa, I want to preview matching customers so that I can immediately judge whether my rules are useful.
- **Acceptance Criteria:**
  - [ ] Clicking `Preview` evaluates the current rules against `data/customers.json`.
  - [ ] The UI displays the total number of matches prominently.
  - [ ] A sample table shows up to the first 5 matching customers.
  - [ ] If there are no matches, the UI clearly explains that no customers matched and encourages broader criteria.
  - [ ] Preview results only refresh on explicit preview action, not on every keystroke.
  - [ ] All preview logic uses AND matching across rules.
- **Data Source:** `apps/team-3-customer-segments/data/customers.json`
- **UI Components:** `Card`, `Badge`, `Button`, `Alert`
- **Priority:** MVP

### FR-6: Workshop-Safe New Segment State

- **Description:** Keep newly created segments in local state for the session without backend or file persistence.
- **User Story:** As Lisa, I want to see the segment I just created in the workspace so that the flow feels complete during the demo.
- **Acceptance Criteria:**
  - [ ] A successfully created segment appears in the segment list immediately.
  - [ ] The new segment includes computed `customerCount` based on preview logic.
  - [ ] New segments do not modify JSON files or require a backend.
  - [ ] The app can distinguish seeded segments from session-created segments without breaking the list or detail views.
- **Data Source:** Local React state initialized from `apps/team-3-customer-segments/data/segments.json`
- **UI Components:** `Card`, `Badge`, `Button`
- **Priority:** Nice-to-have

## 4. Non-Functional Requirements (NFRs)

- **NFR-1: Responsive Layout** - Must work well on desktop at 1024px and above, with reasonable behavior on narrower widths.
- **NFR-2: Design System Compliance** - Must use Essence design tokens and components from `@voyado-kth/ui`; no custom token systems.
- **NFR-3: Type Safety** - Must use shared types from `@voyado-kth/shared` for segment and customer data.
- **NFR-4: Performance** - Must remain lightweight, rely on local JSON imports, and avoid heavy dependencies.
- **NFR-5: Accessibility** - Must use semantic HTML, visible labels, keyboard-reachable controls, and understandable empty/error messaging.
- **NFR-6: Code Organization** - Must use one component per file where practical, CSS Modules for styling, and co-located component assets.
- **NFR-7: Predictable Workshop Scope** - Builder functionality must stay within the BRD-defined operator set to keep implementation feasible in the workshop.
- **NFR-8: Clear Empty States** - Empty, invalid, and no-match states must be explicit and helpful because preview feedback is a top UX priority.

## 5. Data Model

| Data File | Shared Type | Notes |
| --- | --- | --- |
| `data/segments.json` | `Segment[]` | Seeded segment list for the default view and detail panel. |
| `data/customers.json` | `Customer[]` | Source of truth for preview evaluation and detail customer tables. |
| Local builder state | `SegmentRule[]` and draft segment fields | Used for in-progress segment creation before preview or list insertion. |

### Type Mapping

- `Segment`
  - `id`, `name`, `description`, `customerCount`, `rules`, `createdDate`, `lastUpdated`
- `SegmentRule`
  - `id`, `field`, `operator`, `value`
- `SegmentOperator`
  - Shared union includes extra operators, but the workshop builder should only expose `equals`, `not_equals`, `greater_than`, `less_than`, and `contains`
- `Customer`
  - `id`, `firstName`, `lastName`, `email`, `tier`, `pointsBalance`, `totalSpend`, `lastPurchaseDate`, `city`, `country`, `isActive`

### Data Notes

- Existing seed data includes operator values beyond the MVP builder scope, such as `in`, `older_than_days`, and `within_days`.
- The PRD treats those extra operators as out of scope for builder authoring in this sprint.
- The implementation should avoid crashing when rendering seeded segments that contain unsupported operators.

## 6. Component Inventory

Required components from `@voyado-kth/ui`:

- `PageHeader` for page framing and top-level actions
- `Card` for segment list items, rule builder container, preview panel, and detail sections
- `Badge` for customer counts and tier labels
- `Button` for create, cancel, add rule, preview, and back actions
- `Input` for segment metadata and rule value entry
- `Select` for field and operator controls in the rule builder
- `Chip` for visual rule summaries
- `Alert` for validation, empty states, and no-match states
- `Flex` and `Grid` for single-page workspace layout

## 7. Out of Scope

- Editing or deleting existing seeded segments
- Persisting newly created segments to disk or backend storage
- Advanced operators not prioritized in the BRD builder flow, including `in`, `between`, `older_than_days`, and `within_days`
- Automatically re-running preview on every rule change
- Campaign activation, export, or integration with other modules
- Deep mobile-first optimization beyond maintaining reasonable responsiveness

## 8. MVP Definition

The recommended MVP for the workshop is:

- **FR-1:** Segment List
- **FR-2:** Read-Only Segment Detail
- **FR-3:** Create Segment Basics
- **FR-4:** Rule Builder
- **FR-5:** Segment Preview

This scope matches the team's preference for a balanced experience: users can both inspect seeded segments and create new ones inside a single-page workspace. `FR-6` is useful if time allows, but it should not block the core demo.

## 9. Delivery Recommendation

Suggested implementation order for the workshop:

1. Segment list and selection state
2. Read-only detail view with customer table
3. Create form and validation
4. Rule builder with BRD-scoped operators
5. Preview logic and no-match messaging
6. Optional local insertion of newly created segments
