// import { useState } from "react";
// //Agregado por felixOrtiz,14/03
// type Message = {
//   role: "user" | "assistant";
//   content: string;
// };

// export default function XapityPage() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [prompt, setPrompt] = useState("");
//   const [loading, setLoading] = useState(false);

//   const sendPrompt = async () => {
//     if (!prompt.trim()) return;

//     const userMessage: Message = {
//       role: "user",
//       content: prompt,
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setPrompt("");
//     setLoading(true);

//     try {

//       //const url = `${PREFIX}/llm/generate`

//       const API_URL = import.meta.env.VITE_XAPITY_API_URL;
//       const res = await fetch(`${API_URL}/llm/generate`,{
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           prompt: userMessage.content,
//           temperature: 0.2,
//         }),
//       });

//       if (!res.ok) {
//         throw new Error("Error en la respuesta del servidor");
//         }

//       const data = await res.json();

//       const assistantMessage: Message = {
//         role: "assistant",
//         content: data?.llm?.response ?? "Sin respuesta del modelo",
//       };

//       setMessages((prev) => [...prev, assistantMessage]);
//     } catch (err) {
//       setMessages((prev) => [
//         ...prev,
//         { role: "assistant", content: "Error conectando con Xapity" },
//       ]);
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="flex flex-col h-[80vh] max-w-3xl mx-auto">

//       <h1 className="text-2xl font-bold mb-4">
//         Xapity Conversational AI
//       </h1>

//       {/* Chat */}
//       <div className="flex-1 overflow-y-auto border rounded-lg p-4 space-y-4 bg-white">

//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             className={`flex ${
//               msg.role === "user" ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`px-4 py-2 rounded-lg max-w-[70%] ${
//                 msg.role === "user"
//                   ? "bg-blue-500 text-white"
//                   : "bg-gray-200"
//               }`}
//             >
//               {msg.content}
//             </div>
//           </div>
//         ))}

//         {loading && (
//           <div className="text-sm text-gray-500">
//             Xapity está pensando...
//           </div>
//         )}
//       </div>

//       {/* Input */}
//       <div className="flex gap-2 mt-4">
//         <input
//           value={prompt}
//           onChange={(e) => setPrompt(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === "Enter"){
//                 sendPrompt();
//             }
//           }}
//           className="flex-1 border rounded-lg px-3 py-2"
//           placeholder="Escribe tu consulta..."
//         />

//         <button
//           onClick={sendPrompt}
//           disabled={loading}
//           className="bg-black text-white px-4 py-2 rounded-lg"
//         >
//           Enviar
//         </button>
//       </div>
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import {
  Bot,
  CalendarCheck,
  Loader2,
  Send,
  Sparkles,
  User,
  WalletCards,
  Wrench,
} from "lucide-react";

type XapityIntent =
  | "greeting"
  | "farewell"
  | "list_services"
  | "sales_total"
  | "create_appointment"
  | "staff_by_service"
  | "unknown";

type XapityChatResponse = {
  request_id: string;
  message: string;
  analysis: {
    intent: XapityIntent;
    confidence: number;
    is_ambiguous: boolean;
    has_noise: boolean;
    needs_clarification: boolean;
  };
  reply: string;
  data?: any;
  metadata?: {
    classifier_version?: string | null;
    detection_source?: string | null;
    model_name?: string | null;
  } | null;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  response?: XapityChatResponse;
};

const API_URL =
  import.meta.env.VITE_XAPITY_API_URL ?? "http://127.0.0.1:8000";

function getIntentLabel(intent: XapityIntent) {
  const labels: Record<XapityIntent, string> = {
    greeting: "Saludo",
    farewell: "Despedida",
    list_services: "Servicios",
    sales_total: "Ventas",
    create_appointment: "Agenda",
    staff_by_service: "Staff por servicio",
    unknown: "Sin clasificar",
  };

  return labels[intent];
}

function getIntentIcon(intent: XapityIntent) {
  if (intent === "list_services") return <Wrench className="h-4 w-4" />;
  if (intent === "sales_total") return <WalletCards className="h-4 w-4" />;
  if (intent === "create_appointment")
    return <CalendarCheck className="h-4 w-4" />;
  if (intent === "staff_by_service")
    return <CalendarCheck className="h-4 w-4" />;

  return <Sparkles className="h-4 w-4" />;

}

