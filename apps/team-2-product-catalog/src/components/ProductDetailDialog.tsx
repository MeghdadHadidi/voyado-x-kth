import type { Product } from '@voyado-kth/shared';
import { Alert, Badge, Button, Chip, Dialog } from '@voyado-kth/ui';
import styles from './ProductDetailDialog.module.css';

export interface ProductDetailDialogProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export function ProductDetailDialog({
  product,
  open,
  onClose,
  isWishlisted,
  onToggleWishlist,
}: ProductDetailDialogProps) {
  if (!product) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={product.name}
      actions={
        <>
          <Button
            variant={isWishlisted ? 'primary' : 'neutral'}
            onClick={() => onToggleWishlist(product.id)}
          >
            {isWishlisted ? '♥ Saved to wishlist' : '♡ Add to wishlist'}
          </Button>
          <Button variant="neutral" onClick={onClose}>
            Back to catalog
          </Button>
        </>
      }
    >
      <div className={styles.content}>
        <div className={styles.mediaWrap}>
          <img
            className={styles.media}
            src={product.imageUrl}
            alt={product.name}
          />
        </div>
        <div className={styles.summary}>
          {!product.inStock && (
            <Alert variant="warning" title="Out of stock">
              This product is currently unavailable, but you can still keep it
              on your wishlist for later.
            </Alert>
          )}

          <div className={styles.heroRow}>
            <strong className={styles.price}>
              {new Intl.NumberFormat('sv-SE', {
                maximumFractionDigits: 0,
              }).format(product.price)}
              {' '}
              {product.currency}
            </strong>
            <div className={styles.badgeRow}>
              <Badge variant={product.inStock ? 'success' : 'danger'}>
                {product.inStock ? 'In stock' : 'Out of stock'}
              </Badge>
              <Badge variant="warning">{product.rating.toFixed(1)} ★</Badge>
            </div>
          </div>

          <p className={styles.description}>{product.description}</p>

          <div className={styles.tagRow}>
            <Chip label={product.category} />
            {product.tags.map(tag => (
              <Chip key={tag} label={tag} />
            ))}
          </div>

          <dl className={styles.metaList}>
            <div className={styles.metaItem}>
              <dt className={styles.label}>Category</dt>
              <dd className={styles.value}>{product.category}</dd>
            </div>
            <div className={styles.metaItem}>
              <dt className={styles.label}>Wishlist</dt>
              <dd className={styles.value}>
                {isWishlisted ? 'Saved for later' : 'Not saved yet'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </Dialog>
  );
}
