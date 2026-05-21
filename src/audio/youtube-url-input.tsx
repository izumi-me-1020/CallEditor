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
    <div className={`flex flex-col gap-1.5 w-full max-w-md ${className ?? ""}`}>
      <div className="flex flex-col gap-2 sm:flex-row">
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
          className="flex-1 h-8 px-3 text-sm py-2 sm:py-0 rounded-md bg-calleditor-input border border-calleditor-border focus:outline-none focus:border-calleditor-accent cursor-text disabled:opacity-50 select-text"
        />
        <Button
          variant="primary"
          hasIcon
          onClick={handleSubmit}
          disabled={isLoading || trimmed.length === 0}
          className="justify-center"
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
