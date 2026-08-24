import { useEffect, useRef, useState } from "react";
import {
  BarChart3,
  Bot,
  Database,
  Loader2,
  Send,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";


type SalesTrace = {
  matchedRule?: string | null;
  queryType?: string | null;
  source?: string | null;
  generatedAt?: string | null;
  responseBuilder?: string | null;
  deterministic?: boolean;
  implemented?: boolean;
  elapsedMs?: number;
};


type LucaSalesResponse = {
  requestId?: string;
  status: string;
  answer: string;
  intent: string;
  confidence: number;
  entities?: Record<string, unknown>;
  data?: Record<string, unknown> | null;
  trace?: SalesTrace;
  error?: {
    type?: string;
    message?: string;
  } | null;
};


type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  response?: LucaSalesResponse;
};


const API_URL =
  import.meta.env.VITE_XAPITY_API_URL ??
  "http://127.0.0.1:8000";


const LUCA_BUSINESS_ID = Number(
  import.meta.env.VITE_LUCA_BUSINESS_ID ?? 70
);


function getConfidenceLabel(
  confidence?: number,
) {
  if (typeof confidence !== "number") {
    return "Sin métrica";
  }

  if (confidence >= 0.95) {
    return "Alta";
  }

  if (confidence >= 0.7) {
    return "Media";
  }

  return "Baja";
}


function formatIntent(
  intent?: string,
) {
  if (!intent) {
    return "Sin intención";
  }

  return intent
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) =>
      letter.toUpperCase(),
    );
}


function formatClp(
  value: unknown,
) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return null;
  }

  return new Intl.NumberFormat(
    "es-CL",
    {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    },
  ).format(number);
}


function formatNumber(
  value: unknown,
) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return null;
  }

  return new Intl.NumberFormat(
    "es-CL",
  ).format(number);
}


