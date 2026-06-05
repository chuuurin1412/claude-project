"use client";

import { useState, useEffect } from "react";
import { stations } from "@/lib/stations";
import StationList from "@/components/StationList";
import RadioPlayer from "@/components/RadioPlayer";
import InteractiveChat from "@/components/InteractiveChat";
import InterestsInput from "@/components/InterestsInput";

const INTERESTS_KEY = "onpa-radio-interests";

export default function Home() {
  const [activeStationId, setActiveStationId] = useState<string>(stations[0].id);
  const [userInterests, setUserInterests] = useState<string[]>([]);

  const activeStation =
    stations.find((s) => s.id === activeStationId) ?? stations[0];

  // Load interests from localStorage after hydration
  useEffect(() => {
    try {
      const saved = localStorage.getItem(INTERESTS_KEY);
      if (saved) setUserInterests(JSON.parse(saved));
    } catch {
      // ignore parse errors
    }
  }, []);

  const handleInterestsChange = (interests: string[]) => {
    setUserInterests(interests);
    try {
      localStorage.setItem(INTERESTS_KEY, JSON.stringify(interests));
    } catch {
      // ignore storage errors
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Left sidebar */}
      <div className="w-64 flex-shrink-0 flex flex-col border-r border-white/10">
        {/* App header */}
        <div className="px-5 py-5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📻</span>
            <div>
              <h1 className="font-bold text-base leading-tight">音波ラジオ</h1>
              <p className="text-xs text-white/40 leading-tight">AI Radio</p>
            </div>
          </div>
        </div>

        {/* Station list (scrollable) */}
        <div className="flex-1 overflow-y-auto">
          <StationList
            stations={stations}
            activeStationId={activeStationId}
            onSelect={setActiveStationId}
          />
        </div>

        {/* Interests input (fixed at bottom of sidebar) */}
        <InterestsInput
          interests={userInterests}
          onChange={handleInterestsChange}
        />
      </div>

      {/* Center player */}
      <div className="flex-1 min-w-0">
        <RadioPlayer station={activeStation} userInterests={userInterests} />
      </div>

      {/* Right chat panel */}
      <div className="w-72 flex-shrink-0 border-l border-white/10">
        <InteractiveChat station={activeStation} />
      </div>
    </div>
  );
}
