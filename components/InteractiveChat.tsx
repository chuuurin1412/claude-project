"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Station } from "@/lib/stations";
import { useSpeech } from "@/lib/useSpeech";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface InteractiveChatProps {
  station: Station;
}

export default function InteractiveChat({ station }: InteractiveChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { speak } = useSpeech();

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `こんにちは！${station.hostName}です。${station.name}へようこそ！何でも気軽に聞いてくださいね。`,
      },
    ]);
    setInput("");
    setIsLoading(false);
  }, [station.id, station.hostName, station.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const history = messages.slice(-8);

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "" },
    ]);

    let fullResponse = "";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          stationName: station.name,
          hostName: station.hostName,
          history,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Chat request failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: fullResponse,
          };
          return updated;
        });
      }

      if (fullResponse) {
        speak(fullResponse);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "すみません、うまく聞き取れませんでした。もう一度お試しください。",
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-4 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <MessageCircle
            className="w-4 h-4"
            style={{ color: station.color }}
          />
          <span className="font-semibold text-sm">DJと話す</span>
        </div>
        <p className="text-xs text-white/40">
          {station.hostName}に質問できます
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            } gap-2`}
          >
            {msg.role === "assistant" && (
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                style={{
                  background: `linear-gradient(135deg, ${station.color}44, ${station.color}22)`,
                  border: `1px solid ${station.color}33`,
                }}
              >
                {station.emoji}
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-white/15 text-white rounded-tr-sm"
                  : "bg-white/5 text-white/80 rounded-tl-sm"
              }`}
            >
              {msg.content === "" && isLoading && idx === messages.length - 1 ? (
                <span className="flex items-center gap-1 py-0.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{ backgroundColor: station.color, animationDelay: "0ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{ backgroundColor: station.color, animationDelay: "150ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{ backgroundColor: station.color, animationDelay: "300ms" }}
                  />
                </span>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-white/10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`${station.hostName}に聞く...`}
            disabled={isLoading}
            className="flex-1 bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/30 transition-colors disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100"
            style={{
              background:
                input.trim() && !isLoading
                  ? `linear-gradient(135deg, ${station.color}, ${station.color}cc)`
                  : "rgba(255,255,255,0.1)",
            }}
            title="送信"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
