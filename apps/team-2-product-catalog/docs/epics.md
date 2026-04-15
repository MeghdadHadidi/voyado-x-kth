# Sprint Plan: Product Catalog

## Epic 1: Project Setup

Replace the placeholder page with a typed Product Catalog scaffold that the shell can render and later stories can extend.

### S1.1: Create the product catalog page layout [S]
Replace the coming-soon view with a dedicated Product Catalog page that renders inside `TeamPageLayout` and includes a page header plus empty content regions for controls and results.
**Acceptance Criteria:**
- [ ] A new catalog page component is created under `src/pages` and rendered from `Index.tsx`.
- [ ] The page shows a Product Catalog title and placeholder regions for controls and the product grid.
- [ ] The old ComingSoon content is no longer shown on the `/products` route.
**Files:** `src/pages/Index.tsx`, `src/pages/ProductCatalogPage.tsx`, `src/pages/ProductCatalogPage.module.css`
**Data:** None
**Components:** TeamPageLayout, PageHeader

### S1.2: Set up typed data imports and catalog state [M]
Import products and categories from the data folder, type them with `Product` and `ProductCategory`, and add the baseline React state needed for category, search, sort, selected product, and wishlist.
**Acceptance Criteria:**
- [ ] Products and categories are imported from JSON files using shared `Product` and `ProductCategory` types.
- [ ] Default state exists for active category, search query, sort option, selected product, and wishlist IDs.
- [ ] Derived product collections are ready to be rendered by later stories.
**Files:** `src/pages/ProductCatalogPage.tsx`
**Data:** `data/products.json`, `data/categories.json`
**Components:** None

### S1.3: Update module exports for the new page entry [S]
Make sure the team module exports the page components needed by the shell after the placeholder is removed from the main route flow.
**Acceptance Criteria:**
- [ ] `src/index.ts` exports remain valid for the shell import path.
- [ ] `Index` continues to be the page entry used by the shell.
- [ ] Unused placeholder exports are removed if they are no longer needed.
**Files:** `src/index.ts`, `src/pages/ComingSoon.tsx`
**Data:** None
**Components:** None

## Epic 2: Catalog Discovery MVP

Build the visible browsing experience with the product grid, category filters, and live search.

### S2.1: Render the product grid with card content [M]
Display all products in a responsive grid using shared `Card` styling, formatted prices, category chips, rating text, and stock indicators so the catalog becomes browsable.
**Acceptance Criteria:**
- [ ] All products from `data/products.json` appear in a responsive card grid.
- [ ] Each card shows product name, formatted price, category, rating, and stock state.
- [ ] Cards have hoverable styling and a clear clickable surface.
**Files:** `src/pages/ProductCatalogPage.tsx`, `src/pages/ProductCatalogPage.module.css`, `src/components/ProductCard.tsx`, `src/components/ProductCard.module.css`
**Data:** `data/products.json`
**Components:** Card, Chip, Badge

### S2.2: Add single-select category filters [S]
Create the category filter row with an All option and active-state styling, then connect it to the rendered product collection.
**Acceptance Criteria:**
- [ ] All categories and an All option are rendered as clickable filter controls.
- [ ] Only one category can be active at a time.
- [ ] The product grid updates immediately when a category is selected.
**Files:** `src/pages/ProductCatalogPage.tsx`, `src/pages/ProductCatalogPage.module.css`, `src/components/CategoryFilterBar.tsx`, `src/components/CategoryFilterBar.module.css`
**Data:** `data/categories.json`, `data/products.json`
**Components:** Chip

### S2.3: Implement live search with neutral empty state [S]
Add a search input that filters products by name in real time and show a simple neutral empty state with reset guidance when no matches are found.
**Acceptance Criteria:**
- [ ] The search input filters by partial, case-insensitive product name matches.
- [ ] Search combines correctly with the active category filter.
- [ ] A neutral empty state appears when no products match and offers a reset path.
**Files:** `src/pages/ProductCatalogPage.tsx`, `src/pages/ProductCatalogPage.module.css`, `src/components/CatalogEmptyState.tsx`, `src/components/CatalogEmptyState.module.css`
**Data:** `data/products.json`
**Components:** Input, Alert, Button

## Epic 3: Quick Actions and Personalization

Introduce the action-heavy controls that make the catalog feel interactive and personalized.

### S3.1: Add sort controls for visible products [S]
Create a sort selector near the search and filters so users can reorder the visible product set by name, price, or rating.
**Acceptance Criteria:**
- [ ] Sort options include `Name A-Z`, `Price low-high`, `Price high-low`, and `Rating highest`.
- [ ] `Name A-Z` is selected by default.
- [ ] Sorting updates the currently filtered product collection immediately.
**Files:** `src/pages/ProductCatalogPage.tsx`, `src/pages/ProductCatalogPage.module.css`, `src/components/SortControl.tsx`
**Data:** `data/products.json`
**Components:** Select

### S3.2: Implement wishlist toggles and count badge [M]
Add wishlist actions to product cards and show a visible count badge near the catalog header so users can save products while browsing.
**Acceptance Criteria:**
- [ ] Each product card has a wishlist toggle action with distinct saved and unsaved states.
- [ ] Wishlist state is stored in React state using product IDs.
- [ ] A wishlist count badge reflects the current number of saved products.
**Files:** `src/pages/ProductCatalogPage.tsx`, `src/components/ProductCard.tsx`, `src/components/ProductCard.module.css`
**Data:** `data/products.json`
**Components:** Badge, Button, PageHeader

## Epic 4: Product Details

Extend the catalog with a richer modal view for inspecting product information and mirrored wishlist actions.

### S4.1: Open a product detail dialog from the grid [M]
Wire product-card clicks to a `Dialog`-based detail view that shows the selected product and can be closed without losing filter state.
**Acceptance Criteria:**
- [ ] Clicking a product card opens a dialog for that product.
- [ ] Closing the dialog returns the user to the same filtered and sorted grid state.
- [ ] The dialog is keyboard accessible and dismissible.
**Files:** `src/pages/ProductCatalogPage.tsx`, `src/components/ProductDetailDialog.tsx`, `src/components/ProductDetailDialog.module.css`
**Data:** `data/products.json`
**Components:** Dialog, Button

### S4.2: Fill the detail dialog with metadata and wishlist actions [M]
Complete the dialog content with description, tags, price, rating, stock messaging, and a synced wishlist control so the detail view adds meaningful context.
**Acceptance Criteria:**
- [ ] The dialog shows product description, category, tags, rating, price, and stock status.
- [ ] Out-of-stock products are visually emphasized in the dialog.
- [ ] The wishlist action inside the dialog stays in sync with the grid.
**Files:** `src/components/ProductDetailDialog.tsx`, `src/components/ProductDetailDialog.module.css`
**Data:** `data/products.json`
**Components:** Card, Chip, Badge, Button, Alert

## Recommended Implementation Order

1. `S1.1`
2. `S1.2`
3. `S1.3`
4. `S2.1`
5. `S2.2`
6. `S2.3`
7. `S3.1`
8. `S3.2`
9. `S4.1`
10. `S4.2`

## MVP Stories

The MVP is covered by:

- `S1.1`
- `S1.2`
- `S1.3`
- `S2.1`
- `S2.2`
- `S2.3`
- `S3.1`
- `S3.2`
