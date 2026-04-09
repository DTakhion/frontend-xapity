import React from "react";

export function DetectedBarcodes({ detected }: { detected: any[] }) {
  if (!detected || detected.length === 0) return null;

  return (
    <div className="mt-6 p-4 border rounded-2xl bg-white shadow">
      <h2 className="font-semibold mb-2">Códigos detectados</h2>

      <ul className="text-sm">
        {detected.map((d, i) => (
          <li key={i}>• {d.barcode}</li>
        ))}
      </ul>
    </div>
  );
}