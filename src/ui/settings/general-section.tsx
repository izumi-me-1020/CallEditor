import { useConfirm } from "@/stores/confirm-store";
import { getLanguageLabel, useAppLanguage } from "@/lib/i18n";
import { useSettingsStore } from "@/stores/settings";
import { Button } from "@/ui/button";
import { SelectSetting, ToggleSetting } from "@/ui/settings/setting-controls";
import { IconRefresh, IconRoute } from "@tabler/icons-react";

// -- General Section ----------------------------------------------------------

const GeneralSection: React.FC<{
  onResetTour: () => void;
  onClose: () => void;
}> = ({ onResetTour, onClose }) => {
  const resetToDefaults = useSettingsStore((s) => s.resetToDefaults);
  const preferredLanguage = useSettingsStore((s) => s.appLanguage);
  const confirm = useConfirm();
  const { language, t } = useAppLanguage();

  const handleResetSettings = async () => {
    const ok = await confirm({
      title: t("settings.confirmReset.title"),
      description: t("settings.confirmReset.description"),
      confirmLabel: t("settings.confirmReset.confirm"),
      variant: "destructive",
      settingsKey: "confirmResetSettings",
    });
    if (ok) resetToDefaults();
  };

  return (
    <div className="divide-y divide-calleditor-border">
      <div className="py-3">
        <SelectSetting
          label={t("settings.language.label")}
          description={t("settings.language.description")}
          settingKey="appLanguage"
          options={[
            { value: "auto", label: t("settings.language.option.auto") },
            { value: "en", label: t("settings.language.option.en") },
            { value: "ja", label: t("settings.language.option.ja") },
            { value: "ko", label: t("settings.language.option.ko") },
          ]}
        />
        {preferredLanguage === "auto" && (
          <p className="mt-1 text-xs text-calleditor-text-muted">
            {t("settings.language.autoInfo", {
              language: getLanguageLabel(language),
            })}
          </p>
        )}
      </div>
      <ToggleSetting
        label={t("settings.showShortcutHints.label")}
        description={t("settings.showShortcutHints.description")}
        settingKey="showShortcutHints"
      />
      <ToggleSetting
        label={t("settings.showSyllableIndicators.label")}
        description={t("settings.showSyllableIndicators.description")}
        settingKey="showSyllableIndicators"
      />
      <div className="flex items-center justify-between py-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-calleditor-text">
            {t("settings.resetTour.label")}
          </span>
          <span className="text-xs text-calleditor-text-muted">
            {t("settings.resetTour.description")}
          </span>
        </div>
        <Button
          size="sm"
          variant="secondary"
          hasIcon
          onClick={() => {
            onResetTour();
            onClose();
          }}
        >
          <IconRoute size={14} />
          {t("settings.resetTour.action")}
        </Button>
      </div>
      <div className="flex items-center justify-between py-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-calleditor-text">
            {t("settings.resetDefaults.label")}
          </span>
          <span className="text-xs text-calleditor-text-muted">
            {t("settings.resetDefaults.description")}
          </span>
        </div>
        <Button
          size="sm"
          variant="secondary"
          hasIcon
          onClick={handleResetSettings}
        >
          <IconRefresh size={14} />
          {t("settings.resetDefaults.action")}
        </Button>
      </div>
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { GeneralSection };
