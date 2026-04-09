/* import { ChartAreaInteractive } from '@/components/chart-area';
import { ChartBar } from '@/components/chart-bar';
import { ChartPie } from '@/components/chart-pie';
import { ChartRadar } from '@/components/chart-radar';
import { SectionCards } from '@/components/section-cards';
import { TypographyH2 } from '@/components/ui/typography';

export function KpisPage() {
  return (
    <div>
      <TypographyH2>Conversión a Fidelización por Campaña</TypographyH2>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6 flex flex-col gap-12 mt-4">
            <div className="flex w-full justify-center gap-8">
              <ChartBar />
              <ChartPie />
              <ChartRadar />
            </div>
            <ChartAreaInteractive />
          </div>
        </div>
      </div>
    </div>
  );
}; */

import { ChartAreaInteractive } from '@/components/chart-area';
import { ChartBar } from '@/components/chart-bar';
import { ChartPie } from '@/components/chart-pie';
import { ChartRadar } from '@/components/chart-radar';
import { SectionCards } from '@/components/section-cards';
import { TypographyH2 } from '@/components/ui/typography';

export function KpisPage() {
  return (
    <div>
      <TypographyH2>Conversión a Fidelización por Campaña</TypographyH2>

      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />

          <div className="px-4 lg:px-6 flex flex-col gap-12 mt-4">
            {/* === Layout de charts (3 columnas) === */}
            <div
              className="
                grid gap-6 items-start
                md:grid-cols-2
                lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)_minmax(0,1fr)]
              "
            >
              {/* Columna 1: barras, que crezca libre */}
              <div className="min-h-[360px]">
                <ChartBar />
              </div>

              {/* Columna 2: KPI donut — ancho acotado y cuadrado para evitar aplaste */}
              <div className="justify-self-center w-full max-w-[340px]">
                <div className="aspect-square">
                  <ChartPie />
                </div>
              </div>

              {/* Columna 3: radar, altura mínima para equilibrio visual */}
              <div className="min-h-[360px]">
                <ChartRadar />
              </div>
            </div>

            {/* Área de líneas debajo, sin cambios */}
            <ChartAreaInteractive />
          </div>
        </div>
      </div>
    </div>
  );
}
