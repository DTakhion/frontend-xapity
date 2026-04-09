// Tipos del endpoint que envías
/* export type CrossSellKpi = {
  campana_id: string;
  limit: number;
  total_coocurrencias: number;
  top_productos_cross_sell: Array<{
    producto_id: number | string;
    descripcion: string;
    compras_junto_campana: number;
    clientes_unicos: number;
    participacion: number; // %
  }>;
  nota: string;
};

export async function getCrossSellCampana(campanaId?: string): Promise<CrossSellKpi> {
  const url = campanaId
    ? `/kpi/cross_sell_campana?campana_id=${encodeURIComponent(campanaId)}`
    : `/kpi/cross_sell_campana`;
  const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
  if (!res.ok) throw new Error(`Error ${res.status} al leer cross_sell_campana`);
  return res.json();
}

// Normaliza para Recharts (categoría = producto)
export function normalizeCrossSellForBars(data: CrossSellKpi) {
  const rows = data.top_productos_cross_sell.map((p) => ({
    producto: p.descripcion?.trim() || String(p.producto_id),
    compras: p.compras_junto_campana,
    clientes: p.clientes_unicos,
    participacion: p.participacion, // para alternativa de pie/stack-100
  }));
  return rows;
}   */

  // src/services/kpiCrossSell.ts

export type CrossSellItem = {
  producto_id: number | string;
  descripcion: string;
  compras_junto_campana: number;
  clientes_unicos: number;
  participacion: number; // %
};
export type CrossSellKpi = {
  campana_id: string;
  limit: number;
  total_coocurrencias: number;
  top_productos_cross_sell: CrossSellItem[];
  participacion_widget?: {
    participacion_pct?: number;             // 0..1
    clientes_con_cross_sell?: number;       // numerador
    clientes_total_en_campana?: number;     // denominador
  };
  nota: string;
};

// ---- Resolución de endpoint (auto) -----------------------------------------
// Si VITE_API_BASE_URL está seteado, se usa tal cual (https://mi-backend).
// Si NO está, en desarrollo prefijamos "/api" (proxy de Vite).
const RAW_BASE = (import.meta as any)?.env?.VITE_API_BASE_URL ?? "";
const API_BASE = String(RAW_BASE).trim().replace(/^['"]|['"]$/g, "").replace(/\s+/g, "").replace(/\/+$/, "");
const PREFIX = API_BASE || (import.meta.env.MODE === "development" ? "/api" : "");

function buildUrl(campanaId?: string, limit = 5) {
  const qs = new URLSearchParams();
  if (campanaId) qs.set("campana_id", String(campanaId));
  qs.set("limit", String(limit));
  // Nota: prefix ya incluye "" (producción s/ base) o "/api" (dev) o "https://..."
  return `${PREFIX}/kpi/cross_sell_campana?${qs.toString()}`;
}

// ---- Servicio principal -----------------------------------------------------
export async function getCrossSellCampana(
  campanaId?: string,
  limit = 5
): Promise<CrossSellKpi & { _pie_pct: number; _pie_num: number; _pie_den: number }> {
  const url = buildUrl(campanaId, limit);
  const res = await fetch(url, { method: "GET" });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET ${url} -> ${res.status} ${res.statusText}\n${text}`);
  }

  const json: CrossSellKpi = await res.json();

  const w = json?.participacion_widget ?? {};
  const frac = typeof w.participacion_pct === "number" && isFinite(w.participacion_pct) ? w.participacion_pct : 0;
  const num  = typeof w.clientes_con_cross_sell === "number" && isFinite(w.clientes_con_cross_sell) ? w.clientes_con_cross_sell : 0;
  const den  = typeof w.clientes_total_en_campana === "number" && isFinite(w.clientes_total_en_campana) ? w.clientes_total_en_campana : 0;
  const pct  = Math.max(0, Math.min(100, Math.round(frac * 100)));

  return {
    ...json,
    participacion_widget: {
      participacion_pct: frac,
      clientes_con_cross_sell: num,
      clientes_total_en_campana: den,
    },
    _pie_pct: pct,
    _pie_num: num,
    _pie_den: den,
  };
}

// (Opcional) normalizador para barras izquierdas
export function normalizeCrossSellForBars(data: CrossSellKpi) {
  const rows = Array.isArray(data?.top_productos_cross_sell) ? data.top_productos_cross_sell : [];
  return rows.map((p) => ({
    producto: (p.descripcion ?? String(p.producto_id)).trim() || String(p.producto_id),
    compras: Number(p.compras_junto_campana) || 0,
    clientes: Number(p.clientes_unicos) || 0,
    participacion: Number(p.participacion) || 0, // 0..100
  }));
}