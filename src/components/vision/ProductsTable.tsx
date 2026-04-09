import React from "react";

type Product = {
  sku: string;
  descripcion: string;
  expected_units: number;
  observed_units: number;
  difference_units: number;
  status: string;
};

export function ProductsTable({ products }: { products: Product[] }) {
  const filtered = products.filter((p) => p.status !== "matched");

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-3">Productos con diferencias</h2>

      <div className="overflow-auto border rounded-2xl">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">SKU</th>
              <th className="p-2">Descripción</th>
              <th className="p-2">Esperado</th>
              <th className="p-2">Detectado</th>
              <th className="p-2">Diferencia</th>
              <th className="p-2">Estado</th>
            </tr>
          </thead>

          <tbody>
            {filtered.slice(0, 50).map((p) => (
              <tr key={p.sku} className="border-t">
                <td className="p-2">{p.sku}</td>
                <td className="p-2">{p.descripcion}</td>
                <td className="p-2">{p.expected_units}</td>
                <td className="p-2">{p.observed_units}</td>
                <td className="p-2">{p.difference_units}</td>
                <td className="p-2">{renderStatus(p.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function renderStatus(status: string) {
  const map: Record<string, string> = {
    missing: "🔴 Faltante",
    partial: "🟡 Parcial",
    matched: "🟢 OK",
    excess: "🟣 Exceso",
  };

  return map[status] || status;
}