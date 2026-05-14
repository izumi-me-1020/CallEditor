import { describe, expect, it } from "vitest";
import { ExportPanel } from "@/views/export";
import { useProjectStore } from "@/stores/project";
import { render } from "@/test/render";

describe("ExportPanel", () => {
  it("renders without crashing", async () => {
    useProjectStore.setState({ lines: [] });
    const screen = await render(<ExportPanel />);
    expect(screen.container).not.toBeNull();
  });
});
