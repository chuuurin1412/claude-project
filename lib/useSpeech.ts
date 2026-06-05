"use client";

import { useState, useEffect, useCallback } from "react";

interface UseSpeechReturn {
  speak: (text: string, onEnd?: () => void, rate?: number) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
}

export function useSpeech(): UseSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported("speechSynthesis" in window);
  }, []);

  const speak = useCallback(
    (text: string, onEnd?: () => void, rate: number = 1.0) => {
      if (!("speechSynthesis" in window)) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = Math.max(0.1, Math.min(rate, 10));
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const japaneseVoice = voices.find(
        (v) => v.lang === "ja-JP" || v.lang.startsWith("ja")
      );
      if (japaneseVoice) {
        utterance.voice = japaneseVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        onEnd?.();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        onEnd?.();
      };

      window.speechSynthesis.speak(utterance);
    },
    []
  );

  const stop = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking, isSupported };
}
