import { useQuery } from "@tanstack/react-query";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTopProductosCampana } from "@/services/topProductosService";

const fmtCLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export function SectionCards() {
  // Top 4 por compras (puedes cambiar a 'penetracion')
  const { data, isLoading, error } = useQuery({
    queryKey: ["top_productos_campana", 4, "compras"],
    queryFn: () => getTopProductosCampana(4, "compras"),
  });

  if (isLoading) {
    return (
      <div className="@xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 lg:px-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse bg-muted/40">
            <CardHeader>
              <div className="h-4 w-40 rounded bg-muted" />
              <div className="mt-2 h-6 w-24 rounded bg-muted" />
            </CardHeader>
            <CardFooter>
              <div className="h-4 w-48 rounded bg-muted" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 lg:px-6 text-red-600">
        Error cargando KPI de campaña
      </div>
    );
  }

  const items =
    data?.top_productos && Array.isArray(data.top_productos)
      ? data.top_productos
      : [];

  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      {items.slice(0, 4).map((p: any, idx: number) => {
        const titulo = p?.descripcion ?? `Producto ${p?.producto_id ?? idx + 1}`;
        const compras = Number(p?.compras ?? 0);
        const participacion = Number(p?.participacion ?? 0);
        const clientesUnicos = Number(p?.clientes_unicos ?? 0);
        const penetracion = Number(p?.penetracion_clientes ?? 0);
        const precio = Number(p?.precio ?? 0);
        const descuento = Number(p?.porcentaje_descuento ?? 0);

        const bg = ["bg-blue-100", "bg-indigo-100", "bg-violet-100", "bg-sky-100"][idx % 4];

        return (
          <Card key={p?.producto_id ?? idx} className={`@container/card ${bg}`}>
            <CardHeader className="relative">
              <CardDescription>{titulo}</CardDescription>

              {/* Etiqueta + número grande */}
              <div className="mt-1 text-xs text-muted-foreground">Compras</div>
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                {compras.toLocaleString("es-CL")}
              </CardTitle>

              {/* Precio + % Descuento */}
              <div className="mt-2 text-sm text-foreground/80">
                Precio: {fmtCLP.format(precio)} — Desc.: {descuento.toFixed(2)}%
              </div>

              <div className="absolute right-4 top-4">
                <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                  {participacion >= 0 ? (
                    <TrendingUpIcon className="size-3" />
                  ) : (
                    <TrendingDownIcon className="size-3" />
                  )}
                  {Math.abs(participacion).toFixed(2)}%
                </Badge>
              </div>
            </CardHeader>

            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Clientes únicos: {clientesUnicos.toLocaleString("es-CL")}
              </div>
              <div className="text-muted-foreground">
                Penetración: {penetracion.toFixed(2)}%
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