export default function XapityLucaPage() {
  const [messages, setMessages] =
    useState<Message[]>([
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "Hola, soy Xapity Luca. Puedo ayudarte a consultar ventas, cuentas por cobrar, clientes y documentos comerciales a partir de la información disponible en Luca.",
      },
    ]);

  const [prompt, setPrompt] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const messagesRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const suggestions = [
    "Dame un resumen de mis ventas",
    "¿Cuánto dinero tengo por cobrar?",
    "¿Qué notas de crédito tengo?",
  ];


  useEffect(() => {
    const container =
      messagesRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);


  const sendPrompt = async (
    customPrompt?: string,
  ) => {
    const finalPrompt = (
      customPrompt ?? prompt
    ).trim();

    if (
      !finalPrompt ||
      loading
    ) {
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: finalPrompt,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/xapity-luca/sales/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            question: finalPrompt,
            businessId:
              LUCA_BUSINESS_ID,
            year: null,
            month: null,
            limit: 10,
          }),
        },
      );

      if (!res.ok) {
        const errorData =
          await res
            .json()
            .catch(() => null);

        console.error(
          "Xapity Luca API error:",
          errorData,
        );

        throw new Error(
          "server_error",
        );
      }

      const data: LucaSalesResponse =
        await res.json();

      const assistantMessage: Message =
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            data.answer ??
            "No pude construir una respuesta para esta consulta.",
          response: data,
        };

      setMessages((prev) => [
        ...prev,
        assistantMessage,
      ]);
    } catch (error) {
      console.error(
        "Error consultando Xapity Luca:",
        error,
      );

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "No pude conectar con Xapity Luca. Revisa que el backend esté levantado y que la URL del entorno sea correcta.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };


  const renderSalesMetadata = (
    response?: LucaSalesResponse,
  ) => {
    if (!response) {
      return null;
    }

    return (
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
          <Database className="h-4 w-4" />
          Datos Luca
        </span>

        {response.trace
          ?.deterministic === true && (
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
            <ShieldCheck className="h-4 w-4" />
            Determinístico
          </span>
        )}

        {response.intent && (
          <span className="rounded-full bg-white px-2.5 py-1 text-xs text-slate-500 ring-1 ring-slate-200">
            {formatIntent(
              response.intent,
            )}
          </span>
        )}

        {typeof response.confidence ===
          "number" && (
          <span className="rounded-full bg-white px-2.5 py-1 text-xs text-slate-500 ring-1 ring-slate-200">
            Confianza:{" "}
            {Math.round(
              response.confidence *
                100,
            )}
            % ·{" "}
            {getConfidenceLabel(
              response.confidence,
            )}
          </span>
        )}

        {typeof response.trace
          ?.elapsedMs === "number" && (
          <span className="rounded-full bg-white px-2.5 py-1 text-xs text-slate-500 ring-1 ring-slate-200">
            {Math.round(
              response.trace.elapsedMs,
            )}{" "}
            ms
          </span>
        )}
      </div>
    );
  };


  const renderOverviewData = (
    response?: LucaSalesResponse,
  ) => {
    if (
      !response?.data ||
      response.intent !==
        "sales_overview"
    ) {
      return null;
    }

    const data =
      response.data;

    const cards = [
      {
        label: "Ventas",
        value: formatClp(
          data.totalAmount,
        ),
      },
      {
        label: "Documentos",
        value: formatNumber(
          data.totalDocuments,
        ),
      },
      {
        label: "Por cobrar",
        value: formatClp(
          data.receivableAmount,
        ),
      },
      {
        label: "Clientes",
        value: formatNumber(
          data.uniqueCustomers,
        ),
      },
    ].filter(
      (item) =>
        item.value !== null,
    );

    if (!cards.length) {
      return null;
    }

    return (
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border bg-white px-3 py-2.5 shadow-sm"
          >
            <div className="text-xs text-slate-500">
              {card.label}
            </div>

            <div className="mt-0.5 font-semibold text-slate-900">
              {card.value}
            </div>
          </div>
        ))}
      </div>
    );
  };


  return (
    <div className="min-h-0 bg-slate-50 px-4 py-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">

        <section className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[1fr_320px]">

          {/* ==================================================
              CHAT
          ================================================== */}

          <div className="flex h-[calc(100vh-8rem)] min-h-0 flex-col rounded-3xl border bg-white shadow-sm">

            {/* HEADER */}

            <div className="border-b px-5 py-4">
              <div className="flex items-center justify-between gap-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white">
                    <Bot className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">

                      <div className="font-semibold text-slate-950">
                        Xapity Luca
                      </div>

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Activo
                      </span>

                    </div>

                    <div className="mt-0.5 text-xs text-slate-500">
                      Agente comercial · Ventas e ingresos
                    </div>
                  </div>

                </div>

              </div>
            </div>


            {/* MENSAJES */}

            <div
              ref={messagesRef}
              className="min-h-0 flex-1 overflow-y-auto px-5 py-5"
            >
              <div className="space-y-5">

                {messages.map(
                  (msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${
                        msg.role ===
                        "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >

                      {msg.role ===
                        "assistant" && (
                        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100">
                          <Bot className="h-4 w-4 text-slate-700" />
                        </div>
                      )}

                      <div
                        className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          msg.role ===
                          "user"
                            ? "bg-black text-white"
                            : "border bg-slate-50 text-slate-800"
                        }`}
                      >
                        <div>
                          {msg.content}
                        </div>

                        {msg.role ===
                          "assistant" &&
                          msg.response && (
                            <>
                              {renderSalesMetadata(
                                msg.response,
                              )}

                              {renderOverviewData(
                                msg.response,
                              )}
                            </>
                          )}
                      </div>

                      {msg.role ===
                        "user" && (
                        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}

                    </div>
                  ),
                )}


                {loading && (
                  <div className="flex items-center gap-3 text-sm text-slate-500">

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                      <Bot className="h-4 w-4 text-slate-700" />
                    </div>

                    <div className="flex items-center gap-2 rounded-2xl border bg-slate-50 px-4 py-3">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Xapity Luca está analizando tus ventas...
                    </div>

                  </div>
                )}

              </div>
            </div>


            {/* INPUT */}

            <div className="border-t p-4">

              <div className="flex gap-2">

                <input
                  value={prompt}
                  onChange={(e) =>
                    setPrompt(
                      e.target.value,
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key ===
                      "Enter"
                    ) {
                      sendPrompt();
                    }
                  }}
                  disabled={loading}
                  className="flex-1 rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100 disabled:bg-slate-100"
                  placeholder="Pregunta sobre ventas, clientes o cuentas por cobrar..."
                />

                <button
                  onClick={() =>
                    sendPrompt()
                  }
                  disabled={
                    loading ||
                    !prompt.trim()
                  }
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


          {/* ==================================================
              SIDEBAR
          ================================================== */}

          <aside className="space-y-4">

            <div className="rounded-3xl border bg-white p-5 shadow-sm">

              <div className="font-semibold text-slate-950">
                Consultas rápidas
              </div>

              <div className="mt-4 space-y-2">

                {suggestions.map(
                  (suggestion) => (
                    <button
                      key={
                        suggestion
                      }
                      onClick={() =>
                        sendPrompt(
                          suggestion,
                        )
                      }
                      disabled={
                        loading
                      }
                      className="w-full rounded-2xl border bg-slate-50 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {
                        suggestion
                      }
                    </button>
                  ),
                )}

              </div>

            </div>


            <div className="rounded-3xl border bg-white p-5 shadow-sm">

              <div className="font-semibold text-slate-950">
                Inteligencia comercial
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-600">

                <div className="flex gap-3">
                  <Database className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    Consultas sobre información comercial sincronizada desde Luca.
                  </span>
                </div>

                <div className="flex gap-3">
                  <BarChart3 className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    Ventas, clientes, documentos y cuentas por cobrar.
                  </span>
                </div>

                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    Los cálculos comerciales son determinísticos y trazables.
                  </span>
                </div>

                <div className="flex gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    Las respuestas se construyen a partir de datos estructurados, sin estimaciones del modelo.
                  </span>
                </div>

              </div>

            </div>

          </aside>

        </section>

      </div>
    </div>
  );
}