export default function XapityPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "Hola, soy Xapity. Puedo ayudarte a revisar servicios, consultar ventas o intentar agendar una reserva.",
    },
  ]);

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const suggestions = [
    "¿Qué servicios tienes disponibles?",
    "¿Qué staff tienes para mantenimiento de robots TI8000?",
    "¿Qué staff tienes para mantenimiento de robots TI8000 el martes 12 de mayo a las 10?",
    "Necesito agendar mantenimiento de robots TI8000 para el martes 12 de mayo a las 10",
    "¿Cuál fue el total de ventas del mes pasado?",
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendPrompt = async (customPrompt?: string) => {
    const finalPrompt = (customPrompt ?? prompt).trim();

    if (!finalPrompt || loading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: finalPrompt,
    };

    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/xapity/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: finalPrompt,
        }),
      });

      if (!res.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const data: XapityChatResponse = await res.json();

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply ?? "Sin respuesta de Xapity",
        response: data,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "No pude conectar con Xapity. Revisa que el backend esté levantado y que la URL del entorno sea correcta.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderStructuredData = (response?: XapityChatResponse) => {
    if (!response?.data) return null;

    const { intent } = response.analysis;

    if (intent === "list_services" && Array.isArray(response.data.items)) {
      return (
        <div className="mt-3 grid gap-2">
          {response.data.items.slice(0, 4).map((service: any) => (
            <div
              key={service.serviceId ?? service._id}
              className="rounded-xl border bg-white p-3 text-sm shadow-sm"
            >
              <div className="font-semibold text-slate-900">
                {service.name}
              </div>

              {service.category && (
                <div className="text-xs text-slate-500">
                  {service.category}
                </div>
              )}

              {service.description && (
                <p className="mt-1 text-slate-600">{service.description}</p>
              )}

              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                {service.durationMinutes && (
                  <span>{service.durationMinutes} min</span>
                )}

                {typeof service.basePrice === "number" && (
                  <span>${service.basePrice.toLocaleString("es-CL")}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (intent === "sales_total") {
      return (
        <div className="mt-3 rounded-xl border bg-white p-3 text-sm shadow-sm">
          <div className="text-xs font-medium uppercase text-slate-500">
            Resumen de ventas
          </div>

          <div className="mt-1 text-xl font-bold text-slate-900">
            {response.data.totalIngresosVentaFormatted}
          </div>

          <div className="mt-1 text-xs text-slate-500">
            Periodo: {response.data.startDate} al {response.data.endDate}
          </div>

          <div className="text-xs text-slate-500">
            Documentos: {response.data.totalDocumentos}
          </div>
        </div>
      );
    }

    if (intent === "staff_by_service") {
      if (response.data.serviceFound === false) {
        return (
          <div className="mt-3 rounded-xl border bg-amber-50 p-3 text-sm text-amber-900">
            <div className="font-semibold">Servicio no encontrado</div>
            <div className="mt-1">
              No encontré coincidencias para:{" "}
              <span className="font-medium">{response.data.serviceQuery}</span>
            </div>
          </div>
        );
      }

      const staffList =
        response.data.availableStaff ?? response.data.staff ?? [];

      return (
        <div className="mt-3 rounded-xl border bg-white p-3 text-sm shadow-sm">
          <div className="font-semibold text-slate-900">
            Staff disponible
          </div>

          {response.data.service?.name && (
            <div className="mt-1 text-xs text-slate-500">
              Servicio: {response.data.service.name}
            </div>
          )}

          {response.data.requestedDate && response.data.requestedStart && (
            <div className="mt-1 text-xs text-slate-500">
              Fecha: {response.data.requestedDate} · Hora:{" "}
              {response.data.requestedStart}
            </div>
          )}

          {staffList.length > 0 ? (
            <div className="mt-3 grid gap-2">
              {staffList.map((item: any) => {
                const staffId = item.staffId;
                const staffName = item.staffName ?? item.name ?? "Staff sin nombre";
                const role = item.role;
                const start = item.start;
                const end = item.end;

                return (
                  <div
                    key={`${staffId}-${start ?? "base"}`}
                    className="rounded-xl border bg-slate-50 p-3"
                  >
                    <div className="font-semibold text-slate-900">
                      {staffName}
                    </div>

                    {role && (
                      <div className="text-xs text-slate-500">{role}</div>
                    )}

                    {start && end && (
                      <div className="mt-1 text-xs text-slate-600">
                        Disponible de {start} a {end}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
              No hay staff disponible para esta consulta.
            </div>
          )}
        </div>
      );
    }

    if (intent === "create_appointment") {
      if (response.data.missing) {
        return (
          <div className="mt-3 rounded-xl border bg-amber-50 p-3 text-sm text-amber-900">
            <div className="font-semibold">Faltan datos para agendar:</div>

            <ul className="mt-1 list-inside list-disc">
              {response.data.missing.service && <li>Servicio</li>}
              {response.data.missing.date && <li>Fecha</li>}
              {response.data.missing.time && <li>Hora</li>}
            </ul>
          </div>
        );
      }

      if (Array.isArray(response.data.availableSlots)) {
        return (
          <div className="mt-3 rounded-xl border bg-white p-3 text-sm shadow-sm">
            <div className="font-semibold text-slate-900">
              Horarios disponibles sugeridos
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {response.data.availableSlots.slice(0, 6).map((slot: any) => (
                <span
                  key={`${slot.date}-${slot.start}-${slot.staffId}`}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                >
                  {slot.start} - {slot.end}
                </span>
              ))}
            </div>
          </div>
        );
      }

      if (response.data.appointmentId) {
        return (
          <div className="mt-3 rounded-xl border bg-emerald-50 p-3 text-sm text-emerald-900">
            <div className="font-semibold">Reserva creada correctamente</div>
            <div className="mt-1">
              {response.data.serviceName} — {response.data.date} ·{" "}
              {response.data.start} a {response.data.end}
            </div>
          </div>
        );
      }
    }

    return null;
  };

  return (
    <div className="min-h-[calc(100vh-2rem)] bg-slate-50 px-4 py-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Sparkles className="h-4 w-4" />
                Xapity Conversational AI
              </div>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Asistente inteligente para gestión y agenda
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Consulta servicios, revisa ingresos por ventas o agenda reservas
                usando lenguaje natural.
              </p>
            </div>

            <div className="rounded-2xl border bg-slate-50 px-4 py-3 text-sm">
              <div className="font-semibold text-slate-900">
                Endpoint activo
              </div>
              <div className="mt-1 font-mono text-xs text-slate-500">
                POST /xapity/chat
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="flex h-[68vh] flex-col rounded-3xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white">
                  <Bot className="h-5 w-5" />
                </div>

                <div>
                  <div className="font-semibold text-slate-950">
                    Chat Xapity
                  </div>
                  <div className="text-xs text-slate-500">
                    Respuestas conectadas al backend FastAPI
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="space-y-5">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100">
                        <Bot className="h-4 w-4 text-slate-700" />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user"
                          ? "bg-black text-white"
                          : "border bg-slate-50 text-slate-800"
                        }`}
                    >
                      <div>{msg.content}</div>

                      {msg.role === "assistant" && msg.response && (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                            {getIntentIcon(msg.response.analysis.intent)}
                            {getIntentLabel(msg.response.analysis.intent)}
                          </span>

                          <span className="rounded-full bg-white px-2.5 py-1 text-xs text-slate-500 ring-1 ring-slate-200">
                            Confianza:{" "}
                            {Math.round(
                              msg.response.analysis.confidence * 100
                            )}
                            %
                          </span>

                          {msg.response.metadata?.detection_source && (
                            <span className="rounded-full bg-white px-2.5 py-1 text-xs text-slate-500 ring-1 ring-slate-200">
                              {msg.response.metadata.detection_source}
                            </span>
                          )}
                        </div>
                      )}

                      {msg.role === "assistant" &&
                        renderStructuredData(msg.response)}
                    </div>

                    {msg.role === "user" && (
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                      <Bot className="h-4 w-4 text-slate-700" />
                    </div>

                    <div className="flex items-center gap-2 rounded-2xl border bg-slate-50 px-4 py-3">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Xapity está pensando...
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
            </div>

            <div className="border-t p-4">
              <div className="flex gap-2">
                <input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendPrompt();
                    }
                  }}
                  disabled={loading}
                  className="flex-1 rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100 disabled:bg-slate-100"
                  placeholder="Escribe tu consulta..."
                />

                <button
                  onClick={() => sendPrompt()}
                  disabled={loading || !prompt.trim()}
                  className="inline-flex items-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Enviar
                </button>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border bg-white p-5 shadow-sm">
              <div className="font-semibold text-slate-950">
                Consultas rápidas
              </div>

              <div className="mt-4 space-y-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => sendPrompt(suggestion)}
                    disabled={loading}
                    className="w-full rounded-2xl border bg-slate-50 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border bg-white p-5 shadow-sm">
              <div className="font-semibold text-slate-950">
                Capacidades MVP
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex gap-3">
                  <Wrench className="mt-0.5 h-4 w-4" />
                  <span>Listar servicios disponibles.</span>
                </div>

                <div className="flex gap-3">
                  <CalendarCheck className="mt-0.5 h-4 w-4" />
                  <span>Intentar crear reservas desde lenguaje natural.</span>
                </div>

                <div className="flex gap-3">
                  <WalletCards className="mt-0.5 h-4 w-4" />
                  <span>Consultar ingresos por ventas del periodo.</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border bg-slate-950 p-5 text-white shadow-sm">
              <div className="text-sm font-semibold">
                Estado del asistente
              </div>

              <p className="mt-2 text-sm text-slate-300">
                Esta versión ya consume el endpoint conversacional del backend y
                renderiza respuestas según intención detectada.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}