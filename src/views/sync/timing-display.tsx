import { useAudioStore } from "@/stores/audio";
import { formatTimeMs } from "@/utils/sync-helpers";
import { useEffect, useRef } from "react";

// -- Interfaces ---------------------------------------------------------------

interface TimingDisplayProps {
  lastSyncedTime?: number;
}

// -- Components ---------------------------------------------------------------

const TimingDisplay: React.FC<TimingDisplayProps> = ({ lastSyncedTime }) => {
  const currentTimeRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // RAF loop for real-time current time display
  useEffect(() => {
    const update = () => {
      const el = currentTimeRef.current;
      if (el) {
        const time = useAudioStore.getState().currentTime;
        el.textContent = formatTimeMs(time);
      }
      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="flex items-center justify-center gap-4 font-mono text-sm select-text tabular-nums sm:gap-8">
      <div className="text-center">
        <div className="mb-1 text-xs text-calleditor-text-muted">Current</div>
        <div ref={currentTimeRef} className="text-lg text-calleditor-text sm:text-xl">
          0:00.000
        </div>
      </div>
      {lastSyncedTime !== undefined && (
        <div className="text-center">
          <div className="mb-1 text-xs text-calleditor-text-muted">
            Last Synced
          </div>
          <div className="text-lg text-calleditor-accent-text sm:text-xl">
            {formatTimeMs(lastSyncedTime)}
          </div>
        </div>
      )}
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { TimingDisplay };
