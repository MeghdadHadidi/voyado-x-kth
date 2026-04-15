# Product Requirements Document: Rewards Store

## 1. Overview

The Rewards Store is a member-facing redemption experience for loyalty members who want to browse available rewards, understand what they can afford, and redeem points with confidence. The product should make the member's current balance and tier immediately visible, present a filterable reward catalog, support lightweight reward exploration, and provide a clear confirmation flow before points are spent.

For Team 5's workshop MVP, the priority is to deliver a complete browse-and-redeem flow first: points header, reward catalog, category filtering, and redemption confirmation. Reward detail and redemption history should still be included in the PRD and implemented if time allows, but they should not block the core store experience.

## 2. User Persona

**Primary user:** Sofia, a loyalty program member

Sofia regularly visits the rewards store to see what she can redeem with her current points balance. She wants to quickly understand what is available, filter rewards by category, compare options against her balance, and complete redemption without friction. She values a simple, clean interface and reassurance that the redemption went through successfully.

## 3. Functional Requirements

### FR-1: Points Balance Header

- **Description:** Display the current member's name, points balance, and loyalty tier in a prominent hero/header section at the top of the page.
- **User Story:** As a loyalty member, I want to see my current points balance and tier immediately so that I know what rewards I can afford.
- **Acceptance Criteria:**
  - [ ] The page shows the current member's first name in a welcome message using data from `data/member.json`.
  - [ ] The current points balance is displayed prominently with formatted thousands separators and a `pts` suffix.
  - [ ] The member's tier is displayed using a `Badge`.
  - [ ] The points balance updates in React state immediately after a successful redemption.
  - [ ] The header is visually distinct from the rest of the store using Essence design tokens and CSS Modules.
- **Data Source:** `apps/team-5-rewards-store/data/member.json`
- **UI Components:** `Card`, `Badge`
- **Priority:** MVP

### FR-2: Reward Catalog

- **Description:** Display a responsive catalog of reward cards that make availability, cost, and redeemability clear at a glance.
- **User Story:** As a loyalty member, I want to browse all rewards in one place so that I can decide what to redeem.
- **Acceptance Criteria:**
  - [ ] All rewards from `data/rewards.json` are rendered in a desktop-first responsive grid.
  - [ ] Each reward card shows image, reward name, points cost, and category label.
  - [ ] Rewards that the member cannot afford remain visible but their redeem action is disabled.
  - [ ] Rewards with `available: false` or `stock: 0` remain visible but are visually muted and clearly marked as sold out.
  - [ ] Hover states communicate that reward cards are interactive.
  - [ ] Clicking the reward's primary action opens the redemption confirmation flow.
- **Data Source:** `apps/team-5-rewards-store/data/rewards.json`, `apps/team-5-rewards-store/data/member.json`
- **UI Components:** `Card`, `Chip`, `Badge`, `Button`
- **Priority:** MVP

### FR-3: Category Filtering

- **Description:** Let the member filter rewards by category using tabs while keeping the experience fast and easy to scan.
- **User Story:** As a loyalty member, I want to filter rewards by category so that I can quickly find the kind of reward I want.
- **Acceptance Criteria:**
  - [ ] The store provides category tabs for `All`, `Discounts`, `Products`, and `Experiences`.
  - [ ] Each tab shows a label and category count derived from `data/rewards.json`.
  - [ ] Switching tabs updates the visible reward list instantly using client-side React state.
  - [ ] The active tab is visually distinct.
  - [ ] Filtered results preserve disabled and sold-out presentation rules from the catalog.
- **Data Source:** `apps/team-5-rewards-store/data/rewards.json`
- **UI Components:** `Tabs`
- **Priority:** MVP

### FR-4: Redemption Confirmation

- **Description:** Ask the member to confirm before spending points and reflect the outcome immediately in the UI.
- **User Story:** As a loyalty member, I want to confirm a redemption before points are deducted so that I feel confident about the action.
- **Acceptance Criteria:**
  - [ ] Clicking `Redeem` opens a modal/dialog with the reward name, points cost, current balance, and resulting balance.
  - [ ] The dialog provides `Confirm Redemption` and `Cancel` actions.
  - [ ] Confirming deducts the reward's `pointsCost` from the member's balance in React state.
  - [ ] Confirming decrements reward stock when the reward uses stock-based availability.
  - [ ] Confirming adds a new entry to the redemption history list for the current session.
  - [ ] Canceling closes the dialog with no state changes.
  - [ ] A success message appears after redemption.
- **Data Source:** `apps/team-5-rewards-store/data/member.json`, `apps/team-5-rewards-store/data/rewards.json`, `apps/team-5-rewards-store/data/redemptions.json`
- **UI Components:** `Dialog`, `Card`, `Button`, `Alert`
- **Priority:** MVP

### FR-5: Reward Detail Modal

