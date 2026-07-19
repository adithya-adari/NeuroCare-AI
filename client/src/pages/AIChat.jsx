import { useEffect, useRef, useState } from "react";
import API from "../services/api";

function AIChat() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text:
        "👋 Hello! I'm NeuroCare AI.\n\nAsk me anything about your child's developmental milestones, growth, motor skills, or general pediatric guidance.",
    },
  ]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const askAI = async () => {
    if (!question.trim() || loading) return;

    const userQuestion = question;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const res = await API.post("/ai/analyze", {
        answers: {
          parentQuestion: userQuestion,
        },
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: res.data.response,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "❌ Unable to contact NeuroCare AI.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-6">

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">

        <div className="bg-blue-700 text-white p-6">

          <h1 className="text-3xl font-bold">
            🧠 NeuroCare AI Assistant
          </h1>

          <p className="mt-2 text-blue-100">
            Ask questions about child development and receive AI-powered educational guidance.
          </p>

        </div>

        <div className="h-[550px] overflow-y-auto p-6 bg-slate-50">

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex mb-6 ${
                msg.sender === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-5 py-4 shadow whitespace-pre-wrap ${
                  msg.sender === "user"
                    ? "bg-blue-700 text-white"
                    : "bg-white"
                }`}
              >
                <div className="font-bold mb-2">
                  {msg.sender === "user"
                    ? "👤 You"
                    : "🧠 NeuroCare AI"}
                </div>

                {msg.text}
              </div>
            </div>
          ))}

          {loading && (

            <div className="flex justify-start mb-6">

              <div className="bg-white rounded-2xl px-5 py-4 shadow">

                <div className="font-bold mb-2">
                  🧠 NeuroCare AI
                </div>

                Thinking...

              </div>

            </div>

          )}

          <div ref={bottomRef}></div>

        </div>

        <div className="border-t bg-white p-6">

          <div className="flex gap-4">

            <textarea
              rows={2}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  askAI();
                }
              }}
              placeholder="Ask about your child's development..."
              className="flex-1 border rounded-2xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={askAI}
              disabled={loading}
              className="bg-blue-700 hover:bg-blue-800 text-white px-8 rounded-2xl font-semibold"
            >
              {loading ? "..." : "Send"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AIChat;