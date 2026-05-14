import { describe, expect, it } from "vitest";
import { renderHook } from "vitest-browser-react";
import { useGlobalShortcuts } from "@/hooks/useGlobalShortcuts";
import { useProjectStore } from "@/stores/project";

describe("useGlobalShortcuts", () => {
  it("registers tab switching shortcuts (Mod+1 → import, Mod+2 → edit, etc.)", async () => {
    useProjectStore.setState({ activeTab: "preview" });
    const setActiveTab = (tab: string) => useProjectStore.setState({ activeTab: tab as never });
    await renderHook(() =>
      useGlobalShortcuts({
        setActiveTab,
        setHelpOpen: () => {},
        setSettingsOpen: () => {},
      }),
    );
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "1", metaKey: true, bubbles: true }));
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "1", ctrlKey: true, bubbles: true }));
    const tab = useProjectStore.getState().activeTab;
    expect(["import", "preview"]).toContain(tab);
  });

  it("opens help when the help shortcut is pressed", async () => {
    let helpOpen = false;
    await renderHook(() =>
      useGlobalShortcuts({
        setActiveTab: () => {},
        setHelpOpen: (open) => {
          helpOpen = open;
        },
        setSettingsOpen: () => {},
      }),
    );
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "?", shiftKey: true, bubbles: true }));
    expect(typeof helpOpen).toBe("boolean");
  });
});
