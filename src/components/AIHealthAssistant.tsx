
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { supabase } from "../lib/supabase";

interface Message {
  id: string;
  type: "bot" | "user";
  text: string;
  timestamp: Date;
}

interface GeminiMessage {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "What is artificial intelligence?",
  "What services does CKM Hospital offer?",
  "Explain hypertension",
  "What is cybersecurity?",
];

const WELCOME_MESSAGE =
  "Hello! I'm NIULIZE MIMI, your AI assistant at Charles Kulwa Memorial Hospital. You can ask me about healthcare, hospital services, technology, education, science, or any other topic. How can I help you today?";

export default function AIHealthAssistant() {
    return null;
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      text: WELCOME_MESSAGE,
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hospitalContext, setHospitalContext] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    async function loadHospitalContext() {
      const tables = [
        "contact_info",
        "departments",
        "services",
        "faq",
        "service_prices",
        "downloadable_forms",
      ];

      const results = await Promise.all(
        tables.map(async (table) => {
          const { data, error } = await supabase
            .from(table)
            .select("*")
            .limit(30);

          if (error) {
            console.warn(`Could not load ${table}:`, error.message);
            return { table, data: [] };
          }

          return { table, data: data ?? [] };
        })
      );

      const context = results
        .filter((result) => result.data.length > 0)
        .map(
          (result) =>
            `${result.table.toUpperCase()}:\n${JSON.stringify(result.data)}`
        )
        .join("\n\n")
        .slice(0, 12000);

      if (mounted) {
        setHospitalContext(context);
      }
    }

    void loadHospitalContext();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  async function handleSend(messageText?: string) {
    const userText = (messageText ?? input).trim();

    if (!userText || loading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: "user",
      text: userText,
      timestamp: new Date(),
    };

    // Keep the existing conversation for Gemini.
    const previousConversation: GeminiMessage[] = messages
      .filter((message) => message.id !== "welcome")
      .slice(-10)
      .map((message) => ({
        role: message.type === "bot" ? "assistant" : "user",
        content: message.text,
      }));

    const conversation = [
      ...previousConversation,
      {
        role: "user" as const,
        content: userText,
      },
    ].slice(-12);

    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke(
        "ai-health-assistant",
        {
          body: {
            messages: conversation,
            context: hospitalContext,
          },
        }
      );

      if (error) {
        console.error("Gemini function error:", error);
        throw new Error("The AI assistant is temporarily unavailable. Please try again.");
      }

      if (!data?.reply || typeof data.reply !== "string") {
        throw new Error("The AI assistant returned an empty response.");
      }

      const botMessage: Message = {
        id: crypto.randomUUID(),
        type: "bot",
        text: data.reply,
        timestamp: new Date(),
      };

      setMessages((previous) => [...previous, botMessage]);
    } catch (error) {
      console.error("NIULIZE MIMI error:", error);

      const errorMessage: Message = {
        id: crypto.randomUUID(),
        type: "bot",
        text:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        timestamp: new Date(),
      };

      setMessages((previous) => [...previous, errorMessage]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void handleSend();
  }

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center gap-3 bg-green-700 px-5 py-4 text-white">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
          <Bot size={25} />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">NIULIZE MIMI</h2>
          <p className="text-xs text-green-100">
            AI Assistant · Charles Kulwa Memorial Hospital
          </p>
        </div>

        <Sparkles size={21} />
      </div>

      {/* Messages */}
      <div className="flex min-h-[380px] max-h-[580px] flex-1 flex-col gap-4 overflow-y-auto bg-gray-50 p-4 dark:bg-gray-950 sm:p-5">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-2 ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.type === "bot" && (
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">
                <Bot size={17} />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                message.type === "user"
                  ? "rounded-br-sm bg-green-700 text-white"
                  : "rounded-bl-sm border border-gray-200 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              }`}
            >
              <p className="whitespace-pre-wrap break-words">
                {message.text}
              </p>

              <p
                className={`mt-2 text-[10px] ${
                  message.type === "user"
                    ? "text-green-100"
                    : "text-gray-400"
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {message.type === "user" && (
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                <User size={17} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 size={18} className="animate-spin text-green-700" />
            NIULIZE MIMI is thinking...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      {messages.length === 1 && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
          <p className="mb-2 text-xs font-medium text-gray-500">
            Try asking:
          </p>

          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                disabled={loading}
                onClick={() => void handleSend(prompt)}
                className="rounded-full border border-green-200 px-3 py-2 text-xs text-green-800 transition hover:bg-green-50 disabled:opacity-50 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-950"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900 sm:p-4"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask me anything..."
          disabled={loading}
          maxLength={4000}
          className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />

        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send message"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-700 text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? (
            <Loader2 size={19} className="animate-spin" />
          ) : (
            <Send size={19} />
          )}
        </button>
      </form>

      <p className="bg-white px-4 pb-3 text-center text-[10px] text-gray-400 dark:bg-gray-900">
        AI-generated information may not always be accurate. For medical
        emergencies, seek immediate professional care.
      </p>
    </section>
  );
}
