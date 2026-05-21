import { HelpSectionContent } from "@/ui/help-sections";
import { useAppLanguage } from "@/lib/i18n";
import { Modal } from "@/ui/modal";
import { ModalNavLayout, type ModalNavSection } from "@/ui/modal-nav-layout";
import { KeyBadge } from "@/ui/shortcut-reference";
import { getEffectiveKeysArray } from "@/stores/shortcut-bindings";
import {
  IconAward,
  IconDownload,
  IconEye,
  IconHandClick,
  IconInfoHexagon,
  IconKeyboard,
  IconLayoutRows,
  IconLifebuoy,
  IconLink,
  IconMusic,
  IconPencil,
  IconRocket,
} from "@tabler/icons-react";
import { useState } from "react";

// -- Types --------------------------------------------------------------------

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// -- Data ---------------------------------------------------------------------

// -- Help Modal ---------------------------------------------------------------

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState("getting-started");
  const { t } = useAppLanguage();
  const helpSections: ModalNavSection[] = [
    {
      id: "getting-started",
      label: t("help.section.gettingStarted"),
      icon: IconRocket,
    },
    {
      id: "keyboard-shortcuts",
      label: t("help.section.keyboardShortcuts"),
      icon: IconKeyboard,
    },
    { id: "importing", label: t("help.section.importing"), icon: IconMusic },
    { id: "editing", label: t("help.section.editing"), icon: IconPencil },
    { id: "syncing", label: t("help.section.syncing"), icon: IconHandClick },
    { id: "timeline", label: t("help.section.timeline"), icon: IconLayoutRows },
    { id: "groups", label: t("help.section.groups"), icon: IconLink },
    { id: "preview", label: t("help.section.preview"), icon: IconEye },
    { id: "exporting", label: t("help.section.exporting"), icon: IconDownload },
    { id: "recovery", label: t("help.section.recovery"), icon: IconLifebuoy },
    { id: "ttml-standards", label: t("help.section.ttml"), icon: IconAward },
    { id: "about", label: t("help.section.about"), icon: IconInfoHexagon },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("help.title")}
      className="max-w-4xl h-[80%] flex flex-col"
      bodyClassName="p-0 flex-1 min-h-0 flex flex-col"
    >
      <ModalNavLayout
        sections={helpSections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        mobileLabel={t("help.title")}
        sidebarClassName="w-48"
        contentClassName="p-6"
      >
        <div data-help-content>
          <HelpSectionContent section={activeSection} />
        </div>
      </ModalNavLayout>

      <div className="px-5 py-3 border-t border-calleditor-border text-xs text-calleditor-text-muted text-center shrink-0 select-none flex items-center justify-center gap-1.5">
        <span>
          {t("help.openAnytime", { shortcut: "" }).replace("  ", " ").trim()}
        </span>
        {getEffectiveKeysArray("global.help").map((key) => (
          <KeyBadge key={key} keyName={key} />
        ))}
      </div>
    </Modal>
  );
};

// -- Exports ------------------------------------------------------------------

export { HelpModal };
