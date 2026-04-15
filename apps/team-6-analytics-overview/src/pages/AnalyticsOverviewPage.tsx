import { Fragment, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Assistant } from '../components/Assistant';
import {
  RANGES,
  fmtInt,
  fmtUsd,
  getData,
  type Campaign,
  type Kpi,
  type RangeKey,
  type SparkPoint,
  type ThemeKey,
} from '../data/mock';
import styles from './AnalyticsOverviewPage.module.css';

const THEMES: Record<ThemeKey, { base: string; soft: string; deep: string; tint: string }> = {
  forest: { base: '#1b3a32', soft: '#2e5d52', deep: '#0f2722', tint: '#eaf1ee' },
  coral: { base: '#ea6a4e', soft: '#f19077', deep: '#c14a30', tint: '#fdece6' },
  amber: { base: '#c98a1f', soft: '#e3a844', deep: '#8a5c0f', tint: '#fbf0d9' },
  plum: { base: '#6b3f7a', soft: '#8d5ea0', deep: '#4a2957', tint: '#f1e8f4' },
};

function Icon({ name }: { name: Kpi['icon'] }) {
  switch (name) {
    case 'bolt':
      return <svg viewBox="0 0 24 24" className={styles.kpiIcon} aria-hidden><path d="M13 3 L4 14 H11 L10 21 L20 10 H13 Z" /></svg>;
    case 'users':
      return <svg viewBox="0 0 24 24" className={styles.kpiIcon} aria-hidden><circle cx="9" cy="8" r="3.2" /><path d="M3 20c.8-3.4 3.2-5 6-5s5.2 1.6 6 5" /><circle cx="17" cy="9" r="2.6" /><path d="M15.5 14.2c2.3.2 4.1 1.5 4.7 4.3" /></svg>;
    case 'basket':
      return <svg viewBox="0 0 24 24" className={styles.kpiIcon} aria-hidden><path d="M3 8h18l-2 12H5L3 8Z" /><path d="M8 8l2-4M16 8l-2-4" /><path d="M9 12v4M15 12v4" /></svg>;
    case 'heart':
      return <svg viewBox="0 0 24 24" className={styles.kpiIcon} aria-hidden><path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10Z" /></svg>;
  }
}

function Arrow({ up }: { up: boolean }) {
  return up ? (
    <svg viewBox="0 0 10 10" className={styles.arrow} aria-hidden><path d="M5 1.5 L8.5 6 L6 6 L6 8.5 L4 8.5 L4 6 L1.5 6 Z" fill="currentColor" /></svg>
  ) : (
    <svg viewBox="0 0 10 10" className={styles.arrow} aria-hidden><path d="M5 8.5 L1.5 4 L4 4 L4 1.5 L6 1.5 L6 4 L8.5 4 Z" fill="currentColor" /></svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 12 12" className={open ? styles.chevronOpen : styles.chevron} aria-hidden>
      <path d="M2.5 4.5 L6 8 L9.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Delta({ value }: { value: number }) {
  const up = value >= 0;
  return (
    <span className={up ? styles.deltaPositive : styles.deltaNegative}>
      <Arrow up={up} />
      {up ? '+' : ''}
      {value.toFixed(1)}%
    </span>
  );
}

function KpiCard({ kpi, index, open, onToggle }: { kpi: Kpi; index: number; open: boolean; onToggle: () => void }) {
  const theme = THEMES[kpi.theme];
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className={open ? styles.kpiCardOpen : styles.kpiCard}
      style={{ animationDelay: `${index * 60}ms`, ['--card-accent' as string]: theme.base, ['--card-tint' as string]: theme.tint }}
    >
      <span className={styles.kpiAccent} />
      <div className={styles.kpiHeader}>
        <div className={styles.kpiHeading}>
          <span className={styles.kpiIconWrap}><Icon name={kpi.icon} /></span>
          <span className={styles.kpiLabel}>{kpi.label}</span>
        </div>
        <Delta value={kpi.delta} />
      </div>
      <div className={styles.kpiValue}>{kpi.value}</div>
      <div className={styles.kpiFooter}>
        <span>{kpi.sub}</span>
        <span className={styles.kpiChevronWrap}><Chevron open={open} /></span>
      </div>
    </button>
  );
}

