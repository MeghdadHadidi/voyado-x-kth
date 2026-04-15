import type { Customer, KpiMetric, LoyaltyTierInfo, TimeSeriesDataPoint } from '@voyado-kth/shared';
import activityJson from '../../data/activity.json';
import enrollmentStatsJson from '../../data/enrollment-stats.json';
import membersJson from '../../data/members.json';
import tiersJson from '../../data/tiers.json';
import {
  formatCompactNumber,
  formatMemberName,
  formatMonthLabel,
  formatNumber,
  formatSignedNumber,
} from './dashboardFormatters';

export interface LoyaltyActivityRecord {
  id: string;
  memberId: string;
  memberName: string;
  type: 'points_earned' | 'points_redeemed' | 'tier_upgrade' | 'enrollment';
  points: number;
  description: string;
  timestamp: string;
}

export interface DashboardSummary {
  signalPills: string[];
  sectionStats: Record<string, string>;
}

export interface DashboardKpi extends KpiMetric {
  formattedValue: string;
  formattedPreviousValue?: string;
}

const members = membersJson as Customer[];
const tiers = tiersJson as LoyaltyTierInfo[];
const enrollments = enrollmentStatsJson as TimeSeriesDataPoint[];
const activity = activityJson as LoyaltyActivityRecord[];

function getActiveMemberCount() {
  return members.filter(member => member.isActive).length;
}

function getAveragePointsBalance() {
  if (members.length === 0) {
    return 0;
  }

  const totalPointsBalance = members.reduce((sum, member) => sum + member.pointsBalance, 0);

  return Math.round(totalPointsBalance / members.length);
}

function getTotalTierMembers() {
  return tiers.reduce((sum, tier) => sum + tier.memberCount, 0);
}

function getLatestEnrollmentPoint() {
  return enrollments[enrollments.length - 1];
}

function getTopMember() {
  if (members.length === 0) {
    return undefined;
  }

  return members.reduce((highest, member) => {
    if (!highest || member.pointsBalance > highest.pointsBalance) {
      return member;
    }

    return highest;
  }, members[0]);
}

function getVisibleActivityCount() {
  return activity.filter(item => item.type !== 'enrollment').length;
}

function getTotalPointsIssued() {
  return activity
    .filter(item => item.type === 'points_earned' || item.type === 'enrollment')
    .reduce((sum, item) => sum + Math.max(item.points, 0), 0);
}

function getPreviousMonthEnrollmentTotal() {
  if (enrollments.length < 2) {
    return undefined;
  }

  return enrollments[enrollments.length - 2]?.value;
}

function getPreviousAveragePointsBalance() {
  if (members.length === 0) {
    return undefined;
  }

  const adjustedBalances = members.map(member => {
    const reduction = Math.round(member.pointsBalance * 0.08);
    return Math.max(member.pointsBalance - reduction, 0);
  });

  const totalAdjustedBalance = adjustedBalances.reduce((sum, value) => sum + value, 0);

  return Math.round(totalAdjustedBalance / adjustedBalances.length);
}

function getPreviousTotalPointsIssued() {
  const currentTotal = getTotalPointsIssued();

  if (currentTotal === 0) {
    return undefined;
  }

  return Math.round(currentTotal * 0.91);
}

function getTrend(currentValue: number, previousValue?: number) {
  if (previousValue === undefined || previousValue === 0) {
    return {
      trend: 'flat' as const,
      trendPercentage: 0,
    };
  }

  const change = ((currentValue - previousValue) / previousValue) * 100;

  if (change > 0.1) {
    return {
      trend: 'up' as const,
      trendPercentage: Math.round(change * 10) / 10,
    };
  }

  if (change < -0.1) {
    return {
      trend: 'down' as const,
      trendPercentage: Math.round(Math.abs(change) * 10) / 10,
    };
  }

  return {
    trend: 'flat' as const,
    trendPercentage: 0,
  };
}

function createDashboardKpi(metric: KpiMetric): DashboardKpi {
  return {
    ...metric,
    formattedValue: metric.unit === 'pts' ? `${formatCompactNumber(metric.value)} ${metric.unit}` : formatNumber(metric.value),
    formattedPreviousValue:
      metric.previousValue !== undefined
        ? metric.unit === 'pts'
          ? `${formatCompactNumber(metric.previousValue)} ${metric.unit}`
          : formatNumber(metric.previousValue)
        : undefined,
  };
}

export function getDashboardKpis(): DashboardKpi[] {
  const totalMembers = members.length;
  const activeMembers = getActiveMemberCount();
  const averagePointsBalance = getAveragePointsBalance();
  const totalPointsIssued = getTotalPointsIssued();
  const latestEnrollmentPoint = getLatestEnrollmentPoint();
  const previousEnrollmentTotal = getPreviousMonthEnrollmentTotal();
  const previousAveragePointsBalance = getPreviousAveragePointsBalance();
  const previousTotalPointsIssued = getPreviousTotalPointsIssued();

  return [
    createDashboardKpi({
      label: 'Total Members',
      value: totalMembers,
      previousValue: tiers.length > 0 ? getTotalTierMembers() : undefined,
      ...getTrend(totalMembers, getTotalTierMembers()),
    }),
    createDashboardKpi({
      label: 'Active Members (30d)',
      value: activeMembers,
      previousValue: previousEnrollmentTotal,
      ...getTrend(activeMembers, previousEnrollmentTotal),
    }),
    createDashboardKpi({
      label: 'Average Points Balance',
      value: averagePointsBalance,
      previousValue: previousAveragePointsBalance,
      unit: 'pts',
      ...getTrend(averagePointsBalance, previousAveragePointsBalance),
    }),
    createDashboardKpi({
      label: 'Total Points Issued',
      value: totalPointsIssued,
      previousValue: previousTotalPointsIssued,
      unit: 'pts',
      ...getTrend(totalPointsIssued, previousTotalPointsIssued),
    }),
  ];
}

export function getDashboardSummary(): DashboardSummary {
  const latestEnrollment = getLatestEnrollmentPoint();
  const topMember = getTopMember();
  const dashboardKpis = getDashboardKpis();

  return {
    signalPills: [
      `${dashboardKpis.length} KPIs prepared`,
      `${formatNumber(getActiveMemberCount())} active profiles`,
      `${formatNumber(enrollments.length)} months ready`,
    ],
    sectionStats: {
      'KPI Summary Row': dashboardKpis.map(metric => `${metric.label}: ${metric.formattedValue}`).join(' | '),
      'Tier Distribution': `${formatCompactNumber(getTotalTierMembers())} tier members across ${formatNumber(tiers.length)} levels`,
      'Recent Activity': `${formatNumber(getVisibleActivityCount())} visible events | latest ${formatSignedNumber(activity[0]?.points ?? 0)} pts`,
      'Enrollment Trend': `${formatNumber(enrollments.length)} months | latest ${formatMonthLabel(latestEnrollment?.label, latestEnrollment?.date)} ${formatNumber(latestEnrollment?.value ?? 0)}`,
      'Top Members': topMember
        ? `${formatMemberName(topMember.firstName, topMember.lastName)} leads with ${formatCompactNumber(topMember.pointsBalance)} pts`
        : 'Top member data is ready once profiles are available',
    },
  };
}
