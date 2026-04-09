import { useState } from "react";
//Agregado por felixOrtiz,14/03
type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function XapityPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const sendPrompt = async () => {
    if (!prompt.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: prompt,
    };

    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setLoading(true);

    try {

      //const url = `${PREFIX}/llm/generate`

      const API_URL = import.meta.env.VITE_XAPITY_API_URL;
      const res = await fetch(`${API_URL}/llm/generate`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userMessage.content,
          temperature: 0.2,
        }),
      });

      if (!res.ok) {
        throw new Error("Error en la respuesta del servidor");
        }

      const data = await res.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data?.llm?.response ?? "Sin respuesta del modelo",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error conectando con Xapity" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-3xl mx-auto">

      <h1 className="text-2xl font-bold mb-4">
        Xapity Conversational AI
      </h1>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto border rounded-lg p-4 space-y-4 bg-white">

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-[70%] ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-sm text-gray-500">
            Xapity está pensando...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-4">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter"){
                sendPrompt();
            }
          }}
          className="flex-1 border rounded-lg px-3 py-2"
          placeholder="Escribe tu consulta..."
        />

        <button
          onClick={sendPrompt}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
