/* 'use client';

import { TrendingUp } from 'lucide-react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
const chartData = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 305 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 273 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export function ChartRadar() {
  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>Radar Chart - Dots</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="month" />
            <PolarGrid />
            <Radar
              dataKey="desktop"
              fill="var(--color-desktop)"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          January - June 2024
        </div>
      </CardFooter>
    </Card>
  );
}
 */

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,   // ⬅️ nuevo
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://127.0.0.1:8000';

// ---------- Tipos de respuesta ----------
type RecurrenciaResp = {
  total_ocurrencias: number;
  total_clientes_campana_con_compra: number;
  total_clientes_recurrentes_en_campana: number;
};

type CrossSellResp = {
  total_coocurrencias: number;
};

type CampanaItem = {
  campana_id: string;
  productos_count?: number;
};

// ---------- Helper: fetch tipado ----------
async function getJSON<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return (await res.json()) as T;
}

// ---------- Config de ChartContainer ----------
const chartConfig = {
  score: {
    label: 'Score',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

type RadarRow = { subject: string; score: number; raw: number };

export function ChartRadar({ campanaId }: { campanaId?: string }) {
  const [data, setData] = useState<RadarRow[]>([]);
  const [loading, setLoading] = useState(false);

  const title = 'Radar Chart - Dots';
  const subtitle = 'Perfil compuesto (escala 0–100)';

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      setLoading(true);
      try {
        const q = campanaId ? `?campana_id=${campanaId}` : '';

        // 1) KPI de recurrencia y cross-sell
        const [rec, cs] = await Promise.all([
          getJSON<RecurrenciaResp>(`${API_BASE}/kpi/recurrencia_campana${q}`, ctrl.signal),
          getJSON<CrossSellResp>(`${API_BASE}/kpi/cross_sell_campana${q}`, ctrl.signal),
        ]);

        // 2) Tamaño de campaña (productos_count): última campaña
        const lista = await getJSON<CampanaItem[]>(
          `${API_BASE}/campanas_creadas?skip=0&limit=1&order=desc`,
          ctrl.signal
        );
        const productosCount = Number(lista?.[0]?.productos_count ?? 0);

        // 3) Valores crudos
        const ocurrencias = Number(rec.total_ocurrencias ?? 0);
        const clientes = Number(rec.total_clientes_campana_con_compra ?? 0);
        const recurrentes = Number(rec.total_clientes_recurrentes_en_campana ?? 0);
        const tasaRec = clientes > 0 ? Number(((recurrentes / clientes) * 100).toFixed(2)) : 0;
        const coocurrencias = Number(cs.total_coocurrencias ?? 0);
        const productos = Number.isFinite(productosCount) ? productosCount : 0;

        const raw = [
          { subject: 'Ocurrencias', value: ocurrencias },
          { subject: 'Clientes', value: clientes },
          { subject: 'Recurrentes', value: recurrentes },
          { subject: 'Tasa recurrencia %', value: tasaRec },
          { subject: 'Co-ocurrencias', value: coocurrencias },
          { subject: 'Productos', value: productos },
        ];

        // 4) Normalización local 0–100
        const max = Math.max(1, ...raw.map(r => r.value));
        const norm: RadarRow[] = raw.map(r => ({
          subject: r.subject,
          score: Math.round((r.value / max) * 100),
          raw: r.value,
        }));

        setData(norm);
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [campanaId]);

  const footer = useMemo(
    () => ({
      text: 'Indicadores relativos (0–100) a mayor valor del set.',
      period: 'Campaña seleccionada',
    }),
    []
  );

  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {subtitle} {loading && <span className="text-xs text-muted-foreground">· Cargando…</span>}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-0">
        {/* Altura mayor y sin aspect-square para evitar recortes */}
        <ChartContainer config={chartConfig} className="mx-auto h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              data={data}
              outerRadius="72%"                               // deja espacio para labels
              margin={{ top: 8, right: 24, bottom: 8, left: 24 }}
            >
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <PolarGrid />

              {/* Etiquetas más legibles */}
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fontSize: 12 }}
                tickLine={false}
                //tickMargin={12}
              />

              {/* Eje radial fijo 0–100 con pocos ticks */}
              <PolarRadiusAxis
                domain={[0, 100]}
                tickCount={5}
                tick={{ fontSize: 10 }}
                axisLine={false}
              />

              <Radar
                dataKey="score"
                fill="var(--color-score)"
                fillOpacity={0.6}
                dot={{ r: 4, fillOpacity: 1 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {footer.text} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          {footer.period}
        </div>
      </CardFooter>
    </Card>
  );
}
