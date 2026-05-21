import { useAppLanguage } from "@/lib/i18n";
import { ToggleSetting } from "@/ui/settings/setting-controls";

// -- Confirmations Section ----------------------------------------------------

const ConfirmationsSection: React.FC = () => {
  const { t } = useAppLanguage();

  return (
    <div className="py-3">
      <div className="flex flex-col gap-0.5 mb-3">
        <span className="text-sm font-medium text-calleditor-text">
          {t("settings.confirmations.title")}
        </span>
        <span className="text-xs text-calleditor-text-muted">
          {t("settings.confirmations.description")}
        </span>
      </div>
      <div className="divide-y divide-calleditor-border">
        <ToggleSetting
          label={t("settings.confirmations.replaceProject.label")}
          description={t("settings.confirmations.replaceProject.description")}
          settingKey="confirmReplaceProjectFromHash"
        />
        <ToggleSetting
          label={t("settings.confirmations.replaceLyrics.label")}
          description={t("settings.confirmations.replaceLyrics.description")}
          settingKey="confirmReplaceLyrics"
        />
        <ToggleSetting
          label={t("settings.confirmations.resetSync.label")}
          description={t("settings.confirmations.resetSync.description")}
          settingKey="confirmSyncReset"
        />
        <ToggleSetting
          label={t("settings.confirmations.clearProject.label")}
          description={t("settings.confirmations.clearProject.description")}
          settingKey="confirmClearProject"
        />
        <ToggleSetting
          label={t("settings.confirmations.resetSettings.label")}
          description={t("settings.confirmations.resetSettings.description")}
          settingKey="confirmResetSettings"
        />
        <ToggleSetting
          label={t("settings.confirmations.resetShortcuts.label")}
          description={t("settings.confirmations.resetShortcuts.description")}
          settingKey="confirmResetShortcuts"
        />
      </div>
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { ConfirmationsSection };
