export type RangeKey = '7d' | '30d' | '90d' | '12m';

export const RANGES: { key: RangeKey; label: string; short: string }[] = [
  { key: '7d', label: '7 days', short: '7D' },
  { key: '30d', label: '30 days', short: '30D' },
  { key: '90d', label: '90 days', short: '90D' },
  { key: '12m', label: '12 months', short: '12M' },
];

export type ThemeKey = 'forest' | 'coral' | 'amber' | 'plum';

export type Breakdown = { label: string; value: string; share: number };
export type SparkPoint = { label: string; value: number };

export type Kpi = {
  id: 'revenue' | 'customers' | 'aov' | 'retention';
  label: string;
  value: string;
  raw: number;
  delta: number;
  sub: string;
  theme: ThemeKey;
  icon: 'bolt' | 'users' | 'basket' | 'heart';
  spark: SparkPoint[];
  trendAxisTitle: string;
  headline: string;
  breakdown: Breakdown[];
  insight: string;
};

export type SeriesPoint = { label: string; revenue: number };
export type AudienceSlice = { label: string; share: number };

export type CampaignDetail = {
  spend: number;
  impressions: number;
  ctr: number;
  roas: number;
  costPerConv: number;
  status: 'Live' | 'Scheduled' | 'Wrapping' | 'Paused';
  owner: string;
  summary: string;
  audience: AudienceSlice[];
  spark: SparkPoint[];
};

export type Campaign = {
  name: string;
  channel: string;
  revenue: number;
  conversions: number;
  performance: number;
  detail: CampaignDetail;
};

type Dataset = {
  kpis: Kpi[];
  series: SeriesPoint[];
  seriesGranularity: 'day' | 'week' | 'month';
  seriesWindowLabel: string;
  campaigns: Campaign[];
  coverage: string;
};

