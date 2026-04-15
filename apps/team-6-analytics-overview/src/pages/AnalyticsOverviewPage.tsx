import { Card } from '@voyado-kth/ui';
import styles from './AnalyticsOverviewPage.module.css';

const kpiPlaceholders = [
  {
    title: 'Revenue',
    summary: 'Executive summary KPI with trend context and period comparison.',
  },
  {
    title: 'Active Customers',
    summary: 'Top-row customer activity snapshot for fast weekly review.',
  },
  {
    title: 'Average Order Value',
    summary: 'Commercial efficiency metric reserved for the final KPI card.',
  },
  {
    title: 'Retention Rate',
    summary: 'Loyalty health indicator framed for leadership reporting.',
  },
] as const;

const sections = [
  {
    title: 'Revenue Trend',
    eyebrow: 'North star',
    description: 'A dedicated chart zone with room for a 12-month visual story and a highlighted peak month.',
  },
  {
    title: 'Campaign Performance',
    eyebrow: 'Comparison view',
    description: 'A table-ready area for high-signal campaign metrics, labels, and inline comparisons.',
  },
  {
    title: 'Channel Breakdown',
    eyebrow: 'Nice to have',
    description: 'Reserved space for a compact revenue mix view once the MVP foundation is in place.',
  },
] as const;

export function AnalyticsOverviewPage() {
  return (
    <main className={styles.page} aria-label="Analytics overview dashboard scaffold">
      <section className={styles.hero} aria-labelledby="analytics-scaffold-heading">
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Executive Dashboard</p>
          <h2 id="analytics-scaffold-heading" className={styles.heroTitle}>
            A revenue-first workspace for fast leadership reviews.
          </h2>
          <p className={styles.heroDescription}>
            This first story establishes the composition, visual rhythm, and section structure for the
            analytics experience. The next stories will replace these placeholders with live KPI cards,
            controls, and data views.
          </p>
        </div>

        <div className={styles.heroMeta} aria-label="Dashboard layout notes">
          <div className={styles.metaBlock}>
            <span className={styles.metaLabel}>View</span>
            <strong className={styles.metaValue}>Desktop-first executive briefing</strong>
          </div>
          <div className={styles.metaBlock}>
            <span className={styles.metaLabel}>Focus</span>
            <strong className={styles.metaValue}>Revenue, campaign signals, and presentation clarity</strong>
          </div>
        </div>
      </section>

      <section className={styles.kpiSection} aria-labelledby="kpi-row-heading">
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>Top row</p>
          <h3 id="kpi-row-heading" className={styles.sectionTitle}>
            KPI summary row scaffold
          </h3>
        </div>

        <div className={styles.kpiGrid}>
          {kpiPlaceholders.map(item => (
            <Card key={item.title} className={styles.kpiCard}>
              <div className={styles.placeholderBadge}>Reserved KPI</div>
              <h4 className={styles.cardTitle}>{item.title}</h4>
              <p className={styles.cardDescription}>{item.summary}</p>
              <div className={styles.valueSkeleton} aria-hidden="true" />
            </Card>
          ))}
        </div>
      </section>

      <section className={styles.contentSection} aria-labelledby="content-grid-heading">
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>Main content</p>
          <h3 id="content-grid-heading" className={styles.sectionTitle}>
            Content zones prepared for the next implementation stories
          </h3>
        </div>

        <div className={styles.contentGrid}>
          {sections.map(section => (
            <Card key={section.title} className={styles.contentCard}>
              <p className={styles.cardEyebrow}>{section.eyebrow}</p>
              <h4 className={styles.cardTitle}>{section.title}</h4>
              <p className={styles.cardDescription}>{section.description}</p>
              <div className={styles.panelSkeleton} aria-hidden="true">
                <span className={styles.panelBar} />
                <span className={styles.panelBar} />
                <span className={styles.panelBar} />
              </div>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
