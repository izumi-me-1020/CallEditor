import { Button } from "@/ui/button";
import { useAppLanguage } from "@/lib/i18n";
import { useProjectStore } from "@/stores/project";
import type { SimpleTab } from "@/stores/project";
import { Popover } from "@/ui/popover";
import {
  IconDotsVertical,
  IconHelp,
  IconMenu2,
  IconRoute,
  IconSettings,
} from "@tabler/icons-react";

interface AppHeaderProps {
  onSettingsOpen: () => void;
  onHelpOpen: () => void;
  onTourStart: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  onSettingsOpen,
  onHelpOpen,
  onTourStart,
}) => {
  const { t } = useAppLanguage();
  const activeTab = useProjectStore((s) => s.activeTab);
  const setActiveTab = useProjectStore((s) => s.setActiveTab);
  const tabs: { id: SimpleTab; label: string }[] = [
    { id: "import", label: t("tab.import") },
    { id: "edit", label: t("tab.edit") },
    { id: "sync", label: t("tab.sync") },
    { id: "timeline", label: t("tab.timeline") },
    { id: "preview", label: t("tab.preview") },
    { id: "export", label: t("tab.export") },
  ];

  return (
    <header className="flex items-center justify-between gap-3 border-b border-calleditor-border p-4 select-none">
      <div className="flex min-w-0 items-center gap-2 md:items-baseline">
        <h1 className="truncate text-lg font-semibold md:text-xl">
          <img
            src="/logo.svg"
            alt="CallEditor Logo"
            className="mr-2 inline-block w-6 -mt-1"
          />
          CallEditor
        </h1>
        <a
          href="https://github.com/better-lyrics/calleditor"
          target="_blank"
          className="hidden text-xs text-calleditor-text-muted hover:underline md:inline"
        >
          Based on Composer by better-lyrics
        </a>
      </div>

      <div className="hidden items-center justify-end gap-1 md:flex">
        <Button
          size="icon"
          variant="ghost"
          onClick={onSettingsOpen}
          title={t("header.settings")}
        >
          <IconSettings className="size-5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={onTourStart}
          title={t("header.productTour")}
        >
          <IconRoute className="size-5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={onHelpOpen}
          title={t("help.title")}
        >
          <IconHelp className="size-5" />
        </Button>
      </div>

      <div className="flex items-center gap-1 md:hidden">
        <Popover
          placement="bottom-end"
          trigger={
            <Button
              size="icon"
              variant="ghost"
              title={t("action.more")}
              className="size-8"
            >
              <IconDotsVertical className="size-5" />
            </Button>
          }
        >
          {(close) => (
            <div className="flex w-44 flex-col gap-1 p-2">
              <Button
                size="sm"
                variant="ghost"
                hasIcon
                className="justify-start"
                onClick={() => {
                  onSettingsOpen();
                  close();
                }}
              >
                <IconSettings className="size-4" />
                {t("header.settings")}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                hasIcon
                className="justify-start"
                onClick={() => {
                  onTourStart();
                  close();
                }}
              >
                <IconRoute className="size-4" />
                {t("header.productTour")}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                hasIcon
                className="justify-start"
                onClick={() => {
                  onHelpOpen();
                  close();
                }}
              >
                <IconHelp className="size-4" />
                {t("help.title")}
              </Button>
            </div>
          )}
        </Popover>

        <Popover
          placement="bottom-end"
          trigger={
            <Button
              size="icon"
              variant="ghost"
              title={t("tab.mobileLabel")}
              className="size-8"
            >
              <IconMenu2 className="size-5" />
            </Button>
          }
        >
          {(close) => (
            <div className="flex w-44 flex-col gap-1 p-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  size="sm"
                  variant={activeTab === tab.id ? "primary" : "ghost"}
                  className="justify-start"
                  onClick={() => {
                    setActiveTab(tab.id);
                    close();
                  }}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          )}
        </Popover>
      </div>
    </header>
  );
};

export { AppHeader };
