// src/services/topProductosService.ts
const BASE = import.meta.env.VITE_API_BASE_URL;

export async function getTopProductosCampana(limit = 4, rank_by: "compras" | "penetracion" = "compras") {
  const params = new URLSearchParams({ limit: String(limit), rank_by });
  const url = `${BASE}/kpi/top_productos_campana?${params}`;
  const res = await fetch(url);
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`GET ${url} -> ${res.status} ${txt}`);
  }
  return res.json();
}
