"use client";

import { Station } from "@/lib/stations";

interface StationListProps {
  stations: Station[];
  activeStationId: string;
  onSelect: (id: string) => void;
}

export default function StationList({
  stations,
  activeStationId,
  onSelect,
}: StationListProps) {
  return (
    <div className="flex-1 overflow-y-auto py-2">
      {stations.map((station) => {
        const isActive = station.id === activeStationId;
        return (
          <button
            key={station.id}
            onClick={() => onSelect(station.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
              isActive
                ? "bg-white/15"
                : "text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            {/* Emoji */}
            <span className="text-xl flex-shrink-0">{station.emoji}</span>

            {/* Station info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">
                  {station.name}
                </span>
                {isActive && (
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse"
                    style={{ backgroundColor: station.color }}
                  />
                )}
              </div>
              <p className="text-xs text-white/40 truncate mt-0.5">
                {station.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
