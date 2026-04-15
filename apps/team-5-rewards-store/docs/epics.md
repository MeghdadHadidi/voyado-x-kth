# Sprint Plan: Rewards Store

## Epic 1: Project Setup

Replace the placeholder page with the real Rewards Store shell, wire typed data imports, and connect the route entry to the new page.

### S1.1: Create the rewards store page scaffold [S]

Create the main Rewards Store page component with a basic layout that replaces the current placeholder. Add stable page regions for the points header, tabs, catalog, and messages so the rest of the stories can be layered on top without restructuring the page.

**Acceptance Criteria:**
- [ ] A new page component renders inside `TeamPageLayout` instead of `ComingSoon`
- [ ] The page contains placeholder sections for header, tabs, alerts, and content
- [ ] Layout spacing is handled with a CSS Module and Essence tokens

**Files:** `src/pages/Index.tsx`, `src/pages/RewardsStorePage.tsx`, `src/pages/RewardsStorePage.module.css`  
**Data:** None  
**Components:** `TeamPageLayout`

### S1.2: Set up typed data loading and local store state [M]

Import the member, rewards, and redemptions JSON files and connect them to shared types from `@voyado-kth/shared`. Initialize the page state needed for category filtering, top-level tabs, selected reward dialogs, success alerts, member balance updates, and in-session redemption history.

**Acceptance Criteria:**
- [ ] `member.json`, `rewards.json`, and `redemptions.json` are imported into the page
- [ ] Shared types are used for all loaded data
- [ ] React state is ready for filters, dialogs, reward updates, and redemption history

**Files:** `src/pages/RewardsStorePage.tsx`  
**Data:** `data/member.json`, `data/rewards.json`, `data/redemptions.json`  
**Components:** None

### S1.3: Update module exports to point to the new page [S]

Update the team module entry so the shell route renders the real Rewards Store page. Keep the export surface clean and remove route-level reliance on the placeholder page.

**Acceptance Criteria:**
- [ ] `src/index.ts` continues to export the route entry expected by the shell
- [ ] `Index.tsx` renders the new page component
- [ ] `ComingSoon` is no longer used as the route output

**Files:** `src/index.ts`, `src/pages/Index.tsx`  
**Data:** None  
**Components:** None

## Epic 2: MVP Store Experience

Build the core browsing experience with member context, reward discovery, and fast category filtering.

### S2.1: Build the points balance hero header [S]

Create a reusable points header component that greets the member, shows their tier, and prominently displays their current points balance. This is the first visible piece of the store and should react to redemption updates from page state.

**Acceptance Criteria:**
- [ ] The member's first name appears in the header
- [ ] The tier is shown with a `Badge`
- [ ] The points balance uses formatted thousands separators with a `pts` suffix
- [ ] The header styling stands out from the rest of the page

**Files:** `src/pages/RewardsStorePage.tsx`, `src/components/PointsHeader.tsx`, `src/components/PointsHeader.module.css`  
**Data:** `data/member.json`  
**Components:** `Card`, `Badge`

### S2.2: Render the reward catalog grid with availability states [M]

Create the catalog grid and reward card components. Show reward imagery, category, and points cost, while keeping sold-out and unaffordable rewards visible but visually muted with disabled redemption actions.

**Acceptance Criteria:**
- [ ] All rewards render in a responsive grid
- [ ] Each reward card shows image, title, category, and points cost
- [ ] Sold-out rewards are muted and clearly labeled
- [ ] Unaffordable rewards keep a disabled redeem action while remaining visible

**Files:** `src/pages/RewardsStorePage.tsx`, `src/components/RewardsCatalog.tsx`, `src/components/RewardsCatalog.module.css`, `src/components/RewardCard.tsx`, `src/components/RewardCard.module.css`  
**Data:** `data/rewards.json`, `data/member.json`  
**Components:** `Card`, `Chip`, `Badge`, `Button`, `Grid`

### S2.3: Add category tabs and filtered catalog state [S]

Implement category tabs for All, Discounts, Products, and Experiences. Each tab should include a category count and immediately filter the visible rewards without affecting the rest of the page state.

**Acceptance Criteria:**
- [ ] Tabs render the four category views
- [ ] Each tab label includes a reward count
- [ ] Changing tabs filters the catalog instantly
- [ ] The active tab remains selected across other interactions