export const fmtUsd = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(2)}M`
    : n >= 1_000
      ? `$${(n / 1_000).toFixed(1)}K`
      : `$${n.toFixed(0)}`;

export const fmtInt = (n: number) => n.toLocaleString('en-US');

const BASE_CURVE = [412, 398, 441, 470, 502, 488, 531, 612, 598, 644, 701, 738];

function seriesLabels(range: RangeKey): { labels: string[]; granularity: 'day' | 'week' | 'month'; windowLabel: string } {
  switch (range) {
    case '7d':
      return { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], granularity: 'day', windowLabel: 'last 7 days' };
    case '30d':
      return { labels: Array.from({ length: 30 }, (_, i) => `D${i + 1}`), granularity: 'day', windowLabel: 'last 30 days' };
    case '90d':
      return { labels: Array.from({ length: 13 }, (_, i) => `Wk ${i + 1}`), granularity: 'week', windowLabel: 'last 90 days' };
    case '12m':
      return { labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'], granularity: 'month', windowLabel: 'last 12 months' };
  }
}

function buildSeriesForRange(range: RangeKey, totalRevenue: number): SeriesPoint[] {
  const { labels } = seriesLabels(range);
  const last = BASE_CURVE.length - 1;
  const shape: number[] = [];
  for (let i = 0; i < labels.length; i += 1) {
    const t = (i / Math.max(1, labels.length - 1)) * last;
    const lo = Math.floor(t);
    const hi = Math.min(last, lo + 1);
    const f = t - lo;
    const jitter = 1 + (((i * 37) % 17) - 8) / 140;
    shape.push((BASE_CURVE[lo] * (1 - f) + BASE_CURVE[hi] * f) * jitter);
  }
  const sum = shape.reduce((acc, value) => acc + value, 0);
  const factor = totalRevenue / sum;
  return labels.map((label, index) => ({ label, revenue: Math.round(shape[index] * factor) }));
}

type CampaignSeed = {
  name: string;
  channel: string;
  revenue: number;
  conversions: number;
  roas: number;
  ctr: number;
  impressions: number;
  status: CampaignDetail['status'];
  owner: string;
  summary: string;
  audience: AudienceSlice[];
};

const CAMPAIGN_POOL: CampaignSeed[] = [
  {
    name: 'Aurora — Winter Brief',
    channel: 'Email / Direct',
    revenue: 412_800,
    conversions: 3_214,
    roas: 6.8,
    ctr: 4.2,
    impressions: 1_850_000,
    status: 'Live',
    owner: 'M. Alvarez',
    summary: 'Flagship winter drop with segmented hero variants for loyalty tiers. Outperforming forecast on full-price mix.',
    audience: [
      { label: 'Loyalty T2+', share: 48 },
      { label: 'Returning', share: 32 },
      { label: 'Prospect', share: 20 },
    ],
  },
  {
    name: 'Meridian Loyalty Tier II',
    channel: 'CRM',
    revenue: 388_540,
    conversions: 2_871,
    roas: 9.1,
    ctr: 3.8,
    impressions: 1_210_000,
    status: 'Live',
    owner: 'S. Okonkwo',
    summary: 'Tier II enrolment drive. Highest ROAS in the portfolio and a structural retention lift candidate.',
    audience: [
      { label: 'Existing members', share: 64 },
      { label: 'Near-tier', share: 26 },
      { label: 'Lapsed', share: 10 },
    ],
  },
  {
    name: 'Field Note №07',
    channel: 'Content',
    revenue: 297_110,
    conversions: 2_104,
    roas: 4.1,
    ctr: 2.6,
    impressions: 2_400_000,
    status: 'Wrapping',
    owner: 'J. Park',
    summary: 'Editorial series pairing product with long-form reporting. Strong engagement, modest conversion.',
    audience: [
      { label: 'Organic search', share: 42 },
      { label: 'Newsletter', share: 36 },
      { label: 'Referral', share: 22 },
    ],
  },
  {
    name: 'Paper Trail — Retargeting',
    channel: 'Paid Social',
    revenue: 264_900,
    conversions: 1_986,
    roas: 3.3,
    ctr: 1.9,
    impressions: 5_800_000,
    status: 'Live',
    owner: 'R. Ibarra',
    summary: 'Dynamic retargeting against cart abandoners. Frequency capped at 6; CPM trending down week-over-week.',
    audience: [
      { label: 'Abandoned cart', share: 58 },
      { label: 'Browsed SKU', share: 28 },
      { label: 'Lookalike', share: 14 },
    ],
  },
  {
    name: 'Dossier Quarterly',
    channel: 'Newsletter',
    revenue: 221_460,
    conversions: 1_742,
    roas: 11.4,
    ctr: 5.6,
    impressions: 640_000,
    status: 'Scheduled',
    owner: 'M. Alvarez',
    summary: 'Quarterly executive newsletter. Small audience, premium intent, and efficiency leader of the window.',
    audience: [
      { label: 'Enterprise list', share: 71 },
      { label: 'Press', share: 18 },
      { label: 'Partners', share: 11 },
    ],
  },
  {
    name: 'Signal Boost 12/04',
    channel: 'Search',
    revenue: 188_220,
    conversions: 1_503,
    roas: 2.9,
    ctr: 3.1,
    impressions: 1_950_000,
    status: 'Live',
    owner: 'D. Huang',
    summary: 'Branded plus non-brand search. Non-brand CPC is up 12% and worth monitoring.',
    audience: [
      { label: 'Branded', share: 54 },
      { label: 'Category', share: 30 },
      { label: 'Competitor', share: 16 },
    ],
  },
  {
    name: 'Ground Truth — Referrals',
    channel: 'Partner',
    revenue: 152_300,
    conversions: 1_287,
    roas: 7.2,
    ctr: 2.2,
    impressions: 780_000,
    status: 'Live',
    owner: 'A. Reyes',
    summary: 'Co-marketing with strategic partners. High-intent traffic and solid downstream quality.',
    audience: [
      { label: 'Partner A', share: 58 },
      { label: 'Partner B', share: 27 },
      { label: 'Partner C', share: 15 },
    ],
  },
  {
    name: 'Low Frequency Pulse',
    channel: 'Display',
    revenue: 98_740,
    conversions: 914,
    roas: 1.8,
    ctr: 0.7,
    impressions: 9_200_000,
    status: 'Paused',
    owner: 'R. Ibarra',
    summary: 'Broad awareness play. Paused pending creative refresh because it fell below the ROAS floor.',
    audience: [
      { label: 'Prospect', share: 78 },
      { label: 'Lookalike', share: 16 },
      { label: 'Retarget', share: 6 },
    ],
  },
];

function buildCampaigns(range: RangeKey): Campaign[] {
  const mult = range === '7d' ? 0.07 : range === '30d' ? 0.28 : range === '90d' ? 0.72 : 1;
  const convMult = range === '7d' ? 0.08 : range === '30d' ? 0.3 : range === '90d' ? 0.75 : 1;
  const scaled = CAMPAIGN_POOL.map(campaign => ({
    ...campaign,
    revenue: Math.round(campaign.revenue * mult),
    conversions: Math.round(campaign.conversions * convMult),
    impressions: Math.round(campaign.impressions * mult),
  }));
  const top = Math.max(...scaled.map(campaign => campaign.revenue));
  const { labels: sparkLabels } = seriesLabels(range);

  const makeShape = (seed: number, length: number) =>
    Array.from({ length }, (_, index) => {
      const a = Math.sin((index + seed) * 0.7) * 0.35;
      const b = index / Math.max(1, length - 1);
      const c = (((index * seed) % 11) - 5) / 28;
      return 0.7 + b * 0.6 + a + c;
    });

  return scaled.map(campaign => {
    const spend = Math.round(campaign.revenue / campaign.roas);
    const costPerConv = +(spend / Math.max(1, campaign.conversions)).toFixed(2);
    const shape = makeShape(campaign.name.length, sparkLabels.length);
    const factor = campaign.revenue / shape.reduce((acc, value) => acc + value, 0);
    const spark = sparkLabels.map((label, index) => ({ label, value: shape[index] * factor }));

    return {
      name: campaign.name,
      channel: campaign.channel,
      revenue: campaign.revenue,
      conversions: campaign.conversions,
      performance: Math.round((campaign.revenue / top) * 100),
      detail: {
        spend,
        impressions: campaign.impressions,
        ctr: campaign.ctr,
        roas: campaign.roas,
        costPerConv,
        status: campaign.status,
        owner: campaign.owner,
        summary: campaign.summary,
        audience: campaign.audience,
        spark,
      },
    };
  });
}

const KPI_MATRIX: Record<RangeKey, { revenue: number; customers: number; aov: number; retention: number; d: [number, number, number, number] }> = {
  '7d': { revenue: 486_200, customers: 4_218, aov: 184.2, retention: 62.4, d: [4.1, 2.3, -1.2, 0.6] },
  '30d': { revenue: 1_942_800, customers: 16_504, aov: 197.4, retention: 64.1, d: [7.8, 5.1, 2.4, 1.2] },
  '90d': { revenue: 5_714_300, customers: 41_980, aov: 212.8, retention: 66.8, d: [12.3, 8.4, 4.1, 2.6] },
  '12m': { revenue: 22_480_000, customers: 148_220, aov: 228.6, retention: 69.2, d: [18.9, 14.2, 6.3, 3.9] },
};

function rangeLabels(range: RangeKey): string[] {
  switch (range) {
    case '7d':
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    case '30d':
      return ['D1', 'D4', 'D7', 'D10', 'D13', 'D16', 'D19', 'D22', 'D25', 'D28'];
    case '90d':
      return ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Wk 7', 'Wk 8', 'Wk 9', 'Wk 10', 'Wk 11', 'Wk 12'];
    case '12m':
      return ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
  }
}

function resample(base: number[], length: number): number[] {
  if (length === base.length) {
    return base.slice();
  }
  return Array.from({ length }, (_, index) => {
    const t = (index / (length - 1)) * (base.length - 1);
    const lo = Math.floor(t);
    const hi = Math.min(base.length - 1, lo + 1);
    const f = t - lo;
    return base[lo] * (1 - f) + base[hi] * f;
  });
}

function spark(range: RangeKey, base: number[], bias = 1): SparkPoint[] {
  const scale = range === '7d' ? 0.25 : range === '30d' ? 0.55 : range === '90d' ? 0.8 : 1;
  const labels = rangeLabels(range);
  const values = resample(base, labels.length);
  return labels.map((label, index) => ({
    label,
    value: values[index] * scale * bias * (1 + (((index * 13) % 11) - 5) / 120),
  }));
}

const TREND_AXIS_TITLE: Record<RangeKey, string> = {
  '7d': 'day',
  '30d': '3-day bucket',
  '90d': 'week',
  '12m': 'month',
};

const INSIGHTS: Record<RangeKey, { revenue: string; customers: string; aov: string; retention: string }> = {
  '7d': {
    revenue: 'A quiet seven-day window. Direct channels softened while retail held the line.',
    customers: 'Traffic skewed to returning members while acquisition paused between campaigns.',
    aov: 'Basket size dipped as promo inventory cleared. Full-price mix should rebound next push.',
    retention: 'Short window signal is noisy, but loyalty Tier II still anchors the base.',
  },
  '30d': {
    revenue: 'Month-over-month recovery led by the Meridian loyalty tier and email re-engagement.',
    customers: 'New-to-file improved on paid social while reactivation flows gained traction.',
    aov: 'Bundling is offsetting price pressure and keeping the basket stable.',
    retention: 'Cohorts are stabilizing as loyalty Tier II reaches steady-state enrolment.',
  },
  '90d': {
    revenue: 'Three-month trend remains positive with direct-to-consumer carrying the quarter.',
    customers: 'Reactivated cohorts are up materially and win-back flows are outperforming forecast.',
    aov: 'Full-price mix held despite seasonal promotion pressure.',
    retention: 'Loyalty Tier II is the single strongest retention lever this window.',
  },
  '12m': {
    revenue: 'Twelve months of direct and loyalty investment are compounding while wholesale lags plan.',
    customers: 'The active base is near an all-time high and retention is doing more work than acquisition.',
    aov: 'Annual basket value is up meaningfully through pricing architecture and bundling.',
    retention: 'Year-over-year retention stepped up and loyalty Tier II looks structural, not temporary.',
  },
};

const MIX_BY_RANGE: Record<RangeKey, { revenueChannels: [number, number, number, number]; customerCohorts: [number, number, number]; aovMix: [number, number, number]; retentionSegs: [number, number, number] }> = {
  '7d': { revenueChannels: [38, 30, 20, 12], customerCohorts: [62, 24, 14], aovMix: [58, 30, 12], retentionSegs: [78, 49, 30] },
  '30d': { revenueChannels: [40, 29, 19, 12], customerCohorts: [60, 26, 14], aovMix: [61, 28, 11], retentionSegs: [79, 50, 32] },
  '90d': { revenueChannels: [42, 28, 18, 12], customerCohorts: [58, 27, 15], aovMix: [64, 26, 10], retentionSegs: [81, 52, 35] },
  '12m': { revenueChannels: [45, 26, 17, 12], customerCohorts: [55, 29, 16], aovMix: [66, 25, 9], retentionSegs: [84, 55, 38] },
};

export function getData(range: RangeKey): Dataset {
  const metrics = KPI_MATRIX[range];
  const mix = MIX_BY_RANGE[range];
  const insight = INSIGHTS[range];
  const rangeLabel = RANGES.find(item => item.key === range)!.label;
  const segBase = mix.retentionSegs;
  const weights: [number, number, number] = [0.45, 0.35, 0.2];
  const weighted = segBase[0] * weights[0] + segBase[1] * weights[1] + segBase[2] * weights[2];
  const adjustment = metrics.retention - weighted;
  const retentionSegs: [number, number, number] = [
    segBase[0] + adjustment,
    segBase[1] + adjustment,
    segBase[2] + adjustment,
  ];

  const kpis: Kpi[] = [
    {
      id: 'revenue',
      label: 'Revenue',
      value: fmtUsd(metrics.revenue),
      raw: metrics.revenue,
      delta: metrics.d[0],
      sub: 'gross, net of refunds',
      theme: 'forest',
      icon: 'bolt',
      spark: spark(range, [40, 46, 44, 52, 58, 55, 63, 70, 68, 76, 82, 88]),
      trendAxisTitle: TREND_AXIS_TITLE[range],
      headline: 'Gross revenue across all channels',
      breakdown: [
        { label: 'Direct / Web', value: fmtUsd(metrics.revenue * mix.revenueChannels[0] / 100), share: mix.revenueChannels[0] },
        { label: 'Retail stores', value: fmtUsd(metrics.revenue * mix.revenueChannels[1] / 100), share: mix.revenueChannels[1] },
        { label: 'Marketplaces', value: fmtUsd(metrics.revenue * mix.revenueChannels[2] / 100), share: mix.revenueChannels[2] },
        { label: 'Wholesale', value: fmtUsd(metrics.revenue * mix.revenueChannels[3] / 100), share: mix.revenueChannels[3] },
      ],
      insight: insight.revenue,
    },
    {
      id: 'customers',
      label: 'Active Customers',
      value: fmtInt(metrics.customers),
      raw: metrics.customers,
      delta: metrics.d[1],
      sub: 'unique, deduplicated',
      theme: 'coral',
      icon: 'users',
      spark: spark(range, [30, 32, 35, 38, 42, 44, 48, 52, 55, 58, 62, 66]),
      trendAxisTitle: TREND_AXIS_TITLE[range],
      headline: 'Unique customers engaged in the period',
      breakdown: [
        { label: 'Returning', value: fmtInt(Math.round(metrics.customers * mix.customerCohorts[0] / 100)), share: mix.customerCohorts[0] },
        { label: 'New', value: fmtInt(Math.round(metrics.customers * mix.customerCohorts[1] / 100)), share: mix.customerCohorts[1] },
        { label: 'Reactivated', value: fmtInt(Math.round(metrics.customers * mix.customerCohorts[2] / 100)), share: mix.customerCohorts[2] },
      ],
      insight: insight.customers,
    },
    {
      id: 'aov',
      label: 'Average Order Value',
      value: fmtUsd(metrics.aov),
      raw: metrics.aov,
      delta: metrics.d[2],
      sub: 'mean basket, all channels',
      theme: 'amber',
      icon: 'basket',
      spark: spark(range, [60, 58, 62, 65, 63, 67, 70, 72, 71, 75, 78, 80]),
      trendAxisTitle: TREND_AXIS_TITLE[range],
      headline: 'Mean basket size across all orders',
      breakdown: [
        { label: 'Full price', value: fmtUsd(metrics.aov * 1.18), share: mix.aovMix[0] },
        { label: 'Promotional', value: fmtUsd(metrics.aov * 0.82), share: mix.aovMix[1] },
        { label: 'Clearance', value: fmtUsd(metrics.aov * 0.54), share: mix.aovMix[2] },
      ],
      insight: insight.aov,
    },
    {
      id: 'retention',
      label: 'Retention Rate',
      value: `${metrics.retention.toFixed(1)}%`,
      raw: metrics.retention,
      delta: metrics.d[3],
      sub: 'rolling cohort',
      theme: 'plum',
      icon: 'heart',
      spark: spark(range, [54, 55, 57, 58, 60, 62, 63, 64, 66, 67, 68, 69]),
      trendAxisTitle: TREND_AXIS_TITLE[range],
      headline: '90-day rolling cohort retention',
      breakdown: [
        { label: 'Loyalty members', value: `${retentionSegs[0].toFixed(1)}%`, share: Math.round(retentionSegs[0]) },
        { label: 'Non-members', value: `${retentionSegs[1].toFixed(1)}%`, share: Math.round(retentionSegs[1]) },
        { label: 'First-time', value: `${retentionSegs[2].toFixed(1)}%`, share: Math.round(retentionSegs[2]) },
      ],
      insight: insight.retention,
    },
  ];

  const { granularity, windowLabel } = seriesLabels(range);
  return {
    coverage: rangeLabel,
    kpis,
    series: buildSeriesForRange(range, metrics.revenue),
    seriesGranularity: granularity,
    seriesWindowLabel: windowLabel,
    campaigns: buildCampaigns(range),
  };
}
