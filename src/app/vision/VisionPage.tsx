// import { useState } from "react";

// const API_BASE = "http://127.0.0.1:8000";

// type CaptureEvent = {
//   event_dir: string;
//   event_json?: string | null;
//   frame_path: string;
//   frame_url?: string | null;
//   readout_json?: string | null;
//   readout_json_url?: string | null;
//   readout_vis?: string | null;
//   readout_vis_url?: string | null;
// };

// type CaptureResponse = {
//   status?: string;
//   message?: string;
//   session_dir?: string;
//   session_dir_url?: string | null;
//   event?: CaptureEvent;
//   detail?: unknown;
// };

// type ProcessResponse = {
//   status?: string;
//   message?: string;
//   event?: {
//     event_dir: string;
//     frame_path?: string | null;
//     frame_url?: string | null;
//     readout_json?: string | null;
//     readout_json_url?: string | null;
//     readout_vis?: string | null;
//     readout_vis_url?: string | null;
//     closure_output?: string | null;
//     closure_output_url?: string | null;
//   };
//   session_state_json?: string | null;
//   session_state_json_url?: string | null;
//   frontend_summary?: unknown;
//   operator_feedback?: unknown;
//   session?: unknown;
//   closure_result?: unknown;
//   detail?: unknown;
// };

// type ResetResponse = {
//   status?: string;
//   message?: string;
//   session_state_json?: string | null;
//   session_state_json_url?: string | null;
//   session?: unknown;
//   detail?: unknown;
// };

// function buildAbsoluteUrl(pathOrUrl?: string | null): string | null {
//   if (!pathOrUrl) return null;

//   if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
//     return pathOrUrl;
//   }

//   if (pathOrUrl.startsWith("/")) {
//     return `${API_BASE}${pathOrUrl}`;
//   }

//   return `${API_BASE}/${pathOrUrl}`;
// }

// function extractErrorMessage(data: unknown, fallback: string): string {
//   if (!data) return fallback;

//   if (typeof data === "string") return data;

//   if (typeof data === "object" && data !== null) {
//     const obj = data as Record<string, unknown>;

//     if (typeof obj.error === "string") return obj.error;
//     if (typeof obj.message === "string") return obj.message;
//     if (typeof obj.detail === "string") return obj.detail;

//     if (obj.detail && typeof obj.detail === "object") {
//       try {
//         return JSON.stringify(obj.detail, null, 2);
//       } catch {
//         return fallback;
//       }
//     }
//   }

//   return fallback;
// }

// export default function VisionPage() {
//   const [captureLoading, setCaptureLoading] = useState(false);
//   const [processLoading, setProcessLoading] = useState(false);
//   const [resetLoading, setResetLoading] = useState(false);

//   const [error, setError] = useState<string | null>(null);

//   const [captureData, setCaptureData] = useState<CaptureResponse | null>(null);
//   const [processData, setProcessData] = useState<ProcessResponse | null>(null);
//   const [resetData, setResetData] = useState<ResetResponse | null>(null);

//   const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);
//   const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);

//   const handleCapture = async () => {
//     setCaptureLoading(true);
//     setError(null);
//     setResetData(null);
//     setProcessData(null);
//     setProcessedImageUrl(null);
//     setCapturedImageUrl(null);

//     try {
//       const response = await fetch(`${API_BASE}/vision/capture`, {
//         method: "POST",
//       });

//       const data: CaptureResponse = await response.json();
//       console.log("Capture response:", data);

//       if (!response.ok) {
//         throw new Error(extractErrorMessage(data, "Error en captura"));
//       }

//       setCaptureData(data);

//       const imageUrl =
//         buildAbsoluteUrl(data?.event?.frame_url) ??
//         buildAbsoluteUrl(data?.event?.frame_path) ??
//         null;

//       setCapturedImageUrl(imageUrl);
//     } catch (err) {
//       const msg =
//         err instanceof Error ? err.message : "Error desconocido en captura";
//       console.error("Error capturando:", msg);
//       setError(msg);
//     } finally {
//       setCaptureLoading(false);
//     }
//   };

//   const handleProcess = async () => {
//     if (!captureData?.event?.event_dir) {
//       setError("No hay una captura disponible para procesar.");
//       return;
//     }

