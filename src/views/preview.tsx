import { useAudioStore } from "@/stores/audio";
import { useAppLanguage } from "@/lib/i18n";
import { useProjectStore } from "@/stores/project";
import { useSettingsStore } from "@/stores/settings";
import { Button } from "@/ui/button";
import { EmptyState } from "@/ui/empty-state";
import { generateTTML } from "@/utils/ttml";
import { AmLyricsRenderer } from "@/views/preview/am-lyrics-renderer";
import { BraccatoRenderer } from "@/views/preview/braccato-renderer";
import { effectiveBounds } from "@/domain/line/bounds";
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
} from "@tabler/icons-react";
import { useMemo } from "react";

// -- Components ---------------------------------------------------------------

const PreviewPanel: React.FC = () => {
  const lines = useProjectStore((s) => s.lines);
  const agents = useProjectStore((s) => s.agents);
  const groups = useProjectStore((s) => s.groups);
  const metadata = useProjectStore((s) => s.metadata);
  const granularity = useProjectStore((s) => s.granularity);
  const duration = useAudioStore((s) => s.duration);
  const source = useAudioStore((s) => s.source);
  const isPlaying = useAudioStore((s) => s.isPlaying);
  const setIsPlaying = useAudioStore((s) => s.setIsPlaying);
  const renderer = useSettingsStore((s) => s.previewRenderer);
  const { t } = useAppLanguage();

  const hasSyncedContent = useMemo(() => {
    return lines.some((line) => effectiveBounds(line) !== null);
  }, [lines]);

  const ttmlString = useMemo(() => {
    if (!hasSyncedContent) return null;
    return generateTTML({
      metadata,
      agents,
      lines,
      groups,
      granularity,
      duration,
    });
  }, [
    metadata,
    agents,
    lines,
    groups,
    granularity,
    duration,
    hasSyncedContent,
  ]);

  if (!source) {
    return (
      <div className="flex flex-col flex-1 p-4">
        <EmptyState
          message={t("preview.empty.noAudio")}
          hint={t("preview.empty.noAudioHint")}
        />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col flex-1 p-4">
        <EmptyState
          message={t("preview.empty.noLyrics")}
          hint={t("preview.empty.noLyricsHint")}
        />
      </div>
    );
  }

  if (!hasSyncedContent || !ttmlString) {
    return (
      <div className="flex flex-col flex-1 p-4">
        <EmptyState
          message={t("preview.empty.noSynced")}
          hint={t("preview.empty.noSyncedHint")}
        />
      </div>
    );
  }

  return (
    <div
      data-tour="preview-panel"
      className="flex flex-1 flex-col overflow-hidden select-none text-[13px] md:text-sm"
    >
      <div className="flex flex-col gap-3 px-4 py-4 border-b border-calleditor-border md:flex-row md:items-center md:justify-between md:px-6">
        <h2 className="text-base font-medium md:text-lg">{t("preview.title")}</h2>
        <Button
          variant="primary"
          hasIcon
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-full justify-center md:w-auto"
        >
          {isPlaying ? (
            <IconPlayerPauseFilled className="size-4" />
          ) : (
            <IconPlayerPlayFilled className="size-4" />
          )}
          {isPlaying ? t("preview.pause") : t("preview.play")}
        </Button>
      </div>

      {renderer === "am-lyrics" ? (
        <AmLyricsRenderer ttmlString={ttmlString} durationSeconds={duration} />
      ) : (
        <BraccatoRenderer ttmlString={ttmlString} />
      )}
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { PreviewPanel };
