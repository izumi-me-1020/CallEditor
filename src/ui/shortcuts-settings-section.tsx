import { useConfirm } from "@/stores/confirm-store";
import {
  getEffectiveKeysArray,
  useShortcutBindingsStore,
} from "@/stores/shortcut-bindings";
import {
  type ShortcutScope,
  getShortcutsByScope,
} from "@/stores/shortcut-registry";
import { useAppLanguage } from "@/lib/i18n";
import { Button } from "@/ui/button";
import { ShortcutRebindRow } from "@/ui/shortcut-rebind-row";
import { IconRefresh, IconSearch, IconX } from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// -- Constants ----------------------------------------------------------------

// -- Component ----------------------------------------------------------------

const ShortcutsSettingsSection: React.FC = () => {
  const resetAllBindings = useShortcutBindingsStore((s) => s.resetAllBindings);
  const overrides = useShortcutBindingsStore((s) => s.overrides);
  const hasOverrides = Object.keys(overrides).length > 0;
  const confirm = useConfirm();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const { t } = useAppLanguage();

  const scopeGroups: { scope: ShortcutScope; title: string }[] = [
    { scope: "global", title: t("shortcutsSettings.general") },
    { scope: "sync", title: t("shortcutsSettings.sync") },
    { scope: "timeline", title: t("shortcutsSettings.timeline") },
  ];

  const scrollPanelToTop = useCallback(() => {
    let parent: HTMLElement | null = searchRef.current?.parentElement ?? null;
    while (parent) {
      const overflowY = window.getComputedStyle(parent).overflowY;
      if (overflowY === "auto" || overflowY === "scroll") {
        parent.scrollTop = 0;
        return;
      }
      parent = parent.parentElement;
    }
  }, []);

  useEffect(() => {
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(focusTimer);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;
      if (e.key.length !== 1) return;
      e.preventDefault();
      inputRef.current?.focus({ preventScroll: true });
      scrollPanelToTop();
      setQuery((prev) => prev + e.key);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [scrollPanelToTop]);

  const handleResetShortcuts = async () => {
    const ok = await confirm({
      title: t("shortcutsSettings.resetTitle"),
      description: t("shortcutsSettings.resetDescription"),
      confirmLabel: t("shortcutsSettings.resetConfirm"),
      variant: "destructive",
      settingsKey: "confirmResetShortcuts",
    });
    if (ok) resetAllBindings();
  };

  const filteredScopes = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return scopeGroups.flatMap(({ scope, title }) => {
      const shortcuts = getShortcutsByScope(scope).filter((def) => {
        if (trimmed.length === 0) return true;
        if (def.description.toLowerCase().includes(trimmed)) return true;
        if (def.id.toLowerCase().includes(trimmed)) return true;
        if (title.toLowerCase().includes(trimmed)) return true;
        const keys = getEffectiveKeysArray(def.id).join(" ").toLowerCase();
        return keys.includes(trimmed);
      });
      return shortcuts.length > 0 ? [{ scope, title, shortcuts }] : [];
    });
  }, [query, scopeGroups]);

  return (
    <div className="space-y-6 py-4">
      <div ref={searchRef} className="relative">
        <IconSearch
          size={12}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-calleditor-text opacity-50 pointer-events-none"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            scrollPanelToTop();
          }}
          placeholder={t("shortcutsSettings.searchPlaceholder")}
          className="w-full h-7 pl-7 pr-7 text-xs rounded-md bg-calleditor-input border border-calleditor-border focus:outline-none focus:border-calleditor-accent text-calleditor-text placeholder:text-calleditor-text-muted"
        />
        {query.length > 0 && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label={t("shortcutsSettings.clearSearch")}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-0.5 rounded text-calleditor-text opacity-50 hover:opacity-100 hover:bg-calleditor-button cursor-pointer transition-opacity"
          >
            <IconX size={11} />
          </button>
        )}
      </div>

      {filteredScopes.length === 0 ? (
        <p className="text-sm text-calleditor-text-muted text-center py-6">
          {t("shortcutsSettings.noMatch", { query })}
        </p>
      ) : (
        filteredScopes.map(({ scope, title, shortcuts }) => (
          <div key={scope}>
            <h3 className="mb-1 text-xs font-medium tracking-wide text-calleditor-text-muted">
              {title}
            </h3>
            <div className="divide-y divide-calleditor-border">
              {shortcuts.map((def) => (
                <ShortcutRebindRow key={def.id} definition={def} />
              ))}
            </div>
          </div>
        ))
      )}

      <div className="flex items-center justify-between pt-2 border-t border-calleditor-border">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-calleditor-text">
            {t("shortcutsSettings.resetAllLabel")}
          </span>
          <span className="text-xs text-calleditor-text-muted">
            {t("shortcutsSettings.resetAllDescription")}
          </span>
        </div>
        <Button
          size="sm"
          variant="secondary"
          hasIcon
          onClick={handleResetShortcuts}
          disabled={!hasOverrides}
        >
          <IconRefresh size={14} />
          {t("shortcutsSettings.resetAllAction")}
        </Button>
      </div>
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { ShortcutsSettingsSection };
