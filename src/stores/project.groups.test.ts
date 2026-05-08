/**
 * @vitest-environment node
 */
import { type LinkGroup, type LyricLine, useProjectStore } from "@/stores/project";
import { beforeEach, describe, expect, it } from "vitest";

beforeEach(() => {
  useProjectStore.getState().reset();
  useProjectStore.getState().clearHistory();
});

function seedGroup(id: string, overrides: Partial<LinkGroup> = {}): LinkGroup {
  return { id, label: "Chorus", color: "#f472b6", templateVersion: 1, ...overrides };
}

describe("project store · group types", () => {
  it("ProjectState includes empty groups array initially", () => {
    expect(useProjectStore.getState().groups).toEqual([]);
  });

  it("LyricLine accepts optional group fields", () => {
    const line: LyricLine = {
      id: "l1",
      text: "I love you",
      agentId: "v1",
      groupId: "g1",
      instanceIdx: 0,
      templateLineIdx: 0,
      detached: false,
    };
    expect(line.groupId).toBe("g1");
    expect(line.instanceIdx).toBe(0);
    expect(line.templateLineIdx).toBe(0);
    expect(line.detached).toBe(false);
  });

  it("LinkGroup has the expected shape", () => {
    const g: LinkGroup = { id: "g1", label: "Chorus", color: "#f472b6", templateVersion: 1 };
    expect(g.id).toBe("g1");
    expect(g.label).toBe("Chorus");
    expect(g.color).toBe("#f472b6");
    expect(g.templateVersion).toBe(1);
  });
});

describe("project store · history captures groups", () => {
  it("undo restores groups alongside lines", () => {
    const initialGroups = [seedGroup("g1")];
    useProjectStore.setState({ groups: initialGroups, lines: [] });

    useProjectStore
      .getState()
      .setLinesWithHistory([{ id: "l1", text: "test", agentId: "v1", groupId: "g1" }]);

    useProjectStore.setState({ groups: [] });

    useProjectStore
      .getState()
      .setLinesWithHistory([{ id: "l2", text: "test2", agentId: "v1" }]);

    useProjectStore.getState().undo();

    expect(useProjectStore.getState().groups).toEqual(initialGroups);
  });

  it("redo restores the post-edit groups", () => {
    useProjectStore.setState({ groups: [seedGroup("g1")], lines: [] });

    useProjectStore.getState().setLinesWithHistory([{ id: "l1", text: "a", agentId: "v1" }]);

    useProjectStore.setState({ groups: [seedGroup("g1"), seedGroup("g2", { label: "Verse" })] });

    useProjectStore.getState().setLinesWithHistory([{ id: "l2", text: "b", agentId: "v1" }]);

    useProjectStore.getState().undo();
    expect(useProjectStore.getState().groups.map((g) => g.id)).toEqual(["g1"]);

    useProjectStore.getState().redo();
    expect(useProjectStore.getState().groups.map((g) => g.id)).toEqual(["g1", "g2"]);
  });

  it("commitHistory snapshots groups (verified through moveWordToBg path)", () => {
    useProjectStore.setState({ groups: [seedGroup("g1")] });
    const before = useProjectStore.getState().groups;

    useProjectStore.setState({
      lines: [
        {
          id: "l1",
          text: "hi there",
          agentId: "v1",
          words: [
            { text: "hi ", begin: 0, end: 1 },
            { text: "there", begin: 1, end: 2 },
          ],
        },
      ],
    });

    useProjectStore.getState().moveWordToBg("l1", [0], 0, 60);
    useProjectStore.getState().undo();

    expect(useProjectStore.getState().groups).toEqual(before);
  });
});

describe("project store · group registry mutators", () => {
  it("addGroup pushes to registry with history", () => {
    useProjectStore.getState().addGroup(seedGroup("g1"));
    expect(useProjectStore.getState().groups).toHaveLength(1);
    expect(useProjectStore.getState().groups[0].label).toBe("Chorus");
    expect(useProjectStore.getState().canUndo()).toBe(true);
  });

  it("addGroup is undoable", () => {
    useProjectStore.getState().addGroup(seedGroup("g1"));
    useProjectStore.getState().undo();
    expect(useProjectStore.getState().groups).toHaveLength(0);
  });

  it("updateGroup merges fields", () => {
    useProjectStore.getState().addGroup(seedGroup("g1"));
    useProjectStore.getState().updateGroup("g1", { label: "Refrain", color: "#60a5fa" });

    const g = useProjectStore.getState().groups[0];
    expect(g.label).toBe("Refrain");
    expect(g.color).toBe("#60a5fa");
    expect(g.templateVersion).toBe(1);
  });

  it("updateGroup leaves other groups untouched", () => {
    useProjectStore.getState().addGroup(seedGroup("g1"));
    useProjectStore.getState().addGroup(seedGroup("g2", { label: "Verse" }));

    useProjectStore.getState().updateGroup("g1", { label: "Refrain" });

    const groups = useProjectStore.getState().groups;
    expect(groups.find((g) => g.id === "g1")?.label).toBe("Refrain");
    expect(groups.find((g) => g.id === "g2")?.label).toBe("Verse");
  });

  it("removeGroup deletes registry entry and clears group fields on lines", () => {
    useProjectStore.getState().addGroup(seedGroup("g1"));
    useProjectStore.setState({
      lines: [
        {
          id: "l1",
          text: "test",
          agentId: "v1",
          groupId: "g1",
          instanceIdx: 0,
          templateLineIdx: 0,
        },
        {
          id: "l2",
          text: "untouched",
          agentId: "v1",
        },
      ],
    });

    useProjectStore.getState().removeGroup("g1");

    expect(useProjectStore.getState().groups).toHaveLength(0);
    expect(useProjectStore.getState().lines[0].groupId).toBeUndefined();
    expect(useProjectStore.getState().lines[0].instanceIdx).toBeUndefined();
    expect(useProjectStore.getState().lines[0].templateLineIdx).toBeUndefined();
    expect(useProjectStore.getState().lines[1].text).toBe("untouched");
  });

  it("removeGroup is undoable (group + line fields restored together)", () => {
    useProjectStore.getState().addGroup(seedGroup("g1"));
    useProjectStore
      .getState()
      .setLinesWithHistory([
        { id: "l1", text: "test", agentId: "v1", groupId: "g1", instanceIdx: 0, templateLineIdx: 0 },
      ]);

    useProjectStore.getState().removeGroup("g1");
    expect(useProjectStore.getState().groups).toHaveLength(0);
    expect(useProjectStore.getState().lines[0].groupId).toBeUndefined();

    useProjectStore.getState().undo();
    expect(useProjectStore.getState().groups).toHaveLength(1);
    expect(useProjectStore.getState().lines[0].groupId).toBe("g1");
    expect(useProjectStore.getState().lines[0].instanceIdx).toBe(0);
  });
});
