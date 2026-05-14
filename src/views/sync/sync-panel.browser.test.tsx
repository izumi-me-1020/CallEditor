import { describe, expect, it } from "vitest";
import { SyncPanel } from "@/views/sync/sync-panel";
import { useProjectStore } from "@/stores/project";
import { render } from "@/test/render";

describe("SyncPanel", () => {
  it("renders without crashing for an empty project", async () => {
    useProjectStore.setState({ lines: [] });
    const screen = await render(<SyncPanel />);
    expect(screen.container).not.toBeNull();
  });
});
