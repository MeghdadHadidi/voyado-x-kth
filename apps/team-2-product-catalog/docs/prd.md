# Product Requirements Document: Product Catalog

## 1. Overview

The Product Catalog module gives loyalty members a static but polished storefront experience inside the Voyado workshop shell. Users should be able to browse products, narrow the catalog with category filters and search, reorder results with sorting, save favorites to a wishlist, and inspect product details in a modal view. The experience should feel fast, scannable, and action-oriented while staying realistic for a short workshop build.

## 2. User Persona

**Primary user:** Erik, a Gold-tier loyalty member and frequent online shopper.

Erik wants to quickly browse relevant products, refine the list without friction, and save interesting products for later. He values quick actions, clear filtering, and a modern shopping flow over deep transactional functionality.

## 3. Functional Requirements (FRs)

### FR-1: Product Grid

- **Description:** Display the full catalog in a responsive grid of product cards optimized for quick scanning and fast actions.
- **User Story:** As a loyalty member, I want to browse all available products in a clear grid so that I can quickly discover items I may want to explore or save.
- **Acceptance Criteria:**
  - [ ] All products from `apps/team-2-product-catalog/data/products.json` are rendered in a responsive grid.
  - [ ] Each card shows product initials or placeholder imagery, product name, formatted price, category, rating, and wishlist action.
  - [ ] Cards visually indicate out-of-stock products.
  - [ ] Hover and focus states make cards feel interactive.
  - [ ] Clicking a card opens the product detail modal.
- **Data Source:** `data/products.json`
- **UI Components:** `Card`, `Chip`, `Badge`, optionally `Button`
- **Priority:** MVP

### FR-2: Category Filter

- **Description:** Let users filter the catalog by one active category at a time, with an all-products option.
- **User Story:** As a shopper, I want to filter products by category so that I can narrow the catalog to items relevant to me.
- **Acceptance Criteria:**
  - [ ] Categories from `apps/team-2-product-catalog/data/categories.json` are shown as selectable filter controls.
  - [ ] An `All` option is shown with the total product count.
  - [ ] Only one category can be active at a time.
  - [ ] Active category styling is clearly distinguishable from inactive filters.
  - [ ] Category filtering updates the grid instantly without reload.
- **Data Source:** `data/categories.json`, `data/products.json`
- **UI Components:** `Chip`
- **Priority:** MVP

### FR-3: Search

- **Description:** Provide case-insensitive product-name search that works together with category filtering.
- **User Story:** As a shopper, I want to search by product name so that I can quickly find a product I already have in mind.
- **Acceptance Criteria:**
  - [ ] A search field is displayed prominently above the product grid.
  - [ ] Search updates results on each keystroke.
  - [ ] Matching is case-insensitive and supports partial strings.
  - [ ] Search works together with the selected category filter.
  - [ ] When no products match, a simple neutral empty state is shown with a way to clear or reset the search.
- **Data Source:** `data/products.json`
- **UI Components:** `Input`, optionally `Alert`, `Button`
- **Priority:** MVP

### FR-4: Sort Options

- **Description:** Let users reorder visible products by meaningful catalog sort modes.
- **User Story:** As a shopper, I want to sort products by price, name, or rating so that I can browse the catalog in the order that best suits my intent.
- **Acceptance Criteria:**
  - [ ] Sort controls are visible near the search and filter controls.
  - [ ] Supported options are `Name: A-Z`, `Price: Low to High`, `Price: High to Low`, and `Rating: Highest`.
  - [ ] The default sort is `Name: A-Z`.
  - [ ] Sorting applies to the filtered result set immediately.
  - [ ] The active sort mode is communicated clearly in the UI.
- **Data Source:** `data/products.json`
- **UI Components:** `Select` or `Button`
- **Priority:** MVP

### FR-5: Wishlist

- **Description:** Let users toggle wishlist state directly from product cards and the product detail modal.
- **User Story:** As a shopper, I want to save and unsave products to my wishlist so that I can keep track of items I may want later.
- **Acceptance Criteria:**
  - [ ] Every product card includes a wishlist toggle action.
  - [ ] Wishlist state is also editable from the detail modal.
  - [ ] Wishlisted products stay marked when filters or sorting change.
  - [ ] A visible wishlist count is shown near the page header or primary catalog actions.
  - [ ] Zero-state wishlist count is handled cleanly.
  - [ ] Wishlist state is stored locally in React state only.
