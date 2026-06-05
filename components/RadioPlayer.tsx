"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Square, SkipForward, Volume2, VolumeX } from "lucide-react";
import { Station } from "@/lib/stations";
import { useSpeech } from "@/lib/useSpeech";
import WaveformAnimation from "@/components/WaveformAnimation";

interface RadioPlayerProps {
  station: Station;
}

export default function RadioPlayer({ station }: RadioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [content, setContent] = useState("");
  const [currentTopic, setCurrentTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const isPlayingRef = useRef(false);
  const isMutedRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const sessionRef = useRef(0);
  const contentScrollRef = useRef<HTMLDivElement>(null);

  const { speak, stop, isSpeaking, isSupported } = useSpeech();

  const pickTopic = useCallback(() => {
    const idx = Math.floor(Math.random() * station.topics.length);
    return station.topics[idx];
  }, [station.topics]);

  const generateContent = useCallback(
    async (topic: string): Promise<string> => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsGenerating(true);
      setContent("");

      let fullText = "";

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stationId: station.id,
            stationName: station.name,
            topic,
            hostName: station.hostName,
          }),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          throw new Error("Generation failed");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;
          setContent((prev) => prev + chunk);
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Generation error:", err);
        }
      } finally {
        setIsGenerating(false);
      }

      return fullText;
    },
    [station.id, station.name, station.hostName]
  );

  const startLoop = useCallback(
    async (session: number) => {
      while (isPlayingRef.current && session === sessionRef.current) {
        const topic = pickTopic();
        setCurrentTopic(topic);

        const text = await generateContent(topic);

        if (!isPlayingRef.current || session !== sessionRef.current) break;

        if (text && !isMutedRef.current && isSupported) {
          await new Promise<void>((resolve) => {
            speak(text, resolve);
          });
        } else {
          await new Promise<void>((resolve) => setTimeout(resolve, 4000));
        }
      }
    },
    [pickTopic, generateContent, speak, isSupported]
  );

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      isPlayingRef.current = false;
      sessionRef.current += 1;
      stop();
      abortRef.current?.abort();
      setIsPlaying(false);
      setIsGenerating(false);
      setContent("");
      setCurrentTopic("");
    } else {
      isPlayingRef.current = true;
      sessionRef.current += 1;
      const session = sessionRef.current;
      setIsPlaying(true);
      startLoop(session);
    }
  }, [isPlaying, stop, startLoop]);

  const handleNext = useCallback(() => {
    if (!isPlaying) return;
    stop();
    abortRef.current?.abort();
    sessionRef.current += 1;
    const session = sessionRef.current;
    startLoop(session);
  }, [isPlaying, stop, startLoop]);

  const handleMute = useCallback(() => {
    const next = !isMuted;
    isMutedRef.current = next;
    setIsMuted(next);
    if (next) {
      stop();
    }
  }, [isMuted, stop]);

  useEffect(() => {
    isPlayingRef.current = false;
    sessionRef.current += 1;
    stop();
    abortRef.current?.abort();
    setIsPlaying(false);
    setIsGenerating(false);
    setContent("");
    setCurrentTopic("");
  }, [station.id, stop]);

  useEffect(() => {
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTop =
        contentScrollRef.current.scrollHeight;
    }
  }, [content]);

  return (
    <div className="flex flex-col items-center justify-between h-full p-8">
      {/* Top bar */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: isPlaying ? station.color : "#ffffff33" }}
          />
          <span className="text-xs font-semibold tracking-widest text-white/60 uppercase">
            {isPlaying ? "LIVE" : "OFF AIR"}
          </span>
        </div>
        <span className="text-xs text-white/40 font-medium">
          {station.nameEn}
        </span>
      </div>

      {/* Station visual */}
      <div className="flex flex-col items-center gap-5">
        <div
          className="w-28 h-28 rounded-3xl flex items-center justify-center text-5xl"
          style={{
            background: `linear-gradient(135deg, ${station.color}33, ${station.color}11)`,
            border: `1px solid ${station.color}44`,
            boxShadow: isPlaying
              ? `0 0 40px ${station.color}44, 0 0 80px ${station.color}22`
              : "none",
            transition: "box-shadow 0.6s ease",
          }}
        >
          {station.emoji}
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-1">{station.name}</h2>
          <p className="text-sm text-white/50 mb-1">
            {currentTopic || station.description}
          </p>
          <p className="text-xs text-white/30">DJ {station.hostName}</p>
        </div>

        <WaveformAnimation isActive={isPlaying && isSpeaking} color={station.color} />
      </div>

      {/* Content display */}
      <div
        ref={contentScrollRef}
        className="w-full max-w-2xl h-36 overflow-y-auto rounded-xl bg-white/5 border border-white/10 p-4"
      >
        {isGenerating && !content && (
          <p className="text-white/30 text-sm animate-pulse text-center mt-10">
            {station.hostName}が準備中...
          </p>
        )}
        {content && (
          <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
            {content}
            {isGenerating && (
              <span className="inline-block w-1 h-4 bg-white/40 ml-0.5 animate-pulse align-middle" />
            )}
          </p>
        )}
        {!isGenerating && !content && (
          <p className="text-white/20 text-sm text-center mt-10">
            ▶ を押して放送を開始してください
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <button
          onClick={handleMute}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
          title={isMuted ? "ミュート解除" : "ミュート"}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-white/60" />
          ) : (
            <Volume2 className="w-5 h-5 text-white/80" />
          )}
        </button>

        <button
          onClick={handlePlayPause}
          className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            background: isPlaying
              ? "linear-gradient(135deg, #ef4444, #dc2626)"
              : `linear-gradient(135deg, ${station.color}, ${station.color}cc)`,
            boxShadow: isPlaying
              ? "0 0 30px #ef444466"
              : `0 0 30px ${station.color}66`,
          }}
          title={isPlaying ? "停止" : "再生"}
        >
          {isPlaying ? (
            <Square className="w-7 h-7 text-white fill-white" />
          ) : (
            <Play className="w-7 h-7 text-white fill-white ml-1" />
          )}
        </button>

        <button
          onClick={handleNext}
          disabled={!isPlaying}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="次のトピック"
        >
          <SkipForward className="w-5 h-5 text-white/80" />
        </button>
      </div>
    </div>
  );
}
