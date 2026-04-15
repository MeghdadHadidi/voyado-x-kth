import { Alert, Button } from '@voyado-kth/ui';
import styles from './CatalogEmptyState.module.css';

export interface CatalogEmptyStateProps {
  query: string;
  onReset: () => void;
}

export function CatalogEmptyState({
  query,
  onReset,
}: CatalogEmptyStateProps) {
  return (
    <div className={styles.wrapper}>
      <Alert variant="info" title="No products found">
        No products match
        {' '}
        <strong className={styles.query}>{query}</strong>
        .
      </Alert>
      <Button variant="ghost" onClick={onReset}>
        Clear search
      </Button>
    </div>
  );
}
