import { useAppLanguage } from "@/lib/i18n";
import { useProjectStore } from "@/stores/project";
import type { SimpleTab } from "@/stores/project";
import { useSettingsStore } from "@/stores/settings";
import { InlineKeyBadge } from "@/ui/inline-key-badge";

const TabBar: React.FC = () => {
  const activeTab = useProjectStore((s) => s.activeTab);
  const setActiveTab = useProjectStore((s) => s.setActiveTab);
  const showHints = useSettingsStore((s) => s.showShortcutHints);
  const { t } = useAppLanguage();

  const tabs: { id: SimpleTab; label: string }[] = [
    { id: "import", label: t("tab.import") },
    { id: "edit", label: t("tab.edit") },
    { id: "sync", label: t("tab.sync") },
    { id: "timeline", label: t("tab.timeline") },
    { id: "preview", label: t("tab.preview") },
    { id: "export", label: t("tab.export") },
  ];

  return (
    <nav
      data-tour="tab-bar"
      className="hidden border-b border-calleditor-border select-none md:block"
    >
      <div className="hidden md:flex">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              data-tour={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "border-b-2 border-calleditor-accent text-calleditor-text"
                  : "text-calleditor-text-muted hover:text-calleditor-text-secondary"
              }`}
            >
              {tab.label}
              {showHints && <InlineKeyBadge keys={["Mod", String(index + 1)]} />}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export { TabBar };
