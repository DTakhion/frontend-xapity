import React from "react";

type ClosureData = any;

export function ClosureSummary({ data }: { data: ClosureData }) {
  if (!data) return null;

  const statusMap: Record<string, string> = {
    no_detection: "🔴 Sin detección",
    partial: "🟡 Parcial",
    complete: "🟢 Completo",
  };

  const status = statusMap[data.closure_status] || data.closure_status;

  return (
    <div className="space-y-4">
      {/* STATUS */}
      <div className="p-4 rounded-2xl shadow bg-white border">
        <h2 className="text-lg font-semibold mb-2">Estado</h2>
        <p className="text-xl">{status}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi title="Productos esperados" value={data.counts.expected_products} />
        <Kpi title="Detectados" value={data.counts.matched_products} />
        <Kpi title="Faltantes" value={data.counts.missing_products} />
        <Kpi title="Códigos desconocidos" value={data.counts.unknown_barcodes} />
      </div>

      {/* UNIDADES */}
      <div className="grid grid-cols-2 gap-4">
        <Kpi title="Unidades esperadas" value={data.totals.expected_units} />
        <Kpi title="Unidades detectadas" value={data.totals.observed_units} />
      </div>

      {/* ALERTAS */}
      {data.flags?.has_unknown_barcodes && (
        <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-300">
          <p className="font-semibold">⚠️ Códigos no reconocidos</p>
          <ul className="text-sm mt-2">
            {data.unknown_barcodes.map((b: string) => (
              <li key={b}>• {b}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Kpi({ title, value }: { title: string; value: number }) {
  return (
    <div className="p-4 rounded-2xl shadow bg-white border">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}