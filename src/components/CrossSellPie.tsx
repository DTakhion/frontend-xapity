import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getCrossSellCampana } from "@/services/kpiCrossSell";

const PALETTE = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function CrossSellPie({ campanaId }: { campanaId?: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["kpi_cross_sell_campana_pie", campanaId],
    queryFn: () => getCrossSellCampana(campanaId, 5),
    select: (raw) => ({
      pct: raw._pie_pct,               // 0..100
      numerador: raw._pie_num,
      denominador: raw._pie_den,
      rows: [
        { name: "Con cross-sell", value: raw._pie_pct },
        { name: "Sin cross-sell", value: Math.max(0, 100 - raw._pie_pct) },
      ],
    }),
    staleTime: 60_000,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Participación cross-sell</CardTitle></CardHeader>
        <CardContent className="h-[280px] animate-pulse bg-muted/30 rounded-xl" />
      </Card>
    );
  }
  if (error) {
  return (
    <Card>
      <CardHeader><CardTitle>Participación cross-sell</CardTitle></CardHeader>
      <CardContent>
        <div className="text-sm text-red-600">Error al cargar KPI</div>
        <pre className="text-xs opacity-70 whitespace-pre-wrap">
          {String((error as Error)?.message ?? error)}
        </pre>
      </CardContent>
    </Card>
  );
}
  if (!data) {
    return (
      <Card>
        <CardHeader><CardTitle>Participación cross-sell</CardTitle></CardHeader>
        <CardContent>No hay datos</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle>Participación cross-sell ({data.pct}%)</CardTitle></CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground mb-2">
          Clientes con cross-sell: {data.numerador} / {data.denominador}
        </div>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data.rows} dataKey="value" nameKey="name" outerRadius={100} innerRadius={60}>
                {data.rows.map((_, i) => (
                  <Cell key={`slice-${i}`} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => `${v}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}