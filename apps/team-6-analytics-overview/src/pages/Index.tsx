import { TeamPageLayout } from '@voyado-kth/ui';
import type { WorkshopData } from '@voyado-kth/shared';
import workshopData from '../../../../workshop.json';
import { AnalyticsOverviewPage } from './AnalyticsOverviewPage';

export function Index() {
  return (
    <TeamPageLayout teamId="team-6" fallbackData={workshopData as WorkshopData}>
      <AnalyticsOverviewPage />
    </TeamPageLayout>
  );
}
