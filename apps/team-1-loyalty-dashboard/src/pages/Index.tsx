import { TeamPageLayout } from '@voyado-kth/ui';
import type { WorkshopData } from '@voyado-kth/shared';
import workshopData from '../../../../workshop.json';
import { LoyaltyDashboardPage } from './LoyaltyDashboardPage';

export function Index() {
  return (
    <TeamPageLayout teamId="team-1" fallbackData={workshopData as WorkshopData}>
      <LoyaltyDashboardPage />
    </TeamPageLayout>
  );
}
