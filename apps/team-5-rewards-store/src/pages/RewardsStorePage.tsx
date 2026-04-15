import styles from './RewardsStorePage.module.css';

export function RewardsStorePage() {
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
              The page scaffold is in place with dedicated regions for the balance
              header, store tabs, alerts, and reward discovery.
            </p>
          </div>

          <div className={styles.heroPanel}>
            <span className={styles.panelLabel}>Scaffold status</span>
            <p className={styles.panelValue}>Ready for story-by-story buildout</p>
            <p className={styles.panelMeta}>
              Next stories can connect data, tabs, cards, and redemption flows
              without restructuring the page shell.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.layout} aria-label="Rewards store scaffold">
        <section className={styles.balanceRegion} aria-labelledby="balance-region-title">
          <div className={styles.regionHeader}>
            <span className={styles.regionKicker}>Region 01</span>
            <h2 id="balance-region-title" className={styles.regionTitle}>
              Points header placeholder
            </h2>
          </div>
          <p className={styles.regionBody}>
            This area is reserved for the member greeting, tier badge, and live
            points balance hero.
          </p>
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
              <span className={styles.placeholderLabel}>Tabs</span>
              <p className={styles.placeholderText}>
                Top-level store and history tabs will live here in later stories.
              </p>
            </div>

            <div className={styles.placeholderCard}>
              <span className={styles.placeholderLabel}>Alerts</span>
              <p className={styles.placeholderText}>
                Success, empty, and status messaging will be placed in this strip.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.catalogRegion} aria-labelledby="catalog-region-title">
          <div className={styles.regionHeader}>
            <span className={styles.regionKicker}>Region 03</span>
            <h2 id="catalog-region-title" className={styles.regionTitle}>
              Reward catalog canvas
            </h2>
          </div>

          <div className={styles.catalogGrid} aria-hidden="true">
            <div className={styles.catalogCard} />
            <div className={styles.catalogCard} />
            <div className={styles.catalogCardWide} />
          </div>

          <p className={styles.regionBody}>
            The catalog grid, filters, and dialogs can now be added on top of this
            stable page scaffold.
          </p>
        </section>
      </section>
    </main>
  );
}
