/* import { TypographyH2 } from '@/components/ui/typography';

export function ClientsPage() {
  return (
    <div>
      <TypographyH2>Clientes</TypographyH2>
    </div>
  );
}
 */

import React, { useMemo, useState } from "react";
import { TypographyH2 } from "@/components/ui/typography";

type TopKItem = { item: string; prob: number };
type TopKResponse = { key: string; k: number; labels: string[]; values: number[]; topk: TopKItem[] };

type Neighbor = { key: string; score: number };
type NeighborsResponse = { key: string; n: number; neighbors: Neighbor[]; labels: string[]; values: number[] };

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

function pct(n: number) {
  return `${(n * 100).toFixed(2)}%`;
}

export function ClientsPage() {
  const [clienteId, setClienteId] = useState<string>("100");
  const [categoria, setCategoria] = useState<string>("Alimentos");
  const [k, setK] = useState<number>(10);
  const [nVecinos, setNVecinos] = useState<number>(10);

  const [loadingTopK, setLoadingTopK] = useState(false);
  const [loadingNeighbors, setLoadingNeighbors] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [topk, setTopk] = useState<TopKResponse | null>(null);
  const [neighbors, setNeighbors] = useState<NeighborsResponse | null>(null);

  async function fetchTopK() {
    setLoadingTopK(true);
    setError(null);
    try {
      const url = new URL("/probabilidad/topk-categoria", API_BASE);
      url.searchParams.set("cliente_id", clienteId.trim());
      url.searchParams.set("categoria", categoria.trim());
      url.searchParams.set("k", String(k));
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(await res.text());
      const data: TopKResponse = await res.json();
      setTopk(data);
    } catch (e: any) {
      setError(e?.message ?? "Error al obtener Top-K");
      setTopk(null);
    } finally {
      setLoadingTopK(false);
    }
  }

  async function fetchNeighbors() {
    setLoadingNeighbors(true);
    setError(null);
    try {
      const url = new URL("/similares/categoria", API_BASE);
      url.searchParams.set("cliente_id", clienteId.trim());
      url.searchParams.set("categoria", categoria.trim());
      url.searchParams.set("n", String(nVecinos));
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(await res.text());
      const data: NeighborsResponse = await res.json();
      setNeighbors(data);
    } catch (e: any) {
      setError(e?.message ?? "Error al obtener vecinos similares");
      setNeighbors(null);
    } finally {
      setLoadingNeighbors(false);
    }
  }

  async function handleBuscar(e: React.FormEvent) {
    e.preventDefault();
    await Promise.all([fetchTopK(), fetchNeighbors()]);
  }

  const maxProb = useMemo(() => (topk?.values?.length ? Math.max(...topk.values) : 1), [topk]);
  const maxScore = useMemo(() => (neighbors?.values?.length ? Math.max(...neighbors.values) : 1), [neighbors]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <TypographyH2>Clientes</TypographyH2>

      {/* --- Filtros --- */}
      <form onSubmit={handleBuscar} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Cliente ID</label>
          <input
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="border rounded-lg px-3 py-2"
            placeholder="Ej: 100"
            required
          />
        </div>
        <div className="flex flex-col md:col-span-2">
          <label className="text-sm text-gray-600">Categoría secundaria</label>
          <input
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="border rounded-lg px-3 py-2"
            placeholder="Ej: Alimentos"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Top-K productos</label>
          <input
            type="number"
            min={1}
            max={50}
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            className="border rounded-lg px-3 py-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Vecinos similares</label>
          <input
            type="number"
            min={1}
            max={50}
            value={nVecinos}
            onChange={(e) => setNVecinos(Number(e.target.value))}
            className="border rounded-lg px-3 py-2"
          />
        </div>
        <div className="md:col-span-5">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:opacity-90"
          >
            {loadingTopK || loadingNeighbors ? "Cargando…" : "Buscar"}
          </button>
          {error && <span className="ml-3 text-red-600 text-sm">{String(error)}</span>}
        </div>
      </form>

      {/* --- Visualizaciones --- */}
      <section className="grid md:grid-cols-2 gap-6">
        {/* --- Top-K productos --- */}
        <div className="rounded-2xl border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Top-K productos probables</h2>
            {topk && <span className="text-xs text-gray-500">{topk.key}</span>}
          </div>

          {loadingTopK && <p className="text-sm text-gray-500 mt-3">Cargando Top-K…</p>}
          {!loadingTopK && !topk && <p className="text-sm text-gray-500 mt-3">Sin datos. Ejecuta una búsqueda.</p>}

          {topk && (
            <ul className="mt-4 space-y-2">
              {topk.topk.map((t, i) => (
                <li key={`${t.item}-${i}`} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="truncate pr-2">{t.item}</span>
                    <span className="tabular-nums">{pct(t.prob)}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-blue-500"
                      style={{ width: `${(t.prob / (maxProb || 1)) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* --- Vecinos similares --- */}
        <div className="rounded-2xl border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Vecinos similares</h2>
            {neighbors && <span className="text-xs text-gray-500">{neighbors.key}</span>}
          </div>

          {loadingNeighbors && <p className="text-sm text-gray-500 mt-3">Cargando vecinos…</p>}
          {!loadingNeighbors && !neighbors && <p className="text-sm text-gray-500 mt-3">Sin datos. Ejecuta una búsqueda.</p>}

          {neighbors && (
            <ul className="mt-4 space-y-2">
              {neighbors.neighbors.map((nb, i) => (
                <li key={`${nb.key}-${i}`} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="truncate pr-2">{nb.key}</span>
                    <span className="tabular-nums">{pct(nb.score)}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-emerald-500"
                      style={{ width: `${(nb.score / (maxScore || 1)) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
