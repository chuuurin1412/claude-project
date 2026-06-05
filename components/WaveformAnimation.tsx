"use client";

interface WaveformAnimationProps {
  isActive: boolean;
  color: string;
}

const DURATIONS = [0.6, 0.7, 0.8, 0.9, 1.0, 0.75, 0.65, 0.85];
const DELAYS = [0, 0.05, 0.1, 0.15, 0.2, 0.08, 0.18, 0.12];
const BAR_COUNT = 32;

export default function WaveformAnimation({
  isActive,
  color,
}: WaveformAnimationProps) {
  return (
    <div
      className="flex items-end gap-px"
      style={{ height: "56px", width: "256px" }}
    >
      {Array.from({ length: BAR_COUNT }).map((_, i) => {
        const duration = DURATIONS[i % DURATIONS.length];
        const delay = DELAYS[i % DELAYS.length];

        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: "56px",
              backgroundColor: color,
              borderRadius: "2px",
              transformOrigin: "bottom",
              transition: "opacity 0.4s ease",
              ...(isActive
                ? {
                    animation: `waveBar ${duration}s ${delay}s ease-in-out infinite alternate`,
                    opacity: 0.8,
                  }
                : {
                    transform: "scaleY(0.08)",
                    opacity: 0.2,
                  }),
            }}
          />
        );
      })}
    </div>
  );
}
