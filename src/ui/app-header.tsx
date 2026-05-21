import { Button } from "@/ui/button";
import { useAppLanguage } from "@/lib/i18n";
import { IconHelp, IconRoute, IconSettings } from "@tabler/icons-react";

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

  return (
    <header className="flex flex-col gap-3 p-4 border-b select-none md:flex-row md:items-center md:justify-between border-calleditor-border">
      <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-2">
        <h1 className="text-xl font-semibold">
          <img
            src="/logo.svg"
            alt="CallEditor Logo"
            className="inline-block w-6 mr-2 -mt-1"
          />
          CallEditor
        </h1>
        <a
          href="https://github.com/better-lyrics/calleditor"
          target="_blank"
          className="text-xs text-calleditor-text-muted hover:underline"
        >
          Based on Composer by better-lyrics
        </a>
      </div>

      <div className="flex items-center justify-end gap-1">
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
          title={t("header.keyboardShortcuts")}
        >
          <IconHelp className="size-5" />
        </Button>
      </div>
    </header>
  );
};

export { AppHeader };
