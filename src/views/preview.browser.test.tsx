import { describe, expect, it } from "vitest";
import { PreviewPanel } from "@/views/preview";
import { useProjectStore } from "@/stores/project";
import { render } from "@/test/render";

describe("PreviewPanel", () => {
  it("renders without crashing", async () => {
    useProjectStore.setState({ lines: [] });
    const screen = await render(<PreviewPanel />);
    expect(screen.container).not.toBeNull();
  });
});
