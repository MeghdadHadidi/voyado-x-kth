import type { LoyaltyTierInfo } from "@voyado-kth/shared";
import { Badge, Card } from "@voyado-kth/ui";
import tiersJson from "../../data/tiers.json";
import { formatCompactNumber, formatNumber } from "../lib/dashboardFormatters";
import styles from "./TierDistributionCard.module.css";

const tiers = tiersJson as LoyaltyTierInfo[];
const totalMembers = tiers.reduce((sum, tier) => sum + tier.memberCount, 0);

function getTierPercentage(tier: LoyaltyTierInfo) {
  if (totalMembers === 0) {
    return 0;
  }

  return Math.round((tier.memberCount / totalMembers) * 100);
}

export function TierDistributionCard() {
  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div>
          <p className={styles.sectionLabel}>Tier distribution</p>
          <h2 className={styles.title}>Member spread by loyalty level</h2>
        </div>
        <div className={styles.totalBadge}>
          <Badge variant="info">
            {formatCompactNumber(totalMembers)} total members
          </Badge>
        </div>
      </div>

      <div className={styles.tierList}>
        {tiers.map((tier) => (
          <div key={tier.name} className={styles.tierRow}>
            <div className={styles.tierMeta}>
              <div className={styles.tierLabelRow}>
                <span className={styles.tierName}>{tier.name}</span>
                <div className={styles.tierBadge}>
                  <Badge variant="neutral">
                    {formatNumber(getTierPercentage(tier))}%
                  </Badge>
                </div>
              </div>
              <p className={styles.tierCount}>
                {formatCompactNumber(tier.memberCount)} members
              </p>
            </div>

            <div className={styles.barTrack} aria-hidden="true">
              <div
                className={styles.barFill}
                style={{
                  width: `${getTierPercentage(tier)}%`,
                  backgroundColor: tier.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
