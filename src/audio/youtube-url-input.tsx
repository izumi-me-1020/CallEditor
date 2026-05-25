import { IconBrandYoutube, IconLoader2 } from "@tabler/icons-react";
import { useCallback, useState } from "react";
import { useAppLanguage } from "@/lib/i18n";
import { useLoadYouTubeSource } from "@/hooks/useLoadYouTubeSource";
import { useAudioStore } from "@/stores/audio";
import { Button } from "@/ui/button";
import { extractVideoId } from "@/utils/youtube-url";

// -- Component ----------------------------------------------------------------

interface YouTubeUrlInputProps {
  placeholder?: string;
  className?: string;
}

const YouTubeUrlInput: React.FC<YouTubeUrlInputProps> = ({
  placeholder,
  className,
}) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const isLoading = useAudioStore((s) => s.isLoading);
  const loadYouTubeSource = useLoadYouTubeSource();
  const { t } = useAppLanguage();
  const effectivePlaceholder = placeholder ?? t("youtube.placeholder");

  const handleSubmit = useCallback(async () => {
    const videoId = extractVideoId(value);
    if (!videoId) {
      setError(t("youtube.invalid"));
      return;
    }
    setError(null);
    await loadYouTubeSource(videoId);
    setValue("");
  }, [value, loadYouTubeSource, t]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
    e.stopPropagation();
  };

  const trimmed = value.trim();

  return (
    <div
      className={`flex w-full max-w-md min-w-0 flex-col gap-1.5 ${className ?? ""}`}
    >
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder={effectivePlaceholder}
          disabled={isLoading}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          className="h-8 flex-1 min-w-0 rounded-md border border-calleditor-border bg-calleditor-input px-3 py-2 text-sm cursor-text select-text focus:outline-none focus:border-calleditor-accent disabled:opacity-50 sm:py-0"
        />
        <Button
          variant="primary"
          hasIcon
          onClick={handleSubmit}
          disabled={isLoading || trimmed.length === 0}
          className="w-full justify-center sm:w-auto"
        >
          {isLoading ? (
            <IconLoader2 size={16} className="animate-spin" />
          ) : (
            <IconBrandYoutube size={16} />
          )}
          {isLoading ? t("youtube.loading") : t("youtube.load")}
        </Button>
      </div>
      {error && <p className="text-xs text-red-400 select-text">{error}</p>}
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { YouTubeUrlInput };
