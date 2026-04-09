import {
  ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend
} from 'recharts';

const PALETTE = ['#5563DE','#22A094','#E86F51','#CC66D3','#E0B020','#5DA0F0','#A3D179','#F28DB2','#7C5CFC','#00B894'];

function boolPretty(v: any) {
  if (v === true || v === 'True') return 'Sí';
  if (v === false || v === 'False') return 'No';
  return String(v ?? '-');
}
function labelPretty(k: string) {
  const map: Record<string,string> = {
    cliente_id: 'cliente_id',
    edad: 'edad',
    region: 'región',
    nivel_ingreso_estimado: 'nivel_ingreso',
    nivel_fidelizacion: 'nivel_fidelización',
    tipo_dieta: 'tipo_dieta',
    interes_salud_bienestar: 'salud_bienestar',
    practica_deporte: 'práctica_deporte',
    mascotas: 'mascotas',
    nivel_digitalizacion: 'nivel_digitalización',
    usa_app_compras: 'usa_app_compras',
    orientacion_consumo: 'orientación_consumo',
  };
  return map[k] ?? k;
}

type Punto = {
  cliente_id: number | null;
  cluster: number;
  x: number;
  y: number;
  meta: Record<string, any>;
};

export default function SegmentacionScatter({
  data,
  clustersInfo,
  pc1Label = 'PC1',
  pc2Label = 'PC2',
}: {
  data: Punto[];
  clustersInfo?: Record<string, { n: number }>;
  pc1Label?: string;
  pc2Label?: string;
}) {
  // Agrupar por cluster para colorear y legend
  const series: Record<number, Punto[]> = {};
  data.forEach(p => { (series[p.cluster] ??= []).push(p); });

  const legendPayload = Object.keys(series).map(k => {
    const idx = Number(k);
    const n = clustersInfo?.[k]?.n ?? series[idx].length;
    return { value: `Cluster ${k} (n=${n})`, id: k, type: 'circle' as const, color: PALETTE[idx % PALETTE.length] };
  });

  return (
    <ResponsiveContainer width="100%" height={560}>
      <ScatterChart margin={{ top: 10, right: 10, bottom: 24, left: 12 }}>
        <CartesianGrid stroke="#e9ecef" strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="x"
          name={pc1Label}
          domain={['dataMin - 0.2', 'dataMax + 0.2']}
          tickCount={7}
          tickFormatter={(v:number)=>Number.isFinite(v) ? v.toFixed(1) : ''}
          label={{ value: pc1Label, position: 'insideBottom', offset: -12 }}
        />
        <YAxis
          type="number"
          dataKey="y"
          name={pc2Label}
          domain={['dataMin - 0.2', 'dataMax + 0.2']}
          tickCount={7}
          tickFormatter={(v:number)=>Number.isFinite(v) ? v.toFixed(1) : ''}
          label={{ value: pc2Label, angle: -90, position: 'insideLeft' }}
        />
        <Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const p = payload[0].payload as Punto;
            const m = p.meta || {};
            const topKeys = [
              'cliente_id','cluster','edad','region','nivel_ingreso_estimado',
              'nivel_fidelizacion','orientacion_consumo','tipo_dieta',
              'interes_salud_bienestar','practica_deporte','mascotas',
              'nivel_digitalizacion','usa_app_compras'
            ];
            return (
              <div className="bg-white p-3 shadow rounded text-xs leading-4 max-w-[260px]">
                <div className="font-bold mb-1">Cliente: {p.cliente_id ?? '-'}</div>
                {topKeys.map(k => (
                  <div key={k}><b>{labelPretty(k)}:</b> {boolPretty((p as any)[k] ?? m[k])}</div>
                ))}
              </div>
            );
          }}
        />
        <Legend payload={legendPayload} />
        {Object.entries(series).map(([k, points]) => (
          <Scatter
            key={k}
            data={points}
            fill={PALETTE[Number(k) % PALETTE.length]}
            opacity={0.78}
            r={3.5}
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
}
