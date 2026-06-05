"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

interface InterestsInputProps {
  interests: string[];
  onChange: (interests: string[]) => void;
}

export default function InterestsInput({ interests, onChange }: InterestsInputProps) {
  const [input, setInput] = useState("");

  const addInterest = () => {
    const trimmed = input.trim();
    if (trimmed && !interests.includes(trimmed) && interests.length < 10) {
      onChange([...interests, trimmed]);
    }
    setInput("");
  };

  const removeInterest = (item: string) => {
    onChange(interests.filter((i) => i !== item));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addInterest();
    }
  };

  return (
    <div className="px-4 py-4 border-t border-white/10 flex-shrink-0">
      <p className="text-xs text-white/30 uppercase tracking-wider mb-3">
        あなたの関心
      </p>

      {/* Tags */}
      {interests.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {interests.map((interest) => (
            <span
              key={interest}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-xs text-white/70"
            >
              {interest}
              <button
                onClick={() => removeInterest(interest)}
                className="text-white/40 hover:text-white/80 transition-colors ml-0.5"
                aria-label={`${interest}を削除`}
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      {interests.length === 0 && (
        <p className="text-xs text-white/20 mb-3">
          トピックを追加するとAIがその視点で構成します
        </p>
      )}

      {/* Input */}
      <div className="flex gap-1.5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="例: AI・投資・健康..."
          maxLength={20}
          className="flex-1 bg-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/25 outline-none focus:bg-white/15 transition-colors"
        />
        <button
          onClick={addInterest}
          disabled={!input.trim() || interests.length >= 10}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30"
          title="追加"
        >
          <Plus size={14} className="text-white/70" />
        </button>
      </div>
    </div>
  );
}
