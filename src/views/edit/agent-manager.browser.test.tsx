import { describe, expect, it } from "vitest";
import { AgentManager } from "@/views/edit/agent-manager";
import { DEFAULT_AGENTS, useProjectStore } from "@/stores/project";
import { render } from "@/test/render";

describe("AgentManager", () => {
  it("renders the default agent set", async () => {
    useProjectStore.setState({ agents: [...DEFAULT_AGENTS] });
    const screen = await render(<AgentManager />);
    expect(screen.container.textContent ?? "").not.toBe("");
  });

  it("renders an 'Add' button or trigger", async () => {
    useProjectStore.setState({ agents: [...DEFAULT_AGENTS] });
    const screen = await render(<AgentManager />);
    const buttons = screen.container.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThan(0);
  });
});
