import { Modal } from "@/ui/modal";
import { ModalNavLayout, type ModalNavSection } from "@/ui/modal-nav-layout";
import { AdvancedSection } from "@/ui/settings/advanced-section";
import { ConfirmationsSection } from "@/ui/settings/confirmations-section";
import { GeneralSection } from "@/ui/settings/general-section";
import { PlaybackSection } from "@/ui/settings/playback-section";
import { StorageSection } from "@/ui/settings/storage-section";
import { SyncSection } from "@/ui/settings/sync-section";
import { TimelineSection } from "@/ui/settings/timeline-section";
import { ShortcutsSettingsSection } from "@/ui/shortcuts-settings-section";
import { useAppLanguage } from "@/lib/i18n";
import {
  IconAlertTriangle,
  IconClock,
  IconDeviceFloppy,
  IconKeyboard,
  IconLayoutRows,
  IconPlayerPlay,
  IconPlugConnected,
  IconSettings,
} from "@tabler/icons-react";
import { useState } from "react";

// -- Types --------------------------------------------------------------------

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetTour: () => void;
}

// -- Sections -----------------------------------------------------------------

// -- Section Map --------------------------------------------------------------

const SECTION_CONTENT: Record<
  string,
  React.FC<{ onResetTour: () => void; onClose: () => void }>
> = {
  playback: PlaybackSection,
  timeline: TimelineSection,
  sync: SyncSection,
  shortcuts: ShortcutsSettingsSection,
  confirmations: ConfirmationsSection,
  storage: StorageSection,
  advanced: AdvancedSection,
  general: GeneralSection,
};

// -- Settings Modal -----------------------------------------------------------

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onResetTour,
}) => {
  const [activeSection, setActiveSection] = useState("general");
  const { t } = useAppLanguage();

  const sections: ModalNavSection[] = [
    { id: "general", label: t("settings.section.general"), icon: IconSettings },
    {
      id: "playback",
      label: t("settings.section.playback"),
      icon: IconPlayerPlay,
    },
    {
      id: "timeline",
      label: t("settings.section.timeline"),
      icon: IconLayoutRows,
    },
    { id: "sync", label: t("settings.section.sync"), icon: IconClock },
    {
      id: "shortcuts",
      label: t("settings.section.shortcuts"),
      icon: IconKeyboard,
    },
    {
      id: "confirmations",
      label: t("settings.section.confirmations"),
      icon: IconAlertTriangle,
    },
    {
      id: "storage",
      label: t("settings.section.storage"),
      icon: IconDeviceFloppy,
    },
    {
      id: "advanced",
      label: t("settings.section.advanced"),
      icon: IconPlugConnected,
    },
  ];

  const Content = SECTION_CONTENT[activeSection];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("settings.title")}
      className="max-w-3xl h-[70%] flex flex-col"
      bodyClassName="p-0 flex-1 min-h-0 flex flex-col"
    >
      <ModalNavLayout
        sections={sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        mobileLabel={t("settings.title")}
        contentClassName="px-6 py-2"
      >
        {Content && <Content onResetTour={onResetTour} onClose={onClose} />}
      </ModalNavLayout>

      <div className="px-5 py-3 border-t border-calleditor-border text-xs text-calleditor-text-muted text-center shrink-0 select-none">
        {t("settings.savedAutomatically")}
      </div>
    </Modal>
  );
};

// -- Exports ------------------------------------------------------------------

export { SettingsModal };
