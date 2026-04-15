import { ShoppingBag } from 'lucide-react';
import styles from './ComingSoon.module.css';

// Legacy placeholder kept locally as a fallback reference, but no longer exported.
export function ComingSoon() {
  return (
    <div className={styles.emptyState}>
      <div className={styles.iconCircle}>
        <ShoppingBag size={32} strokeWidth={1.5} />
      </div>
      <h2 className={styles.emptyTitle}>Under Construction</h2>
      <p className={styles.emptyDescription}>
        This module is being built during the workshop. Check back soon!
      </p>
    </div>
  );
}
