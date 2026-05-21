import { useAudioStore } from "@/stores/audio";
import { useAppLanguage } from "@/lib/i18n";
import { useSettingsStore } from "@/stores/settings";
import { SliderSetting, ToggleSetting } from "@/ui/settings/setting-controls";

// -- Playback Section ---------------------------------------------------------

const PlaybackSection: React.FC = () => {
  const set = useSettingsStore((s) => s.set);
  const hasAudio = useAudioStore((s) => s.source !== null);
  const { t } = useAppLanguage();

  return (
    <div className="divide-y divide-calleditor-border">
      <SliderSetting
        label={t("settings.playback.defaultRate.label")}
        description={t("settings.playback.defaultRate.description")}
        settingKey="defaultPlaybackRate"
        min={0.25}
        max={2}
        step={0.05}
        format={(v) => `${v.toFixed(2)}x`}
        action={
          hasAudio
            ? {
                label: t("settings.useCurrent"),
                onClick: () =>
                  set(
                    "defaultPlaybackRate",
                    useAudioStore.getState().playbackRate,
                  ),
              }
            : undefined
        }
      />
      <ToggleSetting
        label={t("settings.playback.rememberVolume.label")}
        description={t("settings.playback.rememberVolume.description")}
        settingKey="rememberVolume"
      />
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { PlaybackSection };
