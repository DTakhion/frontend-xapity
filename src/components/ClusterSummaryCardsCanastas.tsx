import React, { useEffect, useMemo, useState } from "react";

type TopCat = { categoria: string; mean_prop: number };
type ClusterInfo = { n: number; top_categories?: TopCat[] };
type ApiResponse = {
  points?: { cliente_id: number }[];
  clusters?: Record<string, ClusterInfo>;
  params?: { pca_explained?: number[] };
};

const PALETTE = ["#5563DE", "#22A094", "#E86F51", "#CC66D3", "#E0B020", "#2E86DE", "#74B816", "#D9480F"];
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export default function ClusterSummaryCardsCanastas() {
  const [k, setK] = useState<number>(5);
  const [sample, setSample] = useState<number | undefined>(undefined);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const totalPuntos = data?.points?.length ?? 0;
  const clusters = data?.clusters ?? {};

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      try {
        const url = new URL("/kpi/cliente/segmentacion-canastas", API_BASE);
        url.searchParams.set("k", String(k));
        if (sample) url.searchParams.set("sample", String(sample));
        const res = await fetch(url.toString(), { signal: controller.signal });
        if (!res.ok) throw new Error(await res.text());
        const json: ApiResponse = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [k, sample]);

  const entries = useMemo(
    () => Object.entries(clusters).sort((a, b) => Number(a[0]) - Number(b[0])),
    [clusters]
  );

  return (
    <div className="mt-8">
      {/* Controles simples (independientes del scatter) */}
      <div className="mb-4 flex items-center gap-6">
        <label className="flex items-center gap-3">
          <span className="text-gray-600">Clusters (k):</span>
          <input type="range" min={2} max={12} value={k} onChange={(e) => setK(Number(e.target.value))} />
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
        {loading && <span className="text-sm text-gray-500">Cargando…</span>}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {entries.map(([clusterKey, info], idx) => {
          const color = PALETTE[idx % PALETTE.length];
          const pct = totalPuntos ? Math.round((info.n / totalPuntos) * 100) : 0;

          return (
            <div
              key={clusterKey}
              className="rounded-2xl border p-4 shadow-sm bg-white"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <h3 className="font-semibold">Cluster {clusterKey}</h3>
                </div>
                <div className="text-sm text-gray-500">{pct}% del total</div>
              </div>

              <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <dt className="text-gray-500">Tamaño</dt>
                <dd className="font-medium">{info.n}</dd>

                <dt className="text-gray-500 col-span-2 mt-2">Top categorías</dt>
                <dd className="col-span-2">
                  <ul className="list-disc pl-5">
                    {(info.top_categories ?? []).slice(0, 5).map((t, i) => (
                      <li key={i}>
                        {t.categoria} — {(t.mean_prop * 100).toFixed(1)}%
                      </li>
                    ))}
                    {(!info.top_categories || info.top_categories.length === 0) && (
                      <li className="text-gray-400">Sin datos</li>
                    )}
                  </ul>
                </dd>
              </dl>
            </div>
          );
        })}
      </div>
    </div>
  );
}
