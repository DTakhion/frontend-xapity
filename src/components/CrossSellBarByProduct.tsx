import { useQuery } from "@tanstack/react-query";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getCrossSellCampana, normalizeCrossSellForBars } from "@/services/kpiCrossSell";

type Props = {
  campanaId?: string;
  title?: string;
  height?: number;
  maxLabels?: number; // por si quieres truncar nombres
};

export default function CrossSellBarByProduct({
  campanaId,
  title = "Cross-sell: Top productos co-comprados",
  height = 320,
  maxLabels = 32,
}: Props) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["kpi_cross_sell_campana", campanaId],
    queryFn: () => getCrossSellCampana(campanaId),
    staleTime: 60_000,
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
        <CardContent className="h-[320px] animate-pulse bg-muted/30 rounded-xl" />
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="w-full">
        <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
        <CardContent>
          <div className="text-sm text-red-600">
            {(error as Error)?.message ?? "No hay datos"}
          </div>
        </CardContent>
      </Card>
    );
  }

  const rows = normalizeCrossSellForBars(data);

  // Truncar etiquetas largas en eje X (robusto ante valores no-string)
  const formatLabel = (val: unknown) => {
    const s = typeof val === "string" ? val : String(val ?? "");
    return s.length > maxLabels ? s.slice(0, maxLabels - 1) + "…" : s;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {title} — (Top {data.top_productos_cross_sell.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="producto"
                tickFormatter={formatLabel}
                interval={0}
                angle={-10}
                height={60}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              {/* Barras agrupadas: compras vs clientes únicos */}
              <Bar dataKey="compras" name="Compras junto campaña" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="clientes" name="Clientes únicos" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-2">
            Total co-ocurrencias: {
              typeof data.total_coocurrencias === "number"
                ? data.total_coocurrencias.toLocaleString()
                : String(data.total_coocurrencias)
            } · {data.nota}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