**Files:** `src/pages/RewardsStorePage.tsx`, `src/components/CategoryTabs.tsx`  
**Data:** `data/rewards.json`  
**Components:** `Tabs`

## Epic 3: Redemption Flow

Add the core interactive loop that lets members confirm redemptions, see immediate updates, and inspect rewards in more detail.

### S3.1: Create the redemption confirmation dialog [M]

Build a dialog triggered by the redeem action. Show the selected reward, the member's current balance, the cost, and the resulting balance after redemption so the action feels safe and explicit.

**Acceptance Criteria:**
- [ ] Redeem opens a dialog with reward summary content
- [ ] The dialog displays current and resulting balance values
- [ ] Confirm and cancel actions are clearly available
- [ ] Cancel closes the dialog without changing state

**Files:** `src/pages/RewardsStorePage.tsx`, `src/components/RedemptionDialog.tsx`  
**Data:** `data/member.json`, `data/rewards.json`  
**Components:** `Dialog`, `Card`, `Button`

### S3.2: Wire redemption state updates and success feedback [M]

Handle the confirm action by deducting points, decrementing stock where applicable, creating a new redemption entry in local state, and showing a success alert after completion.

**Acceptance Criteria:**
- [ ] Confirm deducts the correct points value
- [ ] Stock-based rewards decrement after confirmation
- [ ] A new redemption entry is added to local history state
- [ ] A success alert appears after redemption

**Files:** `src/pages/RewardsStorePage.tsx`, `src/components/RedemptionAlert.tsx`  
**Data:** `data/member.json`, `data/rewards.json`, `data/redemptions.json`  
**Components:** `Alert`

### S3.3: Add a simple reward detail modal [M]

Implement a clean reward detail dialog opened from the card body. It should show the longer description, status information, and a redeem action that respects the same disabled logic as the catalog.

**Acceptance Criteria:**
- [ ] Clicking a reward detail area opens a modal/dialog
- [ ] The dialog shows description, category, cost, and availability details
- [ ] Sold-out rewards display a clear warning message
- [ ] Closing the dialog preserves the current tab and filter selection

**Files:** `src/pages/RewardsStorePage.tsx`, `src/components/RewardDetailDialog.tsx`  
**Data:** `data/rewards.json`, `data/member.json`  
**Components:** `Dialog`, `Card`, `Chip`, `Badge`, `Button`, `Alert`

## Epic 4: Redemption History and Polish

Complete the module with a history view and final tab-level integration so the member can switch between shopping and reviewing redemptions.

### S4.1: Add Store and My Redemptions top-level tabs [S]

Create top-level tabs that switch between the store and history view. The store tab should remain the default, and switching between views should not reset category state or dialog-related page state unexpectedly.

**Acceptance Criteria:**
- [ ] The page includes Store and My Redemptions tabs
- [ ] Store is the default initial tab
- [ ] Switching tabs preserves existing store state

**Files:** `src/pages/RewardsStorePage.tsx`  
**Data:** None  
**Components:** `Tabs`

### S4.2: Build the redemption history list and empty state [M]

Create the history view that merges existing redemptions with in-session redemptions, sorts them newest first, formats dates for readability, and shows a helpful empty state when there is no history to show.

**Acceptance Criteria:**
- [ ] Preloaded redemptions render in the history view
- [ ] New redemptions appear at the top after confirmation
- [ ] Each history item shows reward name, points spent, and formatted date
- [ ] An empty state is shown when there are no redemptions

**Files:** `src/pages/RewardsStorePage.tsx`, `src/components/RedemptionHistory.tsx`, `src/components/RedemptionHistory.module.css`  
**Data:** `data/redemptions.json`  
**Components:** `Card`, `Badge`, `Alert`

## Recommended Build Order

Follow the stories in order:

1. `S1.1` -> `S1.2` -> `S1.3`
2. `S2.1` -> `S2.2` -> `S2.3`
3. `S3.1` -> `S3.2`
4. `S3.3` and `S4.1` -> `S4.2`

The MVP is complete after `S3.2`. Stories `S3.3`, `S4.1`, and `S4.2` are stretch work if time is tight.
