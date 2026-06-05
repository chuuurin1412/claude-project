"use client";

import { useState } from "react";
import { stations } from "@/lib/stations";
import StationList from "@/components/StationList";
import RadioPlayer from "@/components/RadioPlayer";
import InteractiveChat from "@/components/InteractiveChat";

export default function Home() {
  const [activeStationId, setActiveStationId] = useState<string>(
    stations[0].id
  );

  const activeStation =
    stations.find((s) => s.id === activeStationId) ?? stations[0];

  return (
    <div className="flex h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Left sidebar */}
      <div className="w-64 flex-shrink-0 flex flex-col border-r border-white/10">
        {/* App header */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📻</span>
            <div>
              <h1 className="font-bold text-base leading-tight">音波ラジオ</h1>
              <p className="text-xs text-white/40 leading-tight">AI Radio</p>
            </div>
          </div>
        </div>

        {/* Station list */}
        <StationList
          stations={stations}
          activeStationId={activeStationId}
          onSelect={setActiveStationId}
        />
      </div>

      {/* Center player */}
      <div className="flex-1 min-w-0">
        <RadioPlayer station={activeStation} />
      </div>

      {/* Right chat panel */}
      <div className="w-72 flex-shrink-0 border-l border-white/10">
        <InteractiveChat station={activeStation} />
      </div>
    </div>
  );
}
