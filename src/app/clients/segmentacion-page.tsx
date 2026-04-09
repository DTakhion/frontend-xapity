'use client';

import { useEffect, useMemo, useState } from 'react';
import SegmentacionScatter from '@/components/SegmentacionScatter';
import ClusterSummaryCards from '@/components/ClusterSummaryCards';

type Punto = {
  cliente_id: number | null;
  cluster: number;
  x: number;
  y: number;
  meta: Record<string, any>;
};

export default function SegmentacionPage() {
  const [k, setK] = useState(5);
  const [points, setPoints] = useState<Punto[]>([]);
  const [clusters, setClusters] = useState<Record<string, { n:number }>>({});
  const [pcLabels, setPcLabels] = useState<{pc1:string, pc2:string}>({ pc1: 'PC1', pc2: 'PC2' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = useMemo(
    () => (import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'),
    []
  );

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${baseUrl}/kpi/cliente/segmentacion-atributos?k=${k}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setPoints(json.points ?? []);
        setClusters(json.clusters ?? {});
        // si en el futuro enviamos pca_explained desde backend:
        const r = json?.params?.pca_explained as number[] | undefined;
        if (Array.isArray(r) && r.length >= 2) {
          setPcLabels({
            pc1: `PC1 (${Math.round(r[0]*100)}%)`,
            pc2: `PC2 (${Math.round(r[1]*100)}%)`,
          });
        } else {
          setPcLabels({ pc1: 'PC1', pc2: 'PC2' });
        }
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [baseUrl, k]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Segmentación de Clientes</h1>
        <div className="flex items-center gap-3">
          <label htmlFor="k" className="text-sm text-gray-600">Clusters (k):</label>
          <input
            id="k"
            type="range"
            min={2}
            max={10}
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
          />
          <span className="text-sm font-medium w-5 text-center">{k}</span>
        </div>
      </div>

      {loading && <div className="text-sm text-muted-foreground">Cargando datos…</div>}
      {error && <div className="text-sm text-red-600">Error: {error}</div>}

      {!loading && !error && (
  <>
    <ClusterSummaryCards clusters={clusters} total={points.length} />
    <SegmentacionScatter
      data={points}
      clustersInfo={clusters}
      pc1Label={pcLabels.pc1}
      pc2Label={pcLabels.pc2}
    />
  </>
)}

    </div>
  );
}
