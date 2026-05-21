import { useAppLanguage } from "@/lib/i18n";
import { SelectSetting, SliderSetting } from "@/ui/settings/setting-controls";
import { SplitCharacterSetting } from "@/ui/settings/split-character-setting";

// -- Sync Section -------------------------------------------------------------

const SyncSection: React.FC = () => {
  const { t } = useAppLanguage();

  return (
    <div className="divide-y divide-calleditor-border">
      <SplitCharacterSetting />
      <SliderSetting
        label={t("settings.sync.nudgeAmount.label")}
        description={t("settings.sync.nudgeAmount.description")}
        settingKey="nudgeAmount"
        min={0.01}
        max={0.2}
        step={0.01}
        format={(v) => `${(v * 1000).toFixed(0)}ms`}
      />
      <SliderSetting
        label={t("settings.sync.defaultWordDuration.label")}
        description={t("settings.sync.defaultWordDuration.description")}
        settingKey="defaultWordDuration"
        min={0.1}
        max={1}
        step={0.05}
        format={(v) => `${(v * 1000).toFixed(0)}ms`}
      />
      <SliderSetting
        label={t("settings.sync.minWordDuration.label")}
        description={t("settings.sync.minWordDuration.description")}
        settingKey="minWordDuration"
        min={0.01}
        max={0.2}
        step={0.01}
        format={(v) => `${(v * 1000).toFixed(0)}ms`}
      />
      <SelectSetting
        label={t("settings.sync.defaultGranularity.label")}
        description={t("settings.sync.defaultGranularity.description")}
        settingKey="defaultGranularity"
        options={[
          { value: "word", label: t("settings.sync.granularity.word") },
          { value: "line", label: t("settings.sync.granularity.line") },
        ]}
      />
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { SyncSection };
