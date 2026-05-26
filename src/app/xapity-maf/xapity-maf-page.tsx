import { useEffect, useRef, useState } from "react";
import {
  Bot,
  FileText,
  Gift,
  HeartHandshake,
  Loader2,
  Send,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

type RagSource = {
  chunk_id?: string;
  page?: number;
  score?: number;
  text?: string;
};

type RagAnswerResponse = {
  answer: string;
  status?: string;
  confidence?: number;
  matches_count?: number;
  sources?: RagSource[];
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  response?: RagAnswerResponse;
};

const API_URL =
  import.meta.env.VITE_XAPITY_API_URL ?? "http://127.0.0.1:8000";

function getAccessToken() {
  return (
    localStorage.getItem("accessToken") ??
    localStorage.getItem("token") ??
    localStorage.getItem("xapity_access_token") ??
    ""
  );
}

function getConfidenceLabel(confidence?: number) {
  if (typeof confidence !== "number") return "Sin métrica";
  if (confidence >= 0.75) return "Alta";
  if (confidence >= 0.45) return "Media";
  return "Baja";
}

export default function XapityMafPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "Hola, soy Xapity MAF. Puedo ayudarte a consultar beneficios, requisitos, condiciones y documentos asociados al manual de beneficios de MAF Chile.",
    },
  ]);

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const suggestions = [
    "¿Qué beneficios existen para nacimiento de un hijo?",
    "¿Cuáles son los requisitos para solicitar un bono?",
    "¿Qué documentos debo presentar para acceder a un beneficio?",
    "¿Existe algún beneficio relacionado con salud?",
    "¿Qué beneficios aplican para trabajadores con contrato vigente?",
    "Resume los principales beneficios disponibles.",
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendPrompt = async (customPrompt?: string) => {
    const finalPrompt = (customPrompt ?? prompt).trim();

    if (!finalPrompt || loading) return;

    const token = getAccessToken();

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: finalPrompt,
    };

    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setLoading(true);

    try {
      if (!token) {
        throw new Error("missing_token");
      }

      const res = await fetch(`${API_URL}/xapity-maf/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: finalPrompt,
          top_k: 5,
          min_score: 0.25,
        }),
      });

      if (res.status === 401) throw new Error("unauthorized");
      if (res.status === 403) throw new Error("forbidden");
      if (!res.ok) throw new Error("server_error");

      const data: RagAnswerResponse = await res.json();

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          data.answer ??
          "No encontré una respuesta suficientemente respaldada en el contexto disponible.",
        response: data,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      let errorMessage =
        "No pude conectar con Xapity MAF. Revisa que el backend esté levantado y que la URL del entorno sea correcta.";

      if (err?.message === "missing_token") {
        errorMessage =
          "No encontré un token de sesión. Inicia sesión nuevamente para usar Xapity MAF.";
      }

      if (err?.message === "unauthorized") {
        errorMessage =
          "Tu sesión no es válida o expiró. Inicia sesión nuevamente.";
      }

      if (err?.message === "forbidden") {
        errorMessage =
          "Tu usuario no está autorizado para acceder a Xapity MAF. Debes ingresar con una cuenta asociada a MAF Chile.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: errorMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderRagMetadata = (response?: RagAnswerResponse) => {
    if (!response) return null;

    return (
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
          <FileText className="h-4 w-4" />
          RAG documental
        </span>

        {typeof response.confidence === "number" && (
          <span className="rounded-full bg-white px-2.5 py-1 text-xs text-slate-500 ring-1 ring-slate-200">
            Confianza: {Math.round(response.confidence * 100)}% ·{" "}
            {getConfidenceLabel(response.confidence)}
          </span>
        )}

        {typeof response.matches_count === "number" && (
          <span className="rounded-full bg-white px-2.5 py-1 text-xs text-slate-500 ring-1 ring-slate-200">
            Coincidencias: {response.matches_count}
          </span>
        )}

        {response.status && (
          <span className="rounded-full bg-white px-2.5 py-1 text-xs text-slate-500 ring-1 ring-slate-200">
            {response.status}
          </span>
        )}
      </div>
    );
  };

  const renderSources = (response?: RagAnswerResponse) => {
    if (!response?.sources?.length) return null;

    return (
      <div className="mt-3 rounded-xl border bg-white p-3 text-xs text-slate-600 shadow-sm">
        <div className="mb-2 flex items-center gap-2 font-semibold text-slate-900">
          <FileText className="h-4 w-4" />
          Fuentes consultadas
        </div>

        <div className="space-y-2">
          {response.sources.slice(0, 3).map((source, index) => (
            <div
              key={source.chunk_id ?? index}
              className="rounded-lg bg-slate-50 px-3 py-2"
            >
              <div className="font-medium text-slate-700">
                {source.page ? `Página ${source.page}` : "Fuente documental"}
                {typeof source.score === "number" &&
                  ` · similitud ${Math.round(source.score * 100)}%`}
              </div>

              {source.text && (
                <p className="mt-1 line-clamp-2 text-slate-500">
                  {source.text}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-2rem)] bg-slate-50 px-4 py-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Sparkles className="h-4 w-4" />
                Xapity MAF · Conversational RAG
              </div>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Asistente inteligente de beneficios MAF Chile
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Consulta beneficios, requisitos, condiciones y documentos usando
                lenguaje natural. Las respuestas se generan desde el contexto
                documental disponible.
              </p>
            </div>

            <div className="rounded-2xl border bg-slate-50 px-4 py-3 text-sm">
              <div className="font-semibold text-slate-900">
                Endpoint activo
              </div>
              <div className="mt-1 font-mono text-xs text-slate-500">
                POST /xapity-maf/chat
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
                    Chat Xapity MAF
                  </div>
                  <div className="text-xs text-slate-500">
                    Respuestas conectadas al backend FastAPI protegido
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="space-y-5">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100">
                        <Bot className="h-4 w-4 text-slate-700" />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-black text-white"
                          : "border bg-slate-50 text-slate-800"
                      }`}
                    >
                      <div>{msg.content}</div>

                      {msg.role === "assistant" && msg.response && (
                        <>
                          {renderRagMetadata(msg.response)}
                          {renderSources(msg.response)}
                        </>
                      )}
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
                      Xapity MAF está buscando en el manual...
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
                  placeholder="Pregunta sobre beneficios MAF..."
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
                  <Gift className="mt-0.5 h-4 w-4" />
                  <span>Consultar beneficios disponibles.</span>
                </div>

                <div className="flex gap-3">
                  <FileText className="mt-0.5 h-4 w-4" />
                  <span>Responder con contexto documental recuperado.</span>
                </div>

                <div className="flex gap-3">
                  <HeartHandshake className="mt-0.5 h-4 w-4" />
                  <span>Orientar sobre requisitos, condiciones y documentos.</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border bg-white p-5 shadow-sm">
              <div className="font-semibold text-slate-950">
                Control de respuesta
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4" />
                  <span>Acceso restringido a usuarios MAF autorizados.</span>
                </div>

                <div className="flex gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4" />
                  <span>Muestra confianza, coincidencias y fuentes usadas.</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border bg-slate-950 p-5 text-white shadow-sm">
              <div className="text-sm font-semibold">
                Estado del asistente
              </div>

              <p className="mt-2 text-sm text-slate-300">
                Esta versión consume el endpoint protegido de MAF y responde
                usando recuperación semántica sobre el manual cargado.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}