//     setProcessLoading(true);
//     setError(null);
//     setResetData(null);
//     setProcessData(null);
//     setProcessedImageUrl(null);

//     try {
//       const response = await fetch(`${API_BASE}/vision/process`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           event_dir: captureData.event.event_dir,
//         }),
//       });

//       const data: ProcessResponse = await response.json();
//       console.log("Process response:", data);

//       if (!response.ok) {
//         throw new Error(extractErrorMessage(data, "Error al procesar captura"));
//       }

//       setProcessData(data);

//       const annotatedUrl =
//         buildAbsoluteUrl(data?.event?.readout_vis_url) ??
//         buildAbsoluteUrl(data?.event?.readout_vis) ??
//         null;

//       setProcessedImageUrl(annotatedUrl);
//     } catch (err) {
//       const msg =
//         err instanceof Error ? err.message : "Error desconocido en procesamiento";
//       console.error("Error procesando:", msg);
//       setError(msg);
//     } finally {
//       setProcessLoading(false);
//     }
//   };

//   const handleResetSession = async () => {
//     setResetLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(`${API_BASE}/vision/session/reset`, {
//         method: "POST",
//       });

//       const data: ResetResponse = await response.json();
//       console.log("Reset response:", data);

//       if (!response.ok) {
//         throw new Error(
//           extractErrorMessage(data, "Error al reiniciar sesión")
//         );
//       }

//       setResetData(data);
//       setCaptureData(null);
//       setProcessData(null);
//       setCapturedImageUrl(null);
//       setProcessedImageUrl(null);
//     } catch (err) {
//       const msg =
//         err instanceof Error
//           ? err.message
//           : "Error desconocido al reiniciar sesión";
//       console.error("Error reseteando sesión:", msg);
//       setError(msg);
//     } finally {
//       setResetLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>Vision Scanner</h1>

//       <div
//         style={{
//           display: "flex",
//           gap: 12,
//           marginTop: 16,
//           marginBottom: 16,
//         }}
//       >
//         <button
//           onClick={handleCapture}
//           disabled={captureLoading || processLoading || resetLoading}
//         >
//           {captureLoading ? "Capturando..." : "Capturar"}
//         </button>

//         <button
//           onClick={handleProcess}
//           disabled={
//             processLoading ||
//             captureLoading ||
//             resetLoading ||
//             !captureData?.event?.event_dir
//           }
//         >
//           {processLoading ? "Procesando..." : "Procesar"}
//         </button>

//         <button
//           onClick={handleResetSession}
//           disabled={resetLoading || captureLoading || processLoading}
//         >
//           {resetLoading ? "Reiniciando..." : "Reiniciar sesión"}
//         </button>
//       </div>

//       {error && (
//         <div style={{ marginTop: 20, color: "red", whiteSpace: "pre-wrap" }}>
//           {error}
//         </div>
//       )}

//       {capturedImageUrl && (
//         <div style={{ marginTop: 20 }}>
//           <h3>Imagen capturada</h3>
//           <img
//             src={capturedImageUrl}
//             alt="Captura"
//             width={500}
//             style={{
//               borderRadius: 10,
//               border: "1px solid #ddd",
//             }}
//           />
//         </div>
//       )}

//       {processedImageUrl && (
//         <div style={{ marginTop: 20 }}>
//           <h3>Imagen procesada</h3>
//           <img
//             src={processedImageUrl}
//             alt="Procesada"
//             width={500}
//             style={{
//               borderRadius: 10,
//               border: "1px solid #ddd",
//             }}
//           />
//         </div>
//       )}

//       {Boolean(processData?.frontend_summary) && (
//         <div style={{ marginTop: 24 }}>
//           <h3>Resumen frontend</h3>
//           <pre>{JSON.stringify(processData?.frontend_summary, null, 2)}</pre>
//         </div>
//       )}

//       {Boolean(processData?.operator_feedback) && (
//         <div style={{ marginTop: 24 }}>
//           <h3>Feedback operador</h3>
//           <pre>{JSON.stringify(processData?.operator_feedback, null, 2)}</pre>
//         </div>
//       )}

