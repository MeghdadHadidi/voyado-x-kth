import { Card } from '@voyado-kth/ui';
import styles from './AnalyticsOverviewPage.module.css';

const ranges = ['7D', '30D', '90D', '12M'] as const;

const kpiPlaceholders = [
  {
    title: 'Revenue',
    value: '2.45M',
    unit: 'SEK',
    delta: '+12.4%',
    summary: 'Direct-to-consumer is carrying the month with strong full-price mix.',
  },
  {
    title: 'Active Customers',
    value: '24,650',
    unit: 'buyers',
    delta: '+6.7%',
    summary: 'Reactivated cohorts are landing above plan and lifting purchasing frequency.',
  },
  {
    title: 'Avg Order Value',
    value: '890',
    unit: 'SEK',
    delta: '-3.3%',
    summary: 'Basket size softened slightly, but volume is compensating for the pressure.',
  },
  {
    title: 'Retention Rate',
    value: '78.5',
    unit: '%',
    delta: '+3.0%',
    summary: 'Tier II loyalty members remain the strongest retention driver in the mix.',
  },
] as const;

const sections = [
  {
    title: 'Revenue Trend',
    eyebrow: 'North star',
    description: 'A 12-month revenue arc with seasonal lift points and a highlighted holiday peak.',
  },
  {
    title: 'Campaign Performance',
    eyebrow: 'Comparison view',
    description: 'Ranked campaign rows with conversion, ROAS pressure, and channel labels.',
  },
  {
    title: 'Channel Breakdown',
    eyebrow: 'Nice to have',
    description: 'A compact mix view for Web, App, and In-store contribution once the MVP is in place.',
  },
] as const;

const heroMetrics = [
  {
    label: 'Revenue this window',
    value: '2.45M SEK',
    note: '+12.4% versus prior period',
  },
  {
    label: 'Top campaign',
    value: 'Weekend Flash Deal',
    note: '9.1% conversion and strongest weekly momentum',
  },
  {
    label: 'Rolling retention',
    value: '78.5%',
    note: 'Loyalty Tier II remains the clearest structural lever',
  },
  {
    label: 'Active customers',
    value: '24,650',
    note: '6.7% uplift in purchasing users',
  },
] as const;

const campaignPreview = [
  { name: 'Weekend Flash Deal', channel: 'SMS', metric: '9.1% conversion' },
  { name: 'Loyalty Tier Upgrade', channel: 'Email', metric: '7.2% conversion' },
  { name: 'VIP Exclusive Preview', channel: 'Push', metric: '4.5% conversion' },
] as const;

export function AnalyticsOverviewPage() {
  return (
    <main className={styles.page} aria-label="Analytics overview dashboard scaffold">
      <section className={styles.header} aria-labelledby="analytics-scaffold-heading">
        <div className={styles.headerCopy}>
          <p className={styles.kicker}>Commerce intelligence</p>
          <h2 id="analytics-scaffold-heading" className={styles.heroTitle}>
            A clearer view
            <br />
            <span className={styles.heroAccent}>of the business.</span>
          </h2>
          <p className={styles.heroDescription}>
            Revenue, customers, and campaign signals arranged like an executive briefing. This page now
            follows the reference design direction, while staying inside your workshop stack and design
            system constraints.
          </p>
        </div>

        <div className={styles.rangeToggle} role="tablist" aria-label="Time range">
          {ranges.map(range => (
            <button
              key={range}
              type="button"
              role="tab"
              aria-selected={range === '12M'}
              className={range === '12M' ? styles.rangeActive : styles.rangeButton}
            >
              {range}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.kpiGrid} aria-labelledby="kpi-row-heading">
        <h3 id="kpi-row-heading" className={styles.srOnly}>
          KPI summary row
        </h3>
        {kpiPlaceholders.map(item => (
          <Card key={item.title} className={styles.kpiCard}>
            <div className={styles.kpiTopRow}>
              <span className={styles.kpiLabel}>{item.title}</span>
              <span className={item.delta.startsWith('+') ? styles.deltaPositive : styles.deltaNegative}>
                {item.delta}
              </span>
            </div>
            <div className={styles.kpiValueRow}>
              <strong className={styles.kpiValue}>{item.value}</strong>
              <span className={styles.kpiUnit}>{item.unit}</span>
            </div>
            <p className={styles.cardDescription}>{item.summary}</p>
          </Card>
        ))}
      </section>

      <section className={styles.heroPanel} aria-labelledby="hero-panel-heading">
        <div className={styles.heroPanelMain}>
          <p className={styles.panelKicker}>Revenue intelligence</p>
          <h3 id="hero-panel-heading" className={styles.panelTitle}>
            Direct-to-consumer continues to outperform forecast while loyalty-led retention keeps the
            floor strong.
          </h3>
          <p className={styles.panelBody}>
            The visual hierarchy now mirrors the reference: headline first, numbers second, and detail
            sections ready underneath. Later stories can swap these placeholders for the real trend chart
            and campaign tables.
          </p>
        </div>

        <div className={styles.heroMeta} aria-label="Key business metrics">
          {heroMetrics.map(metric => (
            <div key={metric.label} className={styles.metaBlock}>
              <span className={styles.metaLabel}>{metric.label}</span>
              <strong className={styles.metaNumber}>{metric.value}</strong>
              <span className={styles.metaNote}>{metric.note}</span>
            </div>
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
          <Card className={styles.contentCard}>
            <p className={styles.cardEyebrow}>{sections[0].eyebrow}</p>
            <h4 className={styles.cardTitle}>{sections[0].title}</h4>
            <p className={styles.cardDescription}>{sections[0].description}</p>
            <div className={styles.chartSkeleton} aria-hidden="true">
              <span className={styles.chartBarTall} />
              <span className={styles.chartBarShort} />
              <span className={styles.chartBarMid} />
              <span className={styles.chartBarPeak} />
              <span className={styles.chartBarMid} />
              <span className={styles.chartBarShort} />
            </div>
          </Card>

          <Card className={styles.contentCard}>
            <p className={styles.cardEyebrow}>{sections[1].eyebrow}</p>
            <h4 className={styles.cardTitle}>{sections[1].title}</h4>
            <p className={styles.cardDescription}>{sections[1].description}</p>
            <div className={styles.campaignList}>
              {campaignPreview.map(campaign => (
                <div key={campaign.name} className={styles.campaignRow}>
                  <div>
                    <p className={styles.campaignName}>{campaign.name}</p>
                    <p className={styles.campaignChannel}>{campaign.channel}</p>
                  </div>
                  <span className={styles.campaignMetric}>{campaign.metric}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className={styles.contentCardWide}>
            <p className={styles.cardEyebrow}>{sections[2].eyebrow}</p>
            <h4 className={styles.cardTitle}>{sections[2].title}</h4>
            <p className={styles.cardDescription}>{sections[2].description}</p>
            <div className={styles.mixBar} aria-hidden="true">
              <span className={styles.mixWeb} />
              <span className={styles.mixApp} />
              <span className={styles.mixStore} />
            </div>
            <div className={styles.mixLegend}>
              <span className={styles.legendItem}>Web 60%</span>
              <span className={styles.legendItem}>App 25%</span>
              <span className={styles.legendItem}>In-store 15%</span>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
