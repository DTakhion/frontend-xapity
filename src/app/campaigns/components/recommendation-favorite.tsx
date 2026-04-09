'use client';

import React, { useCallback, useMemo, useState } from 'react';

type RecsItem = { item: string; score: number };
type RecsRunResp = { ok: boolean; run: { clientId: number | string; intent: string; result: RecsItem[]; createdAt: string } };

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000';

function pct(n: number) {
  return `${(n * 100).toFixed(2)}%`;
}

export function RecommendationPage() {
  const [clientId, setClientId] = useState<string>('3');
  const [intent, setIntent] = useState<string>('Alimentación'); // ¡usa exactamente lo que guardaste!
  const [nRecomm, setNRecomm] = useState<number>(10);
  const [lambdaParam, setLambdaParam] = useState<number>(0.5);
  const [applyDiversity, setApplyDiversity] = useState<boolean>(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<RecsItem[] | null>(null);
  const [lastRunAt, setLastRunAt] = useState<string | null>(null);

  const maxScore = useMemo(() => (items?.length ? Math.max(...items.map(i => i.score)) : 1), [items]);

  const fetchLatest = useCallback(async () => {
    setLoading(true);
    setError(null);
    setItems(null);
    try {
      const url = new URL('/recommender/latest', API_BASE);
      url.searchParams.set('clientId', clientId.trim());
      url.searchParams.set('intent', intent.trim());
      const res = await fetch(url.toString());
      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const j = await res.json();
          if (j?.detail) msg = j.detail;
        } catch {}
        throw new Error(msg);
      }
      const data: RecsRunResp = await res.json();
      setItems(data.run.result ?? []);
      setLastRunAt(data.run.createdAt);
    } catch (e: any) {
      setError(e?.message ?? 'Error al consultar latest');
    } finally {
      setLoading(false);
    }
  }, [clientId, intent]);

  const runNow = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/recommender/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: clientId.trim(),
          intent: intent.trim(),
          nRecomm,
          applyDiversity,
          lambdaParam,
          enhancer: 0,
          promotionItems: [],
          promotionCategories: [],
        }),
      });
      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const j = await res.json();
          if (j?.detail) msg = j.detail;
        } catch {}
        throw new Error(msg);
      }
      // tras generar, consulta el latest
      await fetchLatest();
    } catch (e: any) {
      setError(e?.message ?? 'Error al generar recomendaciones');
    } finally {
      setLoading(false);
    }
  }, [clientId, intent, nRecomm, applyDiversity, lambdaParam, fetchLatest]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">Recomendaciones</h2>

      {/* Filtros / acciones */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchLatest();
        }}
        className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end"
      >
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Cliente ID</label>
          <input
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="border rounded-lg px-3 py-2"
            placeholder="Ej: 3"
            required
          />
        </div>
        <div className="flex flex-col md:col-span-2">
          <label className="text-sm text-gray-600">Intent</label>
          <input
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            className="border rounded-lg px-3 py-2"
            placeholder="Ej: Alimentación"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">nRecomm</label>
          <input
            type="number"
            min={1}
            max={50}
            value={nRecomm}
            onChange={(e) => setNRecomm(Number(e.target.value))}
            className="border rounded-lg px-3 py-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">λ (relevancia vs diversidad)</label>
          <input
            type="number"
            step="0.05"
            min={0}
            max={1}
            value={lambdaParam}
            onChange={(e) => setLambdaParam(Number(e.target.value))}
            className="border rounded-lg px-3 py-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="diversity"
            type="checkbox"
            checked={applyDiversity}
            onChange={(e) => setApplyDiversity(e.target.checked)}
          />
          <label htmlFor="diversity" className="text-sm text-gray-700">
            Aplicar diversidad (MMR)
          </label>
        </div>

        <div className="md:col-span-6 flex gap-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-lg hover:opacity-90"
          >
            {loading ? 'Cargando…' : 'Consultar último'}
          </button>
          <button
            type="button"
            onClick={runNow}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90"
          >
            Generar ahora
          </button>
          {error && <span className="ml-3 text-red-600 text-sm">{String(error)}</span>}
        </div>
      </form>

      {/* Resultado */}
      <section className="rounded-2xl border p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Top productos recomendados</h3>
          {lastRunAt && <span className="text-xs text-gray-500">Generado: {new Date(lastRunAt).toLocaleString()}</span>}
        </div>

        {loading && <p className="text-sm text-gray-500 mt-3">Cargando…</p>}
        {!loading && !items && !error && (
          <p className="text-sm text-gray-500 mt-3">Sin datos. Usa “Consultar último” o “Generar ahora”.</p>
        )}

        {items && items.length > 0 && (
          <ul className="mt-4 space-y-2">
            {items.map((t, i) => (
              <li key={`${t.item}-${i}`} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="truncate pr-2">{t.item}</span>
                  <span className="tabular-nums">{pct(t.score)}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-indigo-500"
                    style={{ width: `${(t.score / (maxScore || 1)) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}

        {items && items.length === 0 && !loading && !error && (
          <p className="text-sm text-gray-500 mt-3">No hay recomendaciones para esos parámetros.</p>
        )}
      </section>
    </div>
  );
}