- **Data Source:** `data/products.json`
- **UI Components:** `Badge`, `Button`, optionally `PageHeader`
- **Priority:** MVP

### FR-6: Product Detail Modal

- **Description:** Show a modal/dialog with richer product information and mirrored wishlist actions.
- **User Story:** As a shopper, I want to open a product detail view so that I can inspect the description, tags, stock status, and key metadata before deciding whether to save it.
- **Acceptance Criteria:**
  - [ ] Clicking a product card opens a modal or dialog for that product.
  - [ ] The modal shows product name, description, price, category, tags, rating, stock status, and a larger visual placeholder or image.
  - [ ] The modal includes an `Add to Wishlist` or `Remove from Wishlist` action.
  - [ ] The modal can be closed with an explicit close action and standard dialog dismissal behavior.
  - [ ] Closing the modal preserves the current grid filters, search query, sort mode, and wishlist state.
  - [ ] Out-of-stock products are clearly communicated within the dialog.
- **Data Source:** `data/products.json`
- **UI Components:** `Dialog`, `Card`, `Chip`, `Badge`, `Button`, optionally `Alert`
- **Priority:** Nice-to-have

## 4. Non-Functional Requirements (NFRs)

- **NFR-1: Responsive Layout** — The catalog must work well on desktop first and adapt cleanly to smaller screens with readable spacing and usable controls.
- **NFR-2: Design System Compliance** — Styling must use Essence design tokens and existing UI-library components where available.
- **NFR-3: Type Safety** — Product and category data must be typed using `Product` and `ProductCategory` from `@voyado-kth/shared`.
- **NFR-4: Performance** — Filtering, sorting, and wishlist interactions should feel immediate on the static dataset without unnecessary dependencies.
- **NFR-5: Accessibility** — The interface must use semantic HTML, keyboard-accessible controls, and accessible dialog behavior.
- **NFR-6: Code Organization** — Implementation should use React components with CSS Modules and keep logic easy to split into workshop-sized stories.

## 5. Data Model

| Data File | TypeScript Interface | Purpose |
|-----------|----------------------|---------|
| `apps/team-2-product-catalog/data/products.json` | `Product[]` | Core product catalog including name, description, price, category, tags, stock state, image, and rating |
| `apps/team-2-product-catalog/data/categories.json` | `ProductCategory[]` | Category filter definitions and displayed product counts |
| `apps/team-2-product-catalog/data/team.json` | No required shared type for catalog features | Optional team metadata for local team presentation, not required for MVP catalog behavior |

### Key Product Fields

- `id`
- `name`
- `description`
- `price`
- `currency`
- `category`
- `tags`
- `imageUrl`
- `inStock`
- `rating`

## 6. Component Inventory

The PRD should stay grounded in the real shared UI library. Recommended components:

- `Card` for product cards and supporting surfaces
- `Chip` for category filters and product tags
- `Badge` for wishlist count and stock indicators
- `Input` for live search
- `Select` for sort selection
- `Button` for quick actions and wishlist toggles
- `Dialog` for the product detail modal
- `Alert` for empty states or out-of-stock emphasis where helpful
- `PageHeader` as an optional wrapper for title and action summary

## 7. Out of Scope

- Backend APIs, persistence, or real checkout flows
- Authentication or user account management
- Multi-select category filters
- Pagination or server-side loading
- Cart or purchase completion flows
- Syncing wishlist state across sessions

## 8. MVP Definition

The team’s MVP includes the following functional requirements:

- `FR-1` Product Grid
- `FR-2` Category Filter
- `FR-3` Search
- `FR-4` Sort Options
- `FR-5` Wishlist

`FR-6` Product Detail Modal remains in scope for the workshop and should be planned, but it is the first feature to stage slightly later if time gets tight.

## 9. Build Recommendation

To fit the workshop format, implementation should follow this order:

1. Render the product grid with typed product data.
2. Add single-select category filtering.
3. Add live search and neutral empty state.
4. Add sorting controls.
5. Add wishlist state and count.
6. Add the product detail dialog with synchronized wishlist actions.
