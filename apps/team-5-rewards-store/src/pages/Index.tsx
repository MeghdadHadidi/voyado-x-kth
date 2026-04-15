import { TeamPageLayout } from '@voyado-kth/ui';
import type { WorkshopData } from '@voyado-kth/shared';
import workshopData from '../../../../workshop.json';
import { RewardsStorePage } from './RewardsStorePage';

export function Index() {
  return (
    <TeamPageLayout teamId="team-5" fallbackData={workshopData as WorkshopData}>
      <RewardsStorePage />
    </TeamPageLayout>
  );
}
