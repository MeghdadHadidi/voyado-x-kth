import type { ProductCategory } from '@voyado-kth/shared';
import { Chip } from '@voyado-kth/ui';
import styles from './CategoryFilterBar.module.css';

type FilterCategory = ProductCategory | {
  id: 'all';
  name: string;
  productCount: number;
};

export interface CategoryFilterBarProps {
  categories: FilterCategory[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategoryFilterBar({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterBarProps) {
  return (
    <div className={styles.filterGroup} aria-label="Product category filters">
      {categories.map(category => {
        const isActive = category.id === activeCategory;

        return (
          <button
            key={category.id}
            type="button"
            className={styles.filterButton}
            onClick={() => onCategoryChange(category.id)}
            aria-pressed={isActive}
          >
            <Chip
              label={`${category.name} (${category.productCount})`}
              variant={isActive ? 'colored' : 'neutral'}
            />
          </button>
        );
      })}
    </div>
  );
}
