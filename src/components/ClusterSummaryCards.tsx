// ClusterSummaryCards.tsx

// Mantén la misma paleta que el scatter (duplica aquí para no tocar el otro archivo)
const PALETTE = ['#5563DE','#22A094','#E86F51','#CC66D3','#E0B020','#5DA0F0','#A3D179','#F28DB2','#7C5CFC','#00B894'];

type ClusterInfo = {
  n: number;
  numeric_means?: Record<string, number>;
  categorical_top?: Record<string, Array<{ value: string; count: number }>>;
};
type Props = {
  clusters: Record<string, ClusterInfo>;
  total: number; // total de puntos (para %)
};

function topVal(ci: ClusterInfo, key: string, fallback = '—') {
  const arr = ci.categorical_top?.[key];
  return arr && arr.length ? String(arr[0].value) : fallback;
}
function mean(ci: ClusterInfo, key: string, digits = 1) {
  const v = ci.numeric_means?.[key];
  return Number.isFinite(v) ? (v as number).toFixed(digits) : '—';
}

export default function ClusterSummaryCards({ clusters, total }: Props) {
  const entries = Object.entries(clusters).sort((a, b) => Number(a[0]) - Number(b[0]));

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mb-4">
      {entries.map(([k, info]) => {
        const pct = total > 0 ? Math.round((info.n / total) * 100) : 0;
        const color = PALETTE[Number(k) % PALETTE.length];

        return (
          <div
            key={k}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <h3 className="font-semibold">Cluster {k}</h3>
              </div>
              <span className="text-xs text-gray-500">{pct}% del total</span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="text-gray-500">Tamaño</div>
              <div className="font-medium">{info.n}</div>

              <div className="text-gray-500">Edad (media)</div>
              <div className="font-medium">{mean(info, 'edad')}</div>

              <div className="text-gray-500">Fidelización</div>
              <div className="font-medium">{topVal(info, 'nivel_fidelizacion')}</div>

              <div className="text-gray-500">Orientación</div>
              <div className="font-medium">{topVal(info, 'orientacion_consumo')}</div>

              <div className="text-gray-500">Tipo dieta</div>
              <div className="font-medium">{topVal(info, 'tipo_dieta')}</div>

              <div className="text-gray-500">Apertura msgs (avg)</div>
              <div className="font-medium">{mean(info, 'tasa_apertura_mensajes', 2)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
