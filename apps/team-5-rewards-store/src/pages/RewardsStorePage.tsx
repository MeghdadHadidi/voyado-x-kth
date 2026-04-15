import { useState } from 'react';
import type { Customer, Redemption, Reward, RewardCategory } from '@voyado-kth/shared';
import memberData from '../../data/member.json';
import rewardsData from '../../data/rewards.json';
import redemptionsData from '../../data/redemptions.json';
import styles from './RewardsStorePage.module.css';

type StoreTabId = 'store' | 'history';
type CategoryTabId = 'all' | RewardCategory;

export function RewardsStorePage() {
  const [member] = useState<Customer>(memberData as Customer);
  const [rewardCatalog] = useState<Reward[]>(rewardsData as Reward[]);
  const [redemptionHistory] = useState<Redemption[]>(redemptionsData as Redemption[]);
  const [activeStoreTab] = useState<StoreTabId>('store');
  const [activeCategoryTab] = useState<CategoryTabId>('all');
  const [selectedReward] = useState<Reward | null>(null);
  const [isRewardDialogOpen] = useState(false);
  const [isRedemptionDialogOpen] = useState(false);
  const [sessionRedemptions] = useState<Redemption[]>([]);

  const availableRewards = rewardCatalog.filter(
    reward => reward.available && reward.stock !== 0,
  ).length;
  const categoryCount = {
    all: rewardCatalog.length,
    discount: rewardCatalog.filter(reward => reward.category === 'discount').length,
    product: rewardCatalog.filter(reward => reward.category === 'product').length,
    experience: rewardCatalog.filter(reward => reward.category === 'experience').length,
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="rewards-store-title">
        <div className={styles.heroBackdrop} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Voyado Rewards Store</p>
            <h1 id="rewards-store-title" className={styles.title}>
              A curated space for loyalty redemptions
            </h1>
            <p className={styles.lead}>
              The page scaffold is now backed by typed member, rewards, and
              redemption data so the next stories can focus on UI behavior instead
              of page plumbing.
            </p>
          </div>

          <div className={styles.heroPanel}>
            <span className={styles.panelLabel}>Current member</span>
            <p className={styles.panelValue}>
              {member.firstName} {member.lastName}
            </p>
            <p className={styles.panelMeta}>
              Tier {member.tier} with {member.pointsBalance.toLocaleString('en-US')} pts
              loaded into local state.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.layout} aria-label="Rewards store scaffold">
        <section className={styles.balanceRegion} aria-labelledby="balance-region-title">
          <div className={styles.regionHeader}>
            <span className={styles.regionKicker}>Region 01</span>
            <h2 id="balance-region-title" className={styles.regionTitle}>
              Points header state preview
            </h2>
          </div>
          <dl className={styles.definitionList}>
            <div className={styles.definitionRow}>
              <dt className={styles.definitionLabel}>Member</dt>
              <dd className={styles.definitionValue}>{member.firstName}</dd>
            </div>
            <div className={styles.definitionRow}>
              <dt className={styles.definitionLabel}>Tier</dt>
              <dd className={styles.definitionValue}>{member.tier}</dd>
            </div>
            <div className={styles.definitionRow}>
              <dt className={styles.definitionLabel}>Balance state</dt>
              <dd className={styles.definitionValue}>
                {member.pointsBalance.toLocaleString('en-US')} pts
              </dd>
            </div>
          </dl>
        </section>

        <section className={styles.storeRegion} aria-labelledby="store-region-title">
          <div className={styles.regionHeader}>
            <span className={styles.regionKicker}>Region 02</span>
            <h2 id="store-region-title" className={styles.regionTitle}>
              Store navigation and messages
            </h2>
          </div>

          <div className={styles.stack}>
            <div className={styles.placeholderCard}>
              <span className={styles.placeholderLabel}>Store tab state</span>
              <p className={styles.placeholderText}>
                Active top-level view is initialized as <strong>{activeStoreTab}</strong>.
              </p>
            </div>

            <div className={styles.placeholderCard}>
              <span className={styles.placeholderLabel}>Category tab state</span>
              <p className={styles.placeholderText}>
                Default category is <strong>{activeCategoryTab}</strong> with counts
                prepared for all reward groups.
              </p>
              <ul className={styles.inlineList}>
                <li>All: {categoryCount.all}</li>
                <li>Discounts: {categoryCount.discount}</li>
                <li>Products: {categoryCount.product}</li>
                <li>Experiences: {categoryCount.experience}</li>
              </ul>
            </div>

            <div className={styles.placeholderCard}>
              <span className={styles.placeholderLabel}>Dialog state</span>
              <p className={styles.placeholderText}>
                Reward detail open: <strong>{String(isRewardDialogOpen)}</strong> and
                redemption confirm open: <strong>{String(isRedemptionDialogOpen)}</strong>.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.catalogRegion} aria-labelledby="catalog-region-title">
          <div className={styles.regionHeader}>
            <span className={styles.regionKicker}>Region 03</span>
            <h2 id="catalog-region-title" className={styles.regionTitle}>
              Reward catalog state preview
            </h2>
          </div>

          <div className={styles.catalogGrid}>
            {rewardCatalog.slice(0, 3).map(reward => (
              <article key={reward.id} className={styles.catalogCard}>
                <span className={styles.catalogMeta}>{reward.category}</span>
                <strong className={styles.catalogName}>{reward.name}</strong>
                <span className={styles.catalogMeta}>
                  {reward.pointsCost.toLocaleString('en-US')} pts
                </span>
              </article>
            ))}
          </div>

          <dl className={styles.definitionList}>
            <div className={styles.definitionRow}>
              <dt className={styles.definitionLabel}>Rewards in state</dt>
              <dd className={styles.definitionValue}>{rewardCatalog.length}</dd>
            </div>
            <div className={styles.definitionRow}>
              <dt className={styles.definitionLabel}>Available now</dt>
              <dd className={styles.definitionValue}>{availableRewards}</dd>
            </div>
            <div className={styles.definitionRow}>
              <dt className={styles.definitionLabel}>Selected reward</dt>
              <dd className={styles.definitionValue}>
                {selectedReward ? selectedReward.name : 'None yet'}
              </dd>
            </div>
            <div className={styles.definitionRow}>
              <dt className={styles.definitionLabel}>Loaded redemptions</dt>
              <dd className={styles.definitionValue}>{redemptionHistory.length}</dd>
            </div>
            <div className={styles.definitionRow}>
              <dt className={styles.definitionLabel}>Session redemptions</dt>
              <dd className={styles.definitionValue}>{sessionRedemptions.length}</dd>
            </div>
          </dl>
        </section>
      </section>
    </main>
  );
}
