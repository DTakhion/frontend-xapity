import { TypographyH2 } from '@/components/ui/typography';
import { TableCampaigns } from './components/table-campaigns';

export function CampaignsPage() {
  return (
    <div>
      <TypographyH2>Nuevas Campañas</TypographyH2>
      <div className="@container/main flex flex-1 flex-col gap-2 px-7 pt-2">
        <TableCampaigns />
      </div>
    </div>
  );
}
