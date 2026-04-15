import type { WorkshopData } from '@voyado-kth/shared';
import { TeamPageLayout } from '@voyado-kth/ui';
import workshopData from '../../../../workshop.json';
import { CustomerSegmentsPage } from './CustomerSegmentsPage';

export function Index() {
  return (
    <TeamPageLayout teamId="team-3" fallbackData={workshopData as WorkshopData}>
      <CustomerSegmentsPage />
    </TeamPageLayout>
  );
}