function RangeToggle({ value, onChange }: { value: RangeKey; onChange: (value: RangeKey) => void }) {
  return (
    <div role="tablist" aria-label="Time range" className={styles.rangeToggle}>
      {RANGES.map(range => {
        const active = range.key === value;
        return (
          <button
            key={range.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(range.key)}
            className={active ? styles.rangeActive : styles.rangeButton}
          >
            {range.label}
          </button>
        );
      })}
    </div>
  );
}

function TrendChart({ data, color, unit }: { data: SparkPoint[]; color: string; unit: 'usd' | 'int' | 'pct' }) {
  const pts = data.map(point => ({ label: point.label, v: point.value }));
  const gradientId = `spark-${color.replace('#', '')}`;
  const formatter = (value: number) => {
    if (unit === 'usd') return fmtUsd(value * 1000);
    if (unit === 'pct') return `${value.toFixed(0)}%`;
    return fmtInt(Math.round(value * 100));
  };

  return (
    <div className={styles.trendChart}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={pts} margin={{ top: 12, right: 8, bottom: 0, left: 8 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.32} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(14,20,19,0.06)" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} dy={6} interval={0} minTickGap={0} />
          <YAxis tickLine={false} axisLine={false} width={48} tickFormatter={(value: number) => formatter(value)} />
          <Tooltip
            cursor={{ stroke: color, strokeOpacity: 0.25, strokeWidth: 1 }}
            content={({ active, payload, label }: any) => {
              if (!active || !payload?.length) return null;
              return (
                <div className={styles.tooltip}>
                  <div className={styles.tooltipLabel}>{label}</div>
                  <div className={styles.tooltipValue}>{formatter(payload[0].value as number)}</div>
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2.2}
            fill={`url(#${gradientId})`}
            dot={{ r: 0 }}
            activeDot={{ r: 4, fill: color, stroke: '#ffffff', strokeWidth: 2 }}
            isAnimationActive
            animationDuration={650}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function DetailPanel({ kpi }: { kpi: Kpi }) {
  const theme = THEMES[kpi.theme];
  return (
    <section className={styles.detailPanel}>
      <div className={styles.detailHero} style={{ ['--detail-start' as string]: theme.base, ['--detail-end' as string]: theme.deep }}>
        <div className={styles.detailContent}>
          <div className={styles.detailPill}><Icon name={kpi.icon} /> {kpi.label}</div>
          <h3 className={styles.detailTitle}>{kpi.headline}</h3>
          <p className={styles.detailInsight}>{kpi.insight}</p>
        </div>
        <div className={styles.detailSummary}>
          <span className={styles.detailCurrentLabel}>Current</span>
          <strong className={styles.detailValue}>{kpi.value}</strong>
          <Delta value={kpi.delta} />
        </div>
      </div>

      <div className={styles.detailGrid}>
        <div className={styles.detailTrend}>
          <div className={styles.subsectionHeader}>
            <span>Trend</span>
            <span>by {kpi.trendAxisTitle} · {kpi.spark.length} points</span>
          </div>
          <TrendChart data={kpi.spark} color={theme.base} unit={kpi.id === 'retention' ? 'pct' : kpi.id === 'customers' ? 'int' : 'usd'} />
        </div>

        <div className={styles.detailBreakdown}>
          <div className={styles.subsectionHeader}>
            <span>Breakdown</span>
          </div>
          <ul className={styles.breakdownList}>
            {kpi.breakdown.map((item, index) => (
              <li key={item.label}>
                <div className={styles.breakdownRow}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
                <div className={styles.shareTrack}>
                  <div className={styles.shareFill} style={{ width: `${item.share}%`, backgroundColor: theme.base, animationDelay: `${index * 80}ms` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipLabel}>{label}</div>
      <div className={styles.tooltipValue}>{fmtUsd(payload[0].value as number)}</div>
    </div>
  );
}

function statusClass(status: Campaign['detail']['status']) {
  switch (status) {
    case 'Live':
      return styles.statusLive;
    case 'Scheduled':
      return styles.statusScheduled;
    case 'Wrapping':
      return styles.statusWrapping;
    case 'Paused':
      return styles.statusPaused;
  }
}

function CampaignDetailRow({ campaign }: { campaign: Campaign }) {
  const detail = campaign.detail;
  return (
    <tr>
      <td colSpan={5} className={styles.campaignDetailCell}>
        <div className={styles.campaignDetailWrap}>
          <div className={styles.campaignDetailCard}>
            <div className={styles.campaignDetailHeader}>
              <div className={styles.campaignDetailIntro}>
                <div className={styles.detailMetaRow}>
                  <span className={`${styles.statusPill} ${statusClass(detail.status)}`}>{detail.status}</span>
                  <span>Owner · {detail.owner}</span>
                  <span>·</span>
                  <span>{campaign.channel}</span>
                </div>
                <h3 className={styles.campaignDetailTitle}>{campaign.name}</h3>
                <p className={styles.campaignDetailSummary}>{detail.summary}</p>
              </div>
              <div className={styles.campaignStatGrid}>
                <div><span>Revenue</span><strong>{fmtUsd(campaign.revenue)}</strong></div>
                <div><span>Conversions</span><strong>{fmtInt(campaign.conversions)}</strong></div>
              </div>
            </div>

            <div className={styles.campaignDetailGrid}>
              <div>
                <div className={styles.subsectionHeader}><span>Performance</span></div>
                <dl className={styles.metricTiles}>
                  <div className={styles.metricTile}><dt>ROAS</dt><dd>{detail.roas.toFixed(1)}x</dd></div>
                  <div className={styles.metricTile}><dt>CTR</dt><dd>{detail.ctr.toFixed(1)}%</dd></div>
                  <div className={styles.metricTile}><dt>Spend</dt><dd>{fmtUsd(detail.spend)}</dd></div>
                  <div className={styles.metricTile}><dt>Cost / conv.</dt><dd>${detail.costPerConv.toFixed(2)}</dd></div>
                  <div className={`${styles.metricTile} ${styles.metricTileWide}`}><dt>Impressions</dt><dd>{fmtInt(detail.impressions)}</dd></div>
                </dl>

                <div className={styles.subsectionHeader}><span>Audience</span></div>
                <ul className={styles.breakdownList}>
                  {detail.audience.map((item, index) => (
                    <li key={item.label}>
                      <div className={styles.breakdownRow}>
                        <span>{item.label}</span>
                        <strong>{item.share}%</strong>
                      </div>
                      <div className={styles.shareTrack}>
                        <div className={styles.shareFill} style={{ width: `${item.share}%`, animationDelay: `${index * 80}ms` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className={styles.subsectionHeader}>
                  <span>Revenue contribution</span>
                  <span>{detail.spark.length} points</span>
                </div>
                <TrendChart data={detail.spark} color="#ea6a4e" unit="usd" />
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

export function AnalyticsOverviewPage() {
  const [range, setRange] = useState<RangeKey>('12m');
  const [openId, setOpenId] = useState<Kpi['id'] | null>('revenue');
  const [openCampaign, setOpenCampaign] = useState<string | null>(null);
  const data = useMemo(() => getData(range), [range]);
  const topRoasIdx = data.campaigns.reduce((best, campaign, index, collection) => (campaign.detail.roas > collection[best].detail.roas ? index : best), 0);
  const seriesTotal = data.series.reduce((acc, point) => acc + point.revenue, 0);
  const openKpi = data.kpis.find(kpi => kpi.id === openId) ?? null;
  const maxRevenue = Math.max(...data.campaigns.map(campaign => campaign.revenue));

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <div className={styles.headerPill}>
              <span className={styles.headerDot} />
              Commerce intelligence
            </div>
            <h1 className={styles.title}>
              A clearer view
              <br />
              <span>of the business.</span>
            </h1>
            <p className={styles.subtitle}>Revenue, customers, and campaigns. Tap any metric to dig deeper.</p>
          </div>
          <RangeToggle value={range} onChange={setRange} />
        </header>

        <section key={`kpi-${range}`} className={styles.kpiGrid}>
          {data.kpis.map((kpi, index) => (
            <KpiCard key={kpi.id} kpi={kpi} index={index} open={openId === kpi.id} onToggle={() => setOpenId(current => current === kpi.id ? null : kpi.id)} />
          ))}
        </section>

        {openKpi && <DetailPanel key={`${openKpi.id}-${range}`} kpi={openKpi} />}

        <section key={`chart-${range}`} className={styles.sectionCard}>
          <div className={styles.sectionHead}>
            <div>
              <h2>Revenue</h2>
              <p>
                {data.seriesGranularity === 'day' ? 'Daily' : data.seriesGranularity === 'week' ? 'Weekly' : 'Monthly'} gross revenue, {data.seriesWindowLabel}.
              </p>
            </div>
            <div className={styles.sectionTotal}>
              <span>Total</span>
              <strong>{fmtUsd(seriesTotal)}</strong>
            </div>
          </div>

          <div className={styles.revenueChart}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.series} margin={{ top: 10, right: 8, bottom: 0, left: 8 }}>
                <defs>
                  <linearGradient id="brandBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2e5d52" />
                    <stop offset="100%" stopColor="#1b3a32" />
                  </linearGradient>
                  <linearGradient id="coralBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f19077" />
                    <stop offset="100%" stopColor="#ea6a4e" />
                  </linearGradient>
                  <linearGradient id="mutedBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e1ded6" />
                    <stop offset="100%" stopColor="#d1ccc2" />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(14,20,19,0.06)" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} dy={8} interval={data.series.length > 14 ? Math.ceil(data.series.length / 10) - 1 : 0} minTickGap={8} />
                <YAxis tickLine={false} axisLine={false} width={56} tickFormatter={(value: number) => fmtUsd(value)} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(27,58,50,0.05)' }} />
                <Bar dataKey="revenue" radius={[10, 10, 2, 2]}>
                  {data.series.map((point, index) => {
                    const max = Math.max(...data.series.map(item => item.revenue));
                    const isMax = point.revenue === max;
                    const hot = point.revenue >= max * 0.78;
                    return <Cell key={index} fill={isMax ? 'url(#coralBar)' : hot ? 'url(#brandBar)' : 'url(#mutedBar)'} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section key={`table-${range}`} className={styles.tableSection}>
          <div className={styles.sectionHead}>
            <div>
              <h2>Campaign performance</h2>
              <p>Ranked by revenue. Bars are indexed to the top performer.</p>
            </div>
            <span className={styles.tableCount}>{data.campaigns.length} campaigns</span>
          </div>

          <div className={styles.tableScroller}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Revenue</th>
                  <th>Conversions</th>
                  <th>Performance</th>
                  <th aria-hidden />
                </tr>
              </thead>
              <tbody>
                {data.campaigns.map((campaign, index) => {
                  const pct = Math.max(4, Math.round((campaign.revenue / maxRevenue) * 100));
                  const isOpen = openCampaign === campaign.name;
                  const isTopRevenue = index === 0;
                  const isTopRoas = index === topRoasIdx;
                  return (
                    <Fragment key={campaign.name}>
                      <tr
                        tabIndex={0}
                        aria-expanded={isOpen}
                        className={isOpen ? styles.tableRowOpen : styles.tableRow}
                        onClick={() => setOpenCampaign(current => current === campaign.name ? null : campaign.name)}
                        onKeyDown={event => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            setOpenCampaign(current => current === campaign.name ? null : campaign.name);
                          }
                        }}
                      >
                        <td>
                          <div className={styles.campaignCell}>
                            <div className={styles.campaignNameRow}>
                              <span className={styles.campaignName}>{campaign.name}</span>
                              {isTopRevenue && <span className={`${styles.tag} ${styles.tagCoral}`}>Top revenue</span>}
                              {isTopRoas && <span className={`${styles.tag} ${styles.tagAmber}`}>Best ROAS</span>}
                            </div>
                            <div className={styles.campaignChannel}>{campaign.channel}</div>
                          </div>
                        </td>
                        <td className={styles.alignRight}>{fmtUsd(campaign.revenue)}</td>
                        <td className={styles.alignRight}>{fmtInt(campaign.conversions)}</td>
                        <td>
                          <div className={styles.performanceCell}>
                            <div className={styles.performanceTrack}>
                              <div className={styles.performanceFill} style={{ width: `${pct}%`, backgroundColor: isTopRevenue ? '#ea6a4e' : '#1b3a32' }} />
                            </div>
                            <span className={styles.performanceLabel}>{pct}%</span>
                          </div>
                        </td>
                        <td><span className={styles.kpiChevronWrap}><Chevron open={isOpen} /></span></td>
                      </tr>
                      {isOpen && <CampaignDetailRow campaign={campaign} />}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <footer className={styles.footer}>
          <span>Commerce Intelligence · Updated just now</span>
          <span>© {new Date().getFullYear()}</span>
        </footer>
      </div>

      <Assistant
        ctx={{
          range,
          rangeLabel: data.coverage,
          revenueValue: data.kpis[0].value,
          revenueDelta: data.kpis[0].delta,
          topCampaignName: data.campaigns[0].name,
          topRoasName: data.campaigns[topRoasIdx].name,
          topRoasValue: data.campaigns[topRoasIdx].detail.roas,
          retentionValue: data.kpis[3].value,
          pausedCount: data.campaigns.filter(campaign => campaign.detail.status === 'Paused').length,
        }}
      />
    </main>
  );
}
