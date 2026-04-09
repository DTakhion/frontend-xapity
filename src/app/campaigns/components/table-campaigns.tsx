import React, { useEffect, useMemo, useState } from 'react';
import { BaseTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@radix-ui/react-checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { FormCreateCampaign } from './form-create-campaign';

//const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://127.0.0.1:8001';
const API_BASE = import.meta.env.VITE_API_BASE_URL?? 'http://127.0.0.1:8001';

export type Campaign = {
  campana_id: string;
  nombre?: string;
  fecha_inicio?: string;
  fecha_termino?: string;
  sucursales?: string;
  segmento_clientes?: string;
  creado_en?: string;
  batch_id?: string;
  productos?: any[];
  productos_count?: number;
};

function fmtDate(s?: string) {
  if (!s) return '—';
  try {
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return String(s);
    return d.toLocaleDateString();
  } catch {
    return String(s);
  }
}

const columns: ColumnDef<Campaign>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'nombre',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Nombre
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue('nombre') || '—'}</div>,
  },
  {
    accessorKey: 'fecha_inicio',
    header: 'Inicio',
    cell: ({ row }) => <div>{fmtDate(row.getValue('fecha_inicio'))}</div>,
  },
  {
    accessorKey: 'fecha_termino',
    header: 'Término',
    cell: ({ row }) => <div>{fmtDate(row.getValue('fecha_termino'))}</div>,
  },
  {
    accessorKey: 'sucursales',
    header: 'Sucursales',
    cell: ({ row }) => (
      <div className="truncate max-w-[16rem]" title={row.getValue('sucursales') || ''}>
        {row.getValue('sucursales') || '—'}
      </div>
    ),
  },
  {
    accessorKey: 'productos_count',
    header: () => <div className="text-right">Productos</div>,
    cell: ({ row }) => {
      const n = Number(row.getValue('productos_count') ?? 0);
      return <div className="text-right font-medium">{n}</div>;
    },
  },
  {
    accessorKey: 'creado_en',
    header: 'Creada',
    cell: ({ row }) => <div>{fmtDate(row.getValue('creado_en'))}</div>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const c = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(c.campana_id)}
            >
              Copiar ID de campaña
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                window.alert(
                  JSON.stringify(
                    {
                      campana_id: c.campana_id,
                      nombre: c.nombre,
                      batch_id: c.batch_id,
                      productos_preview: Array.isArray(c.productos)
                        ? c.productos.slice(0, 5)
                        : [],
                    },
                    null,
                    2
                  )
                )
              }
            >
              Ver preview (5 prod.)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const TableCampaigns = () => {
  const [data, setData] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);

  // paginación server-side
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const skip = useMemo(() => page * limit, [page, limit]);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      setLoading(true);
      try {
        const url = new URL('/campanas_creadas', API_BASE);
        url.searchParams.set('skip', String(skip));
        url.searchParams.set('limit', String(limit));
        url.searchParams.set('order', 'desc');
        const res = await fetch(url.toString(), { signal: ctrl.signal });
        const json: Campaign[] = await res.json();
        setData(json);
      } catch {
        // podríamos agregar toasts/alerts aquí si te interesa
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [skip, limit]);

  const canPrev = page > 0 && !loading;
  const canNext = data.length === limit && !loading;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Nuevas Campañas</h2>
        <div className="flex items-center gap-2">
          <select
            className="border rounded-md px-2 py-1 text-sm"
            value={limit}
            onChange={(e) => {
              setPage(0);
              setLimit(Number(e.target.value));
            }}
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n} / página
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            onClick={() => canPrev && setPage((p) => Math.max(0, p - 1))}
            disabled={!canPrev}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            onClick={() => canNext && setPage((p) => p + 1)}
            disabled={!canNext}
          >
            Siguiente
          </Button>
        </div>
      </div>

      {loading && (
        <div className="text-sm text-gray-500 px-1">Cargando campañas…</div>
      )}

      <BaseTable
        columns={columns}
        data={data}
        renderAction={FormCreateCampaign}
      />
    </div>
  );
};
