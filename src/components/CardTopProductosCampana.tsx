import { useQuery } from "@tanstack/react-query";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { getTopProductosCampana } from "@/services/topProductosService";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const fmtCLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export function CardTopProductosCampana() {
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
              <div className="mt-2 h-4 w-56 rounded bg-muted" />
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
    console.error(error);
    return <div className="px-4 lg:px-6 text-red-600">Error cargando KPI de campaña</div>;
  }

  const items = Array.isArray(data?.top_productos) ? data!.top_productos.slice(0, 4) : [];

  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 lg:px-6">
      {items.map((p: any, idx: number) => {
        const participacion = Number(p?.participacion ?? 0);
        const up = participacion >= 0;
        const tone = ["from-blue-50", "from-indigo-50", "from-violet-50", "from-sky-50"][idx % 4];

        return (
          <Card
            key={p?.producto_id ?? idx}
            className={`@container/card bg-gradient-to-t ${tone} to-white border border-black/5 shadow-sm`}
          >
            <CardHeader className="relative">
              <div className="flex items-start justify-between gap-3">
                <CardDescription className="text-muted-foreground">
                  {p?.descripcion ?? `Producto ${p?.producto_id ?? idx + 1}`}
                </CardDescription>
                <Badge variant="outline" className="rounded-xl text-xs px-2 py-1">
                  {up ? (
                    <TrendingUpIcon className="inline-block mr-1 size-3" />
                  ) : (
                    <TrendingDownIcon className="inline-block mr-1 size-3" />
                  )}
                  {participacion.toFixed(2)}%
                </Badge>
              </div>

              {/* Número grande con etiqueta */}
              <div className="mt-1 text-xs text-muted-foreground">Compras</div>
              <CardTitle className="@[250px]/card:text-4xl text-3xl font-semibold tabular-nums leading-tight tracking-tight">
                {Number(p?.compras ?? 0).toLocaleString("es-CL")}
              </CardTitle>

              {/* Nuevos atributos desde el endpoint */}
              <div className="mt-2 text-sm text-muted-foreground">
                Precio: {fmtCLP.format(Number(p?.precio ?? 0))} — Desc.:{" "}
                {Number(p?.porcentaje_descuento ?? 0).toFixed(2)}%
              </div>
            </CardHeader>

            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="font-medium">
                Clientes únicos: {Number(p?.clientes_unicos ?? 0).toLocaleString("es-CL")}
              </div>
              <div className="text-muted-foreground">
                Penetración: {Number(p?.penetracion_clientes ?? 0).toFixed(2)}%
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

