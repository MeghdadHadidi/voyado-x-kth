import type { WorkshopData } from '@voyado-kth/shared';
import { TeamPageLayout } from '@voyado-kth/ui';
import workshopData from '../../../../workshop.json';
import { CampaignBuilderPage } from './CampaignBuilderPage';

export function Index() {
  return (
    <TeamPageLayout teamId="team-4" fallbackData={workshopData as WorkshopData}>
      <CampaignBuilderPage />
    </TeamPageLayout>
  );
}
