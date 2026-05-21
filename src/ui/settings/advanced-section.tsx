import { useAppLanguage } from "@/lib/i18n";
import { useSettingsStore } from "@/stores/settings";
import { SelectSetting } from "@/ui/settings/setting-controls";

// -- Advanced Section ---------------------------------------------------------

const AdvancedSection: React.FC = () => {
  const { t } = useAppLanguage();
  useSettingsStore();

  return (
    <div>
      <SelectSetting
        label={t("settings.advanced.previewRenderer.label")}
        description={t("settings.advanced.previewRenderer.description")}
        settingKey="previewRenderer"
        options={[
          { value: "braccato", label: t("settings.advanced.previewRenderer.braccato") },
          { value: "am-lyrics", label: "am-lyrics" },
        ]}
      />
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { AdvancedSection };
