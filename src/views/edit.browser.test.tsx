import { describe, expect, it } from "vitest";
import { EditPanel } from "@/views/edit";
import { useProjectStore } from "@/stores/project";
import { render } from "@/test/render";

describe("EditPanel", () => {
  it("renders without crashing for an empty project", async () => {
    useProjectStore.setState({ lines: [] });
    const screen = await render(<EditPanel />);
    expect(screen.container).not.toBeNull();
  });

  it("renders a textarea or contenteditable region for editing lyrics", async () => {
    useProjectStore.setState({ lines: [] });
    const screen = await render(<EditPanel />);
    const editable = screen.container.querySelector("textarea, [contenteditable]");
    expect(editable).not.toBeNull();
  });
});
