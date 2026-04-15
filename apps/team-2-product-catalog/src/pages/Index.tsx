import { TeamPageLayout } from '@voyado-kth/ui';
import type { WorkshopData } from '@voyado-kth/shared';
import workshopData from '../../../../workshop.json';
import { ProductCatalogPage } from './ProductCatalogPage';

export function Index() {
  return (
    <TeamPageLayout teamId="team-2" fallbackData={workshopData as WorkshopData}>
      <ProductCatalogPage />
    </TeamPageLayout>
  );
}
