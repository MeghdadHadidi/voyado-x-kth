# Sprint Plan: Customer Segments

## Epic 1: Project Setup
Replace the placeholder module with a typed page shell wired to real segment and customer data.

### S1.1: Create the customer segments page shell [S]
Build the main page component that renders inside `TeamPageLayout` and establishes the single-page workspace with room for a list column and a detail or builder area.
**Acceptance Criteria:**
- [ ] A new page component replaces the generic ComingSoon experience for team-3.
- [ ] The page includes a top-level header and a desktop-first two-area layout.
- [ ] The shell renders safely with existing static data imports and no interactive logic yet.
**Files:** `src/pages/CustomerSegmentsPage.tsx`, `src/pages/CustomerSegmentsPage.module.css`, `src/pages/Index.tsx`
**Data:** `data/team.json`
**Components:** `PageHeader`, `Flex`, `Grid`

### S1.2: Set up typed data loading and shared helpers [S]
Import segment and customer JSON with shared types and add helper utilities for formatting dates, customer names, and safe rule labels needed across the page.
**Acceptance Criteria:**
- [ ] Shared types from `@voyado-kth/shared` are used for segment and customer data.
- [ ] Seed data is loaded from the module data directory instead of hardcoded values.
- [ ] Reusable formatting helpers exist for dates, names, and display labels.
**Files:** `src/pages/CustomerSegmentsPage.tsx`, `src/lib/segmentFormatters.ts`
**Data:** `data/segments.json`, `data/customers.json`
**Components:** None

### S1.3: Update module exports to use the new page [S]
Wire the new page into the team module entry points so the shell route renders the customer segments experience instead of the placeholder component.
**Acceptance Criteria:**
- [ ] `Index` renders the new customer segments page inside `TeamPageLayout`.
- [ ] `src/index.ts` exports the page entry expected by the shell.
- [ ] The old `ComingSoon` component is no longer the primary route output.
**Files:** `src/index.ts`, `src/pages/Index.tsx`
**Data:** None
**Components:** `TeamPageLayout`

## Epic 2: Segment List Workspace
Deliver the default list experience so marketers can browse existing segments and navigate into deeper states.

### S2.1: Render the default segment list [M]
Display all seeded segments in a sorted vertical list with name, description preview, created date, and customer count badges.
**Acceptance Criteria:**
- [ ] All segments from `data/segments.json` are shown newest first.
- [ ] Each card shows name, description preview, created date, and customer count.
- [ ] The list uses shared UI components and matches the page shell layout.
**Files:** `src/pages/CustomerSegmentsPage.tsx`, `src/components/SegmentList.tsx`, `src/components/SegmentList.module.css`
**Data:** `data/segments.json`
**Components:** `Card`, `Badge`, `Button`

### S2.2: Add empty state and create CTA [S]
Introduce the list header action and fallback state so the page still guides the user if no segments are available.
**Acceptance Criteria:**
- [ ] A `Create Segment` action is clearly visible near the list header.
- [ ] An empty state appears when the segment array is empty.
- [ ] The empty state explains what to do next instead of leaving blank space.
**Files:** `src/pages/CustomerSegmentsPage.tsx`, `src/components/SegmentList.tsx`
**Data:** `data/segments.json`
**Components:** `PageHeader`, `Button`, `Alert`

## Epic 3: Read-Only Segment Detail
Enable selection of an existing segment and show who belongs to it in a readable detail panel.

### S3.1: Implement segment selection and detail panel state [S]
Track the currently selected segment and render a detail-side panel within the same page workspace with back navigation.
**Acceptance Criteria:**
- [ ] Clicking a segment selects it and opens the detail area.
- [ ] The detail state can be cleared with a back or reset action.
- [ ] The list and detail areas coexist within the single-page layout.
**Files:** `src/pages/CustomerSegmentsPage.tsx`, `src/components/SegmentDetail.tsx`, `src/components/SegmentDetail.module.css`
**Data:** `data/segments.json`
**Components:** `Card`, `Button`

### S3.2: Show rule summaries and matching customers for selected segments [M]
Render the selected segment's metadata, rules, customer count, and a customer table. Handle unsupported seeded operators gracefully in display labels.
**Acceptance Criteria:**
- [ ] The detail view shows segment title, description, rules, and count.
- [ ] A customer table displays name, email, tier, city, and total spend.
- [ ] Unsupported seeded operators are displayed safely without crashing the UI.
**Files:** `src/components/SegmentDetail.tsx`, `src/lib/segmentMatching.ts`, `src/lib/segmentFormatters.ts`
**Data:** `data/segments.json`, `data/customers.json`
**Components:** `Card`, `Badge`, `Chip`, `Alert`

## Epic 4: Segment Creation Flow
Add the input flow for creating a new segment inside the existing workspace.

### S4.1: Build the create segment form with validation [M]
Create the form state for segment name and description, enforce the minimum name length, and provide cancel or next actions.
**Acceptance Criteria:**
- [ ] The form supports segment name and description inputs.
- [ ] Name validation blocks progress until at least 3 characters are entered.
- [ ] Cancel returns the user to the default list state without creating a draft.
**Files:** `src/pages/CustomerSegmentsPage.tsx`, `src/components/SegmentCreateForm.tsx`, `src/components/SegmentCreateForm.module.css`
**Data:** None
**Components:** `Card`, `Input`, `Button`, `Alert`

### S4.2: Create the rule builder rows and BRD-scoped field logic [L]
Add editable rule rows with field, operator, and value controls. Limit authoring to the BRD-supported fields and operators, and show AND relationships between rows.
**Acceptance Criteria:**
- [ ] Users can add and remove rule rows in the builder.
- [ ] Operator and value inputs adapt to the selected field.
- [ ] Only BRD-scoped operators are available for new rules.
**Files:** `src/pages/CustomerSegmentsPage.tsx`, `src/components/RuleBuilder.tsx`, `src/components/RuleBuilder.module.css`, `src/lib/ruleBuilderOptions.ts`
**Data:** `data/customers.json`
**Components:** `Card`, `Select`, `Input`, `Button`, `Chip`, `Alert`

## Epic 5: Preview and Local Draft Results
Close the loop by evaluating rule matches and optionally surfacing a newly created segment in the local list.

### S5.1: Evaluate builder rules and show preview results [M]
Run the current rule set against `customers.json` when the user clicks Preview and show total match count, first five customers, and strong no-match feedback.
**Acceptance Criteria:**
- [ ] Preview runs only on explicit user action.
- [ ] The result shows a total count and up to five matching customers.
- [ ] A no-match state tells the user to broaden their criteria.
**Files:** `src/pages/CustomerSegmentsPage.tsx`, `src/components/SegmentPreview.tsx`, `src/components/SegmentPreview.module.css`, `src/lib/segmentMatching.ts`
**Data:** `data/customers.json`
**Components:** `Card`, `Badge`, `Button`, `Alert`

### S5.2: Insert created segments into local session state [M]
After a valid preview or save action, add the newly created segment to local page state so it appears in the list with its computed customer count for the current session.
**Acceptance Criteria:**
- [ ] A created segment appears in the list without editing JSON files.
- [ ] The inserted segment carries its computed customer count and rule summary.
- [ ] Seeded segments and session-created segments can coexist in the same list.
**Files:** `src/pages/CustomerSegmentsPage.tsx`, `src/lib/segmentFactory.ts`
**Data:** `data/segments.json`, `data/customers.json`
**Components:** `Card`, `Badge`, `Button`
