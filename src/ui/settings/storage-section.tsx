import { useAppLanguage } from "@/lib/i18n";
import { SliderSetting } from "@/ui/settings/setting-controls";

// -- Storage Section ----------------------------------------------------------

const StorageSection: React.FC = () => {
  const { t } = useAppLanguage();

  return (
    <div className="divide-y divide-calleditor-border">
      <SliderSetting
        label={t("settings.storage.autoSaveDelay.label")}
        description={t("settings.storage.autoSaveDelay.description")}
        settingKey="autoSaveDelay"
        min={500}
        max={10000}
        step={500}
        format={(v) => `${(v / 1000).toFixed(1)}s`}
      />
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { StorageSection };