//       {captureData && (
//         <div style={{ marginTop: 24 }}>
//           <h3>Respuesta captura</h3>
//           <pre>{JSON.stringify(captureData, null, 2)}</pre>
//         </div>
//       )}

//       {processData && (
//         <div style={{ marginTop: 24 }}>
//           <h3>Respuesta procesamiento</h3>
//           <pre>{JSON.stringify(processData, null, 2)}</pre>
//         </div>
//       )}

//       {resetData && (
//         <div style={{ marginTop: 24 }}>
//           <h3>Respuesta reinicio sesión</h3>
//           <pre>{JSON.stringify(resetData, null, 2)}</pre>
//         </div>
//       )}
//     </div>
//   );
// }

import { useMemo, useState } from "react";
import { ClosureSummary } from "@/components/vision/ClosureSummary";
import { DetectedBarcodes } from "@/components/vision/DetectedBarcodes";
import { ProductsTable } from "@/components/vision/ProductsTable";

const API_BASE = "http://127.0.0.1:8000";

type CaptureEvent = {
  event_dir: string;
  event_json?: string | null;
  frame_path: string;
  frame_url?: string | null;
  readout_json?: string | null;
  readout_json_url?: string | null;
  readout_vis?: string | null;
  readout_vis_url?: string | null;
};

type CaptureResponse = {
  status?: string;
  message?: string;
  session_dir?: string;
  session_dir_url?: string | null;
  event?: CaptureEvent;
  detail?: unknown;
};

type ClosureResultData = {
  closure_status?: string;
  route?: string | null;
  counts?: Record<string, unknown>;
  totals?: Record<string, unknown>;
  flags?: Record<string, unknown>;
  products?: Array<Record<string, unknown>>;
  detected_items?: Array<Record<string, unknown>>;
  unknown_barcodes?: string[];
  [key: string]: unknown;
};

type ProcessResponse = {
  status?: string;
  message?: string;
  event?: {
    event_dir: string;
    frame_path?: string | null;
    frame_url?: string | null;
    readout_json?: string | null;
    readout_json_url?: string | null;
    readout_vis?: string | null;
    readout_vis_url?: string | null;
    closure_output?: string | null;
    closure_output_url?: string | null;
  };
  session_state_json?: string | null;
  session_state_json_url?: string | null;
  frontend_summary?: unknown;
  operator_feedback?: unknown;
  session?: unknown;
  closure_result?: ClosureResultData | unknown;
  detail?: unknown;
};

type ResetResponse = {
  status?: string;
  message?: string;
  session_state_json?: string | null;
  session_state_json_url?: string | null;
  session?: unknown;
  detail?: unknown;
};

function buildAbsoluteUrl(pathOrUrl?: string | null): string | null {
  if (!pathOrUrl) return null;

  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }

  if (pathOrUrl.startsWith("/")) {
    return `${API_BASE}${pathOrUrl}`;
  }

  return `${API_BASE}/${pathOrUrl}`;
}

