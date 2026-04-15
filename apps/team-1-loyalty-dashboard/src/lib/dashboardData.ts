import type { Customer, LoyaltyTierInfo, TimeSeriesDataPoint } from '@voyado-kth/shared';
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

export function getDashboardSummary(): DashboardSummary {
  const latestEnrollment = getLatestEnrollmentPoint();
  const topMember = getTopMember();

  return {
    signalPills: [
      `${formatNumber(members.length)} members loaded`,
      `${formatNumber(getActiveMemberCount())} active profiles`,
      `${formatNumber(enrollments.length)} months ready`,
    ],
    sectionStats: {
      'KPI Summary Row': `${formatNumber(members.length)} total | ${formatNumber(getActiveMemberCount())} active | avg ${formatCompactNumber(getAveragePointsBalance())} pts`,
      'Tier Distribution': `${formatCompactNumber(getTotalTierMembers())} tier members across ${formatNumber(tiers.length)} levels`,
      'Recent Activity': `${formatNumber(getVisibleActivityCount())} visible events | latest ${formatSignedNumber(activity[0]?.points ?? 0)} pts`,
      'Enrollment Trend': `${formatNumber(enrollments.length)} months | latest ${formatMonthLabel(latestEnrollment?.label, latestEnrollment?.date)} ${formatNumber(latestEnrollment?.value ?? 0)}`,
      'Top Members': topMember
        ? `${formatMemberName(topMember.firstName, topMember.lastName)} leads with ${formatCompactNumber(topMember.pointsBalance)} pts`
        : 'Top member data is ready once profiles are available',
    },
  };
}
