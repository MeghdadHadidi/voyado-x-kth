import { useState } from 'react';
import type { Product, ProductCategory } from '@voyado-kth/shared';
import { Badge, Card, Input } from '@voyado-kth/ui';
import { CatalogEmptyState } from '../components/CatalogEmptyState';
import { CategoryFilterBar } from '../components/CategoryFilterBar';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailDialog } from '../components/ProductDetailDialog';
import { SortControl } from '../components/SortControl';
import categoriesData from '../../data/categories.json';
import productsData from '../../data/products.json';
import styles from './ProductCatalogPage.module.css';

type SortOptionId = 'name-asc' | 'price-asc' | 'price-desc' | 'rating-desc';

const categories = categoriesData as ProductCategory[];
const products = productsData as Product[];
const sortLabels: Record<SortOptionId, string> = {
  'name-asc': 'Name A-Z',
  'price-asc': 'Price low-high',
  'price-desc': 'Price high-low',
  'rating-desc': 'Rating highest',
};

function toggleWishlistId(currentIds: string[], productId: string) {
  return currentIds.includes(productId)
    ? currentIds.filter(id => id !== productId)
    : [...currentIds, productId];
}

export function ProductCatalogPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOptionId>('name-asc');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds(currentIds => toggleWishlistId(currentIds, productId));
  };

  const matchingProducts = products.filter(product => {
    const matchesCategory =
      activeCategory === 'all' || product.category === activeCategory;
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const matchesSearch =
      normalizedQuery.length === 0 ||
      product.name.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesSearch;
  });

  const visibleProducts = [...matchingProducts].sort((left, right) => {
    switch (sortOption) {
      case 'price-asc':
        return left.price - right.price;
      case 'price-desc':
        return right.price - left.price;
      case 'rating-desc':
        return right.rating - left.rating;
      case 'name-asc':
      default:
        return left.name.localeCompare(right.name);
    }
  });

  const categorySummary = [
    { id: 'all', name: 'All products', productCount: products.length },
    ...categories,
  ];

  const statePreview = [
    {
      label: 'Active category',
      value:
        activeCategory === 'all'
          ? 'All products'
          : (categories.find(category => category.id === activeCategory)?.name ??
            activeCategory),
    },
    {
      label: 'Search query',
      value: searchQuery || 'No query set',
    },
    {
      label: 'Sort preset',
      value: sortLabels[sortOption],
    },
    {
      label: 'Selected product',
      value: selectedProduct?.name ?? 'No product selected',
    },
    {
      label: 'Wishlist state',
      value:
        wishlistIds.length > 0
          ? `${wishlistIds.length} saved`
          : 'No saved products yet',
    },
  ];

  const catalogPreview = [
    `${visibleProducts.length} visible products`,
    `${categorySummary.find(category => category.id === activeCategory)?.name ?? 'All products'} active`,
    `${products.filter(product => !product.inStock).length} out-of-stock states loaded`,
  ];

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="catalog-planning-title">
        <div className={styles.heroCopy}>
          <Badge variant="info">Story S4.1</Badge>
          <h2 id="catalog-planning-title" className={styles.heroTitle}>
            Product details now open in a focused dialog.
          </h2>
          <p className={styles.heroDescription}>
            Clicking a product card now opens a modal dialog, and closing it
            returns you to the same filtered, searched, sorted catalog state.
            This sets up the dialog shell before the richer detail content story.
          </p>
        </div>

        <div className={styles.heroMetrics} aria-label="Planned catalog sections">
          <div className={styles.metric}>
            <span className={styles.metricValue}>{products.length}</span>
            <span className={styles.metricLabel}>catalog items rendered</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricValue}>{selectedProduct ? 1 : 0}</span>
            <span className={styles.metricLabel}>detail dialog open</span>
          </div>
        </div>
      </section>

      <section className={styles.layout} aria-label="Catalog page scaffold">
        <Card className={styles.surface}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>Controls region</p>
              <h3 className={styles.sectionTitle}>Quick-find toolbar</h3>
            </div>
            <div className={styles.headerBadges}>
              <span className={styles.sectionNote}>Ready for S3.2-S4.2</span>
              <Badge variant={wishlistIds.length > 0 ? 'info' : 'neutral'}>
                Wishlist ({wishlistIds.length})
              </Badge>
            </div>
          </div>

          <CategoryFilterBar
            categories={categorySummary}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          <Input
            type="search"
            label="Search products"
            placeholder="Search products..."
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
          />

          <SortControl value={sortOption} onChange={value => setSortOption(value as SortOptionId)} />

          <div className={styles.stateList} aria-label="Catalog state preview">
            {statePreview.map(item => (
              <div key={item.label} className={styles.stateItem}>
                <span className={styles.stateLabel}>{item.label}</span>
                <strong className={styles.stateValue}>{item.value}</strong>
              </div>
            ))}
          </div>
        </Card>

        <Card className={styles.surface}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>Results region</p>
              <h3 className={styles.sectionTitle}>Catalog canvas</h3>
            </div>
            <span className={styles.sectionNote}>Ready for S2.1-S4.2</span>
          </div>

          <div className={styles.resultsIntro}>
            <div className={styles.canvasLead}>
              The results region now responds to category, search, and sort
              changes, making the grid feel closer to a real storefront
              browsing flow with multiple browse modes.
            </div>
            <div className={styles.previewGrid}>
              {catalogPreview.map(item => (
                <div key={item} className={styles.previewTile}>
                  <span className={styles.previewLabel}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {visibleProducts.length > 0 ? (
            <div className={styles.productGrid} aria-label="Product catalog grid">
              {visibleProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onOpenDetails={setSelectedProduct}
                />
              ))}
            </div>
          ) : (
            <CatalogEmptyState
              query={searchQuery.trim() || 'your current filters'}
              onReset={() => setSearchQuery('')}
            />
          )}
        </Card>
      </section>

      <ProductDetailDialog
        product={selectedProduct}
        open={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />
    </main>
  );
}
