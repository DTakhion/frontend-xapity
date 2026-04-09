// src/components/SegmentacionCanastasScatter.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type Point = {
  cliente_id: number;
  cluster: number;
  x: number;
  y: number;
  meta?: {
    top_categorias_cliente?: { categoria: string; prop: number }[];
  };
};

type ApiResponse = {
  points: Point[];
  params?: { pca_explained?: number[] };
  clusters?: Record<
    string,
    { n: number; top_categories?: { categoria: string; mean_prop: number }[] }
  >;
};

const PALETTE = ["#5563DE", "#22A094", "#E86F51", "#CC66D3", "#E0B020", "#2E86DE", "#74B816", "#D9480F"];

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export default function SegmentacionCanastasScatter() {
  const [k, setK] = useState<number>(5);
  const [sample, setSample] = useState<number | undefined>(undefined);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const explained = data?.params?.pca_explained ?? [];
  const xLabel = `PC1${explained[0] ? ` (${Math.round(explained[0] * 100)}%)` : ""}`;
  const yLabel = `PC2${explained[1] ? ` (${Math.round(explained[1] * 100)}%)` : ""}`;

  useEffect(() => {
    const controller = new AbortController();
    async function fetchData() {
      setLoading(true);
      try {
        const url = new URL("/kpi/cliente/segmentacion-canastas", API_BASE);
        url.searchParams.set("k", String(k));
        if (sample) url.searchParams.set("sample", String(sample));
        const res = await fetch(url.toString(), { signal: controller.signal });
        if (!res.ok) throw new Error(await res.text());
        const json: ApiResponse = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    return () => controller.abort();
  }, [k, sample]);

  const seriesByCluster = useMemo(() => {
    const by: Record<number, Point[]> = {};
    (data?.points ?? []).forEach((p) => {
      if (!by[p.cluster]) by[p.cluster] = [];
      by[p.cluster].push(p);
    });
    return by;
  }, [data]);

  const clusters = useMemo(() => Object.keys(seriesByCluster).map(Number).sort((a, b) => a - b), [seriesByCluster]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-extrabold">Segmentación de Clientes (Canastas)</h2>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-3">
            <span className="text-gray-600">Clusters (k):</span>
            <input
              type="range"
              min={2}
              max={12}
              value={k}
              onChange={(e) => setK(Number(e.target.value))}
            />
            <span className="w-6 text-right">{k}</span>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-gray-600">Sample:</span>
            <input
              className="w-28 rounded border px-2 py-1"
              placeholder="(opcional)"
              value={sample ?? ""}
              onChange={(e) => setSample(e.target.value ? Number(e.target.value) : undefined)}
            />
          </label>
        </div>
      </div>

      <div className="w-full h-[520px] rounded-2xl border">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 16, right: 24, bottom: 32, left: 24 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="x"
              name="PC1"
              tick={{ fontSize: 12 }}
              label={{ value: xLabel, position: "bottom", offset: 10 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="PC2"
              tick={{ fontSize: 12 }}
              label={{ value: yLabel, angle: -90, position: "insideLeft" }}
            />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<CustomTooltip />} />
            <Legend />
            {clusters.map((c, idx) => (
              <Scatter
                key={c}
                name={`Cluster ${c}`}
                data={seriesByCluster[c]}
                fill={PALETTE[idx % PALETTE.length]}
                line={{ stroke: "transparent" }}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {loading && <p className="mt-2 text-sm text-gray-500">Cargando…</p>}
    </div>
  );
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload || !payload.length) return null;
  const p: Point = payload[0].payload;
  return (
    <div className="rounded-xl border bg-white/95 p-3 shadow">
      <div className="font-semibold mb-1">Cliente: {p.cliente_id}</div>
      <div className="text-sm text-gray-700">Cluster: {p.cluster}</div>
      {p.meta?.top_categorias_cliente?.length ? (
        <div className="mt-2 text-sm">
          <div className="font-medium mb-1">Top categorías:</div>
          <ul className="list-disc pl-4">
            {p.meta.top_categorias_cliente.slice(0, 3).map((t, i) => (
              <li key={i}>
                {t.categoria} — {(t.prop * 100).toFixed(1)}%
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