- **Description:** Provide a simple, clean modal/dialog for viewing extended reward information without leaving the current store context.
- **User Story:** As a loyalty member, I want to inspect a reward in more detail so that I can decide whether it is worth redeeming.
- **Acceptance Criteria:**
  - [ ] Clicking a reward card's non-primary area opens a reward detail modal/dialog.
  - [ ] The detail view shows the reward image, name, description, points cost, category, and availability information.
  - [ ] The detail view includes stock information when stock is applicable.
  - [ ] The detail view includes a redeem action that follows the same disabled-state logic as the catalog.
  - [ ] Closing the detail modal returns the member to the same tab/filter context.
  - [ ] Sold-out rewards display a clear warning message while remaining visible.
- **Data Source:** `apps/team-5-rewards-store/data/rewards.json`, `apps/team-5-rewards-store/data/member.json`
- **UI Components:** `Dialog`, `Card`, `Chip`, `Badge`, `Button`, `Alert`
- **Priority:** Nice-to-have

### FR-6: Redemption History

- **Description:** Show past and newly created redemptions in a dedicated tab so members can review what they have redeemed.
- **User Story:** As a loyalty member, I want to see my redemption history so that I can track how I have spent my points.
- **Acceptance Criteria:**
  - [ ] The page includes tabs for `Store` and `My Redemptions`.
  - [ ] The history view displays pre-loaded redemptions from `data/redemptions.json`.
  - [ ] Newly redeemed rewards appear at the top of the list during the session.
  - [ ] Entries are sorted by most recent redemption date first.
  - [ ] Each entry shows reward name, points spent, and a formatted redemption date.
  - [ ] If there are no redemptions, the UI shows a clear empty state.
- **Data Source:** `apps/team-5-rewards-store/data/redemptions.json`
- **UI Components:** `Tabs`, `Card`, `Badge`, `Alert`
- **Priority:** Nice-to-have

## 4. Non-Functional Requirements

- **NFR-1: Responsive Layout** - The module must work cleanly on desktop at 1024px and above, with graceful adaptation for smaller screens where possible.
- **NFR-2: Design System Compliance** - Styling must use Essence design tokens and shared UI components from `@voyado-kth/ui`; no custom design system should be introduced.
- **NFR-3: Type Safety** - All reward, redemption, and member data must use shared types from `@voyado-kth/shared`.
- **NFR-4: Performance** - Interactions such as tab filtering and dialog opening should feel instant and rely on local React state with no heavy dependencies.
- **NFR-5: Accessibility** - Interactive elements must use semantic HTML, visible focus states, accessible button labels, and keyboard-friendly dialog interactions.
- **NFR-6: Code Organization** - Implementation should follow one-component-per-file where practical, use CSS Modules, and colocate styles with components inside the team app.

## 5. Data Model

| Data File | TypeScript Interface | Notes |
|-----------|----------------------|-------|
| `data/member.json` | `Customer` | Single active member record used for balance, tier, and personalization |
| `data/rewards.json` | `Reward[]` | Reward catalog including affordability, category, `available`, and optional stock-like values |
| `data/redemptions.json` | `Redemption[]` | Historical redemption records shown in the history view |

### Data Notes

- Reward categories are constrained by `RewardCategory`: `'discount' | 'product' | 'experience'`.
- Some rewards use `stock: null`, which should be treated as non-stock-limited rewards in the UI logic.
- Sold-out presentation should be driven by `available === false` or `stock === 0`.
- New redemptions created during the session should conform to the `Redemption` interface even if they are only stored in React state.

## 6. Component Inventory

The following shared components are recommended from `@voyado-kth/ui`:

- `Card` for the points header, reward cards, detail content, and history items
- `Badge` for tier display, sold-out state, and points/status labeling
- `Button` for redeem, confirm, cancel, and close/back actions
- `Chip` for reward category display
- `Tabs` for category filtering and switching between Store and My Redemptions
- `Alert` for success states, empty states, and sold-out messaging
- `Dialog` for redemption confirmation and reward detail modals

## 7. Out of Scope

- Backend persistence or API integration for real redemptions
- Authentication, account switching, or multi-member support
- Payment flows, refunds, or redemption cancellation
- Real inventory synchronization with an external system
- Advanced search, sorting, or recommendation logic beyond category tabs
- Mobile-specific polish beyond reasonable responsive behavior during the workshop

## 8. MVP Definition

The recommended workshop MVP is:

| Requirement | Scope |
|-------------|-------|
| FR-1 | Must complete |
| FR-2 | Must complete |
| FR-3 | Must complete |
| FR-4 | Must complete |

FR-5 and FR-6 are recommended stretch goals after the core browse-and-redeem flow is working.

## 9. Implementation Notes

- The default experience should open on the `Store` tab.
- Category filtering should use tabs rather than chips for the primary interaction.
- Reward detail should use a simple, clean modal/dialog rather than a full page transition.
- Rewards that are unavailable or unaffordable should still be shown so members understand the full catalog, but they should be visually muted and non-actionable where appropriate.