function extractErrorMessage(data: unknown, fallback: string): string {
  if (!data) return fallback;

  if (typeof data === "string") return data;

  if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>;

    if (typeof obj.error === "string") return obj.error;
    if (typeof obj.message === "string") return obj.message;
    if (typeof obj.detail === "string") return obj.detail;

    if (obj.detail && typeof obj.detail === "object") {
      try {
        return JSON.stringify(obj.detail, null, 2);
      } catch {
        return fallback;
      }
    }
  }

  return fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function renderPrimitive(value: unknown): string {
  if (value === null || value === undefined) return "-";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function JsonBlock({
  title,
  data,
}: {
  title: string;
  data: unknown;
}) {
  if (!data) return null;

  return (
    <div style={styles.card}>
      <div style={styles.cardHeaderRow}>
        <h3 style={styles.cardTitle}>{title}</h3>
      </div>
      <pre style={styles.pre}>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

function SmartDataView({
  title,
  data,
}: {
  title: string;
  data: unknown;
}) {
  if (!data) return null;

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>{title}</h3>
          <div style={styles.mutedText}>Sin datos.</div>
        </div>
      );
    }

    const first = data[0];

    if (
      typeof first === "string" ||
      typeof first === "number" ||
      typeof first === "boolean"
    ) {
      return (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>{title}</h3>
          <ul style={styles.list}>
            {data.map((item, idx) => (
              <li key={idx} style={styles.listItem}>
                {renderPrimitive(item)}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (isRecord(first)) {
      const columns = Array.from(
        new Set(data.flatMap((row) => (isRecord(row) ? Object.keys(row) : [])))
      );

      return (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>{title}</h3>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col} style={styles.th}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIdx) => {
                  if (!isRecord(row)) return null;

                  return (
                    <tr key={rowIdx}>
                      {columns.map((col) => (
                        <td key={col} style={styles.td}>
                          {renderPrimitive(row[col])}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  }

  if (isRecord(data)) {
    return (
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>{title}</h3>
        <div style={styles.kvGrid}>
          {Object.entries(data).map(([key, value]) => (
            <div key={key} style={styles.kvCard}>
              <div style={styles.kvKey}>{key}</div>
              <div style={styles.kvValue}>{renderPrimitive(value)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <JsonBlock title={title} data={data} />;
}

function OperatorFeedbackView({ data }: { data: unknown }) {
  if (!data) return null;

  if (Array.isArray(data)) {
    return (
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Feedback operador</h3>
        <div style={styles.feedbackList}>
          {data.map((item, idx) => (
            <div key={idx} style={styles.feedbackItem}>
              {typeof item === "string" ||
              typeof item === "number" ||
              typeof item === "boolean" ? (
                renderPrimitive(item)
              ) : (
                <pre style={styles.preInline}>
                  {JSON.stringify(item, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isRecord(data)) {
    return (
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Feedback operador</h3>
        <div style={styles.kvGrid}>
          {Object.entries(data).map(([key, value]) => (
            <div key={key} style={styles.kvCard}>
              <div style={styles.kvKey}>{key}</div>
              <div style={styles.kvValue}>{renderPrimitive(value)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <JsonBlock title="Feedback operador" data={data} />;
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  if (!value) return null;

  return (
    <div style={styles.infoRow}>
      <span style={styles.infoLabel}>{label}</span>
      <span style={styles.infoValue}>{value}</span>
    </div>
  );
}

function ImagePanel({
  title,
  imageUrl,
  emptyText,
}: {
  title: string;
  imageUrl?: string | null;
  emptyText: string;
}) {
  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>{title}</h3>

      {imageUrl ? (
        <img src={imageUrl} alt={title} style={styles.image} />
      ) : (
        <div style={styles.emptyImageBox}>{emptyText}</div>
      )}
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <div style={styles.summaryCard}>
      <div style={styles.summaryTitle}>{title}</div>
      <div style={styles.summaryValue}>{value}</div>
      {subtitle ? <div style={styles.summarySubtitle}>{subtitle}</div> : null}
    </div>
  );
}

export default function VisionPage() {
  const [captureLoading, setCaptureLoading] = useState(false);
  const [processLoading, setProcessLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [captureData, setCaptureData] = useState<CaptureResponse | null>(null);
  const [processData, setProcessData] = useState<ProcessResponse | null>(null);
  const [resetData, setResetData] = useState<ResetResponse | null>(null);

  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);

  const hasCapture = Boolean(captureData?.event?.event_dir);
  const hasProcess = Boolean(processData?.event?.event_dir);

  const closureData = useMemo(() => {
    return isRecord(processData?.closure_result)
      ? (processData?.closure_result as ClosureResultData)
      : null;
  }, [processData?.closure_result]);

  const closureProducts = useMemo(() => {
    if (!closureData?.products || !Array.isArray(closureData.products)) return [];
    return closureData.products;
  }, [closureData]);

  const closureDetectedItems = useMemo(() => {
    if (!closureData?.detected_items || !Array.isArray(closureData.detected_items)) {
      return [];
    }
    return closureData.detected_items;
  }, [closureData]);

  const currentStatus = useMemo(() => {
    if (captureLoading) return "Capturando...";
    if (processLoading) return "Procesando...";
    if (resetLoading) return "Reiniciando sesión...";
    if (error) return "Con error";
    if (hasProcess) return "Procesado";
    if (hasCapture) return "Capturado";
    return "Listo";
  }, [captureLoading, processLoading, resetLoading, error, hasCapture, hasProcess]);

  const handleCapture = async () => {
    setCaptureLoading(true);
    setError(null);
    setResetData(null);
    setProcessData(null);
    setProcessedImageUrl(null);
    setCapturedImageUrl(null);

    try {
      const response = await fetch(`${API_BASE}/vision/capture`, {
        method: "POST",
      });

      const data: CaptureResponse = await response.json();
      console.log("Capture response:", data);

      if (!response.ok) {
        throw new Error(extractErrorMessage(data, "Error en captura"));
      }

      setCaptureData(data);

      const imageUrl =
        buildAbsoluteUrl(data?.event?.frame_url) ??
        buildAbsoluteUrl(data?.event?.frame_path) ??
        null;

      setCapturedImageUrl(imageUrl);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Error desconocido en captura";
      console.error("Error capturando:", msg);
      setError(msg);
    } finally {
      setCaptureLoading(false);
    }
  };

  const handleProcess = async () => {
    if (!captureData?.event?.event_dir) {
      setError("No hay una captura disponible para procesar.");
      return;
    }

    setProcessLoading(true);
    setError(null);
    setResetData(null);
    setProcessData(null);
    setProcessedImageUrl(null);

    try {
      const response = await fetch(`${API_BASE}/vision/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_dir: captureData.event.event_dir,
        }),
      });

      const data: ProcessResponse = await response.json();
      console.log("Process response:", data);

      if (!response.ok) {
        throw new Error(extractErrorMessage(data, "Error al procesar captura"));
      }

      setProcessData(data);

      const annotatedUrl =
        buildAbsoluteUrl(data?.event?.readout_vis_url) ??
        buildAbsoluteUrl(data?.event?.readout_vis) ??
        null;

      setProcessedImageUrl(annotatedUrl);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Error desconocido en procesamiento";
      console.error("Error procesando:", msg);
      setError(msg);
    } finally {
      setProcessLoading(false);
    }
  };

  const handleResetSession = async () => {
    setResetLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/vision/session/reset`, {
        method: "POST",
      });

      const data: ResetResponse = await response.json();
      console.log("Reset response:", data);

      if (!response.ok) {
        throw new Error(extractErrorMessage(data, "Error al reiniciar sesión"));
      }

      setResetData(data);
      setCaptureData(null);
      setProcessData(null);
      setCapturedImageUrl(null);
      setProcessedImageUrl(null);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error desconocido al reiniciar sesión";
      console.error("Error reseteando sesión:", msg);
      setError(msg);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.headerBlock}>
        <div>
          <h1 style={styles.title}>Kuhne+Nagel Vision Scanner</h1>
          <p style={styles.subtitle}>
            Flujo manual del MvP: capturar, procesar y revisar resultados.
          </p>
        </div>

        <div style={styles.statusBadge}>
          Estado actual: <strong>{currentStatus}</strong>
        </div>
      </div>

      <div style={styles.actionsCard}>
        <div style={styles.actionsHeader}>
          <h2 style={styles.sectionTitle}>Acciones</h2>
          <span style={styles.actionsHint}>
            Ejecuta el flujo en orden: captura → procesamiento
          </span>
        </div>

        <div style={styles.buttonRow}>
          <button
            onClick={handleCapture}
            disabled={captureLoading || processLoading || resetLoading}
            style={{
              ...styles.button,
              ...styles.primaryButton,
              opacity: captureLoading || processLoading || resetLoading ? 0.6 : 1,
              cursor:
                captureLoading || processLoading || resetLoading
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {captureLoading ? "Capturando..." : "1. Capturar"}
          </button>

          <button
            onClick={handleProcess}
            disabled={
              processLoading ||
              captureLoading ||
              resetLoading ||
              !captureData?.event?.event_dir
            }
            style={{
              ...styles.button,
              ...styles.secondaryButton,
              opacity:
                processLoading ||
                captureLoading ||
                resetLoading ||
                !captureData?.event?.event_dir
                  ? 0.6
                  : 1,
              cursor:
                processLoading ||
                captureLoading ||
                resetLoading ||
                !captureData?.event?.event_dir
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {processLoading ? "Procesando..." : "2. Procesar"}
          </button>

          <button
            onClick={handleResetSession}
            disabled={resetLoading || captureLoading || processLoading}
            style={{
              ...styles.button,
              ...styles.ghostButton,
              opacity: resetLoading || captureLoading || processLoading ? 0.6 : 1,
              cursor:
                resetLoading || captureLoading || processLoading
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {resetLoading ? "Reiniciando..." : "Reiniciar sesión"}
          </button>
        </div>
      </div>

      {error && (
        <div style={styles.errorBox}>
          <div style={styles.errorTitle}>Error</div>
          <div style={{ whiteSpace: "pre-wrap" }}>{error}</div>
        </div>
      )}

      <div style={styles.summaryGrid}>
        <SummaryCard
          title="Captura"
          value={hasCapture ? "Disponible" : "Pendiente"}
          subtitle={captureData?.message ?? "Sin captura todavía"}
        />
        <SummaryCard
          title="Procesamiento"
          value={hasProcess ? "Disponible" : "Pendiente"}
          subtitle={processData?.message ?? "Sin procesamiento todavía"}
        />
        <SummaryCard
          title="Evento actual"
          value={captureData?.event?.event_dir ? "Sí" : "No"}
          subtitle={captureData?.event?.event_dir ?? "Aún no generado"}
        />
      </div>

      <div style={styles.grid2}>
        <ImagePanel
          title="Imagen capturada"
          imageUrl={capturedImageUrl}
          emptyText="Aquí aparecerá la imagen capturada del evento."
        />

        <ImagePanel
          title="Imagen con detección / readout"
          imageUrl={processedImageUrl}
          emptyText="Aquí aparecerá la visualización procesada cuando ejecutes el readout."
        />
      </div>

      <div style={styles.grid2}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Datos principales de captura</h3>
          <InfoRow label="Event dir" value={captureData?.event?.event_dir} />
          <InfoRow label="Frame path" value={captureData?.event?.frame_path} />
          <InfoRow label="Event json" value={captureData?.event?.event_json} />
          <InfoRow label="Session dir" value={captureData?.session_dir} />
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Datos principales de procesamiento</h3>
          <InfoRow label="Readout json" value={processData?.event?.readout_json} />
          <InfoRow label="Readout vis" value={processData?.event?.readout_vis} />
          <InfoRow
            label="Closure output"
            value={processData?.event?.closure_output}
          />
          <InfoRow
            label="Session state json"
            value={processData?.session_state_json}
          />
        </div>
      </div>

      {closureData && (
        <div style={styles.grid1}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Resumen operativo</h3>
            <div style={styles.componentBlock}>
              <ClosureSummary data={closureData} />
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Códigos detectados</h3>
            <div style={styles.componentBlock}>
              <DetectedBarcodes detected={closureDetectedItems} />
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Productos con diferencias</h3>
            <div style={styles.componentBlock}>
              <ProductsTable products={closureProducts as never[]} />
            </div>
          </div>
        </div>
      )}

      <div style={styles.grid1}>
        <SmartDataView
          title="Resumen frontend"
          data={processData?.frontend_summary}
        />

        <OperatorFeedbackView data={processData?.operator_feedback} />

        <JsonBlock
          title="Closure result (debug)"
          data={processData?.closure_result}
        />

        <JsonBlock
          title="Session"
          data={processData?.session ?? resetData?.session}
        />
      </div>

      <div style={styles.grid1}>
        <JsonBlock title="Respuesta captura" data={captureData} />
        <JsonBlock title="Respuesta procesamiento" data={processData} />
        <JsonBlock title="Respuesta reinicio sesión" data={resetData} />
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: 24,
    background: "#f6f8fb",
    minHeight: "100vh",
    color: "#18212f",
  },
  headerBlock: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  title: {
    margin: 0,
    fontSize: 30,
    fontWeight: 700,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 0,
    color: "#5d6b82",
    fontSize: 15,
  },
  statusBadge: {
    border: "1px solid #cfd7e3",
    background: "#ffffff",
    borderRadius: 12,
    padding: "10px 14px",
    fontSize: 14,
    boxShadow: "0 2px 8px rgba(16, 24, 40, 0.04)",
  },
  actionsCard: {
    background: "#ffffff",
    border: "1px solid #d9e1ec",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    boxShadow: "0 4px 14px rgba(16, 24, 40, 0.05)",
  },
  actionsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 16,
  },
  actionsHint: {
    fontSize: 13,
    color: "#66758c",
  },
  sectionTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
  },
  buttonRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
  button: {
    minWidth: 180,
    padding: "12px 16px",
    borderRadius: 12,
    border: "1px solid",
    fontSize: 15,
    fontWeight: 700,
    transition: "all 0.2s ease",
    background: "#fff",
  },
  primaryButton: {
    borderColor: "#1d4ed8",
    color: "#ffffff",
    background: "#2563eb",
  },
  secondaryButton: {
    borderColor: "#0f766e",
    color: "#ffffff",
    background: "#0f766e",
  },
  ghostButton: {
    borderColor: "#c0cada",
    color: "#253247",
    background: "#ffffff",
  },
  errorBox: {
    marginBottom: 20,
    background: "#fff1f2",
    border: "1px solid #fecdd3",
    color: "#9f1239",
    borderRadius: 14,
    padding: 16,
  },
  errorTitle: {
    fontWeight: 700,
    marginBottom: 6,
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
    marginBottom: 20,
  },
  summaryCard: {
    background: "#ffffff",
    border: "1px solid #d9e1ec",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 3px 12px rgba(16, 24, 40, 0.04)",
  },
  summaryTitle: {
    fontSize: 13,
    color: "#637289",
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 6,
  },
  summarySubtitle: {
    fontSize: 13,
    color: "#6c7b91",
    wordBreak: "break-word",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
    gap: 16,
    marginBottom: 20,
  },
  grid1: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 16,
    marginBottom: 20,
  },
  card: {
    background: "#ffffff",
    border: "1px solid #d9e1ec",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 4px 14px rgba(16, 24, 40, 0.05)",
  },
  cardHeaderRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  cardTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
  },
  image: {
    width: "100%",
    maxHeight: 520,
    objectFit: "contain",
    borderRadius: 12,
    border: "1px solid #d8e0eb",
    background: "#f8fafc",
  },
  emptyImageBox: {
    minHeight: 280,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    border: "1px dashed #c9d3e1",
    background: "#f8fafc",
    color: "#718198",
    textAlign: "center",
    padding: 20,
  },
  infoRow: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    padding: "10px 0",
    borderBottom: "1px solid #edf1f6",
  },
  infoLabel: {
    fontSize: 12,
    color: "#728199",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  infoValue: {
    fontSize: 14,
    color: "#1f2937",
    wordBreak: "break-word",
  },
  pre: {
    margin: 0,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    overflowX: "auto",
    background: "#0f172a",
    color: "#e2e8f0",
    borderRadius: 12,
    padding: 14,
    fontSize: 13,
    lineHeight: 1.45,
  },
  preInline: {
    margin: 0,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    overflowX: "auto",
    color: "#1e293b",
    fontSize: 13,
    lineHeight: 1.45,
    background: "transparent",
  },
  mutedText: {
    color: "#6c7b91",
    fontSize: 14,
  },
  list: {
    margin: 0,
    paddingLeft: 20,
  },
  listItem: {
    marginBottom: 8,
    color: "#1f2937",
  },
  tableWrapper: {
    overflowX: "auto",
    border: "1px solid #e5eaf1",
    borderRadius: 12,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14,
  },
  th: {
    textAlign: "left",
    padding: "12px 10px",
    background: "#f8fafc",
    borderBottom: "1px solid #e5eaf1",
    color: "#334155",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #eef2f7",
    color: "#1f2937",
    verticalAlign: "top",
  },
  kvGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
  },
  kvCard: {
    border: "1px solid #e5eaf1",
    borderRadius: 12,
    padding: 12,
    background: "#f8fafc",
  },
  kvKey: {
    fontSize: 12,
    fontWeight: 700,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  kvValue: {
    fontSize: 14,
    color: "#0f172a",
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
  },
  feedbackList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  feedbackItem: {
    border: "1px solid #dbe7ff",
    background: "#f8fbff",
    borderRadius: 12,
    padding: 12,
    color: "#1e3a8a",
  },
  componentBlock: {
    marginTop: 8,
  },
};