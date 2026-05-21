import { YouTubeUrlInput } from "@/audio/youtube-url-input";
import { useAppLanguage } from "@/lib/i18n";
import { useAudioStore } from "@/stores/audio";
import { useProjectStore } from "@/stores/project";
import {
  IconBrandYoutube,
  IconClock,
  IconFile,
  IconLoader2,
} from "@tabler/icons-react";

// -- Helpers ------------------------------------------------------------------

function formatDuration(seconds: number): string {
  if (seconds <= 0) return "--:--";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toUpperCase() || "AUDIO";
}

// -- Constants ----------------------------------------------------------------

const GUTTER_WIDTH = 56;
const ROW_HEIGHT = 56;

// -- Sub-components -----------------------------------------------------------

const ReplaceControls: React.FC = () => {
  const { t } = useAppLanguage();

  return (
    <div className="flex flex-col items-center gap-4 flex-1 p-6 w-full">
      <YouTubeUrlInput placeholder={t("import.replaceYoutube")} />
    </div>
  );
};

interface SourceDurationProps {
  loading: boolean;
  duration: number;
}

// Shown in the imported-source row. While the source is loading (a YouTube
// download or an mp3 decode) it shows the spinner; once ready it shows the
// clock and resolved duration.
const SourceDuration: React.FC<SourceDurationProps> = ({
  loading,
  duration,
}) => (
  <div className="flex items-center gap-1.5">
    {loading ? (
      <>
        <IconLoader2
          size={14}
          className="animate-spin text-calleditor-accent"
        />
        <span className="text-sm font-mono text-calleditor-text-muted tabular-nums">
          --:--
        </span>
      </>
    ) : (
      <>
        <IconClock size={14} className="text-calleditor-text opacity-50" />
        <span className="text-sm font-mono text-calleditor-text tabular-nums select-text">
          {formatDuration(duration)}
        </span>
      </>
    )}
  </div>
);

// -- Component ----------------------------------------------------------------

const ImportPanel: React.FC = () => {
  const source = useAudioStore((s) => s.source);
  const duration = useAudioStore((s) => s.duration);
  const isLoading = useAudioStore((s) => s.isLoading);
  const projectTitle = useProjectStore((s) => s.metadata.title);
  const { t } = useAppLanguage();

  if (source && source.type === "file") {
    const file = source.file;
    const extension = getFileExtension(file.name);
    const fileName = file.name.replace(/\.[^/.]+$/, "");

    return (
      <div
        data-tour="import-dropzone"
        className="flex flex-col-reverse flex-1 size-full"
      >
        <div className="flex border-t border-calleditor-border">
          <div
            className="shrink-0 flex items-center justify-center bg-calleditor-accent/10"
            style={{ width: GUTTER_WIDTH, height: ROW_HEIGHT }}
          >
            <IconFile size={16} className="text-calleditor-accent" />
          </div>

          <div
            className="flex-1 flex flex-col items-start gap-1 px-4 py-3 border-l border-calleditor-accent/25 sm:flex-row sm:items-center sm:gap-6"
            style={{ minHeight: ROW_HEIGHT }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-calleditor-text select-text">
                {fileName}
              </p>
              <p className="text-xs text-calleditor-text-muted">{extension}</p>
            </div>

            <SourceDuration loading={isLoading} duration={duration} />

            <div className="text-sm text-calleditor-text-muted sm:ml-auto">
              {formatFileSize(file.size)}
            </div>
          </div>
        </div>

        <ReplaceControls />
      </div>
    );
  }

  if (source && source.type === "youtube") {
    const videoId = source.videoId;
    const displayTitle =
      projectTitle && projectTitle !== videoId ? projectTitle : videoId;
    const downloading = isLoading && !source.file;

    return (
      <div
        data-tour="import-dropzone"
        className="flex flex-col-reverse flex-1 size-full"
      >
        <div className="flex border-t border-calleditor-border">
          <div
            className="shrink-0 flex items-center justify-center bg-calleditor-accent/10"
            style={{ width: GUTTER_WIDTH, height: ROW_HEIGHT }}
          >
            <IconBrandYoutube size={16} className="text-calleditor-accent" />
          </div>

          <div
            className="flex-1 flex flex-col items-start gap-1 px-4 py-3 border-l border-calleditor-accent/25 sm:flex-row sm:items-center sm:gap-6"
            style={{ minHeight: ROW_HEIGHT }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-calleditor-text select-text">
                {displayTitle}
              </p>
              <p className="text-xs text-calleditor-text-muted select-text">
                {videoId} ・{" "}
                {downloading
                  ? t("import.youtubeDownloading")
                  : t("import.youtubeFrom")}
              </p>
            </div>

            <div className="sm:ml-auto">
              <SourceDuration loading={downloading} duration={duration} />
            </div>
          </div>
        </div>

        <ReplaceControls />
      </div>
    );
  }

  return (
    <div
      data-tour="import-dropzone"
      className="flex flex-col items-center justify-center gap-6 flex-1 size-full p-6"
    >
      <div className="w-full max-w-md rounded-2xl border border-calleditor-border bg-calleditor-bg-dark/40 p-8 text-center">
        <IconBrandYoutube
          className="mx-auto size-12 text-calleditor-accent opacity-80"
          stroke={1.5}
        />
        <p className="mt-4 text-calleditor-text-secondary">
          {t("import.dropTitle")}
        </p>
        <p className="mt-1 text-sm text-calleditor-text-muted">
          {t("import.dropHint")}
        </p>
        <p className="mt-4 text-xs text-calleditor-text-muted">
          {t("import.supportsFormats")}
        </p>
      </div>

      <YouTubeUrlInput />
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { ImportPanel };
