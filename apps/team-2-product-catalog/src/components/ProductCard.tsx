import type { Product } from '@voyado-kth/shared';
import { Badge, Button, Card, Chip } from '@voyado-kth/ui';
import styles from './ProductCard.module.css';

function formatPrice(price: number, currency: string) {
  const formatted = new Intl.NumberFormat('sv-SE', {
    maximumFractionDigits: 0,
  }).format(price);

  return `${formatted} ${currency}`;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('');
}

export interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onOpenDetails: (product: Product) => void;
}

export function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onOpenDetails,
}: ProductCardProps) {
  return (
    <Card className={styles.card} hoverable>
      <article
        className={styles.article}
        aria-label={product.name}
        onClick={() => onOpenDetails(product)}
      >
        <div className={styles.mediaWrap}>
          <img
            className={styles.media}
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
          />
          <div className={styles.mediaOverlay}>
            <span className={styles.initials}>{getInitials(product.name)}</span>
          </div>
          <div className={styles.stockBadge}>
            <Badge variant={product.inStock ? 'success' : 'danger'}>
              {product.inStock ? 'In stock' : 'Out of stock'}
            </Badge>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.metaRow}>
            <Chip label={product.category} />
            <span className={styles.rating}>{product.rating.toFixed(1)} ★</span>
          </div>

          <div className={styles.actionRow}>
            <Button
              variant={isWishlisted ? 'primary' : 'ghost'}
              size="small"
              onClick={event => {
                event.stopPropagation();
                onToggleWishlist(product.id);
              }}
              aria-pressed={isWishlisted}
            >
              {isWishlisted ? '♥ Saved' : '♡ Save'}
            </Button>
          </div>

          <div className={styles.textBlock}>
            <h3 className={styles.title}>{product.name}</h3>
            <p className={styles.description}>{product.description}</p>
          </div>

          <div className={styles.footer}>
            <strong className={styles.price}>
              {formatPrice(product.price, product.currency)}
            </strong>
            <span className={styles.cta}>Detail view coming next</span>
          </div>
        </div>
      </article>
    </Card>
  );
}
