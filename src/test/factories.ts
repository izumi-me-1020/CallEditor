import { DEFAULT_AGENTS } from "@/stores/project";

interface FactoryLineOptions {
  id?: string;
  text?: string;
  agentId?: string;
  begin?: number;
  end?: number;
  words?: FactoryWordOptions[];
  backgroundText?: string;
  backgroundWords?: FactoryWordOptions[];
  groupId?: string;
  instanceIdx?: number;
}

interface FactoryWordOptions {
  text: string;
  begin: number;
  end: number;
  explicit?: true;
}

interface FactoryAgentOptions {
  id?: string;
  type?: "person" | "character" | "group" | "organization" | "other";
  name?: string;
}

interface FactoryGroupOptions {
  id?: string;
  label?: string;
  color?: string;
  templateVersion?: number;
}

let lineCounter = 0;
let groupCounter = 0;
let agentCounter = 0;

function createWord(opts: FactoryWordOptions): FactoryWordOptions {
  return { text: opts.text, begin: opts.begin, end: opts.end, explicit: opts.explicit };
}

function createLine(opts: FactoryLineOptions = {}) {
  const id = opts.id ?? `line-${++lineCounter}`;
  const text = opts.text ?? "Test lyric line";
  const agentId = opts.agentId ?? DEFAULT_AGENTS[0]?.id ?? "v1";
  return {
    id,
    text,
    agentId,
    ...(opts.begin !== undefined ? { begin: opts.begin } : {}),
    ...(opts.end !== undefined ? { end: opts.end } : {}),
    ...(opts.words ? { words: opts.words.map(createWord) } : {}),
    ...(opts.backgroundText ? { backgroundText: opts.backgroundText } : {}),
    ...(opts.backgroundWords ? { backgroundWords: opts.backgroundWords.map(createWord) } : {}),
    ...(opts.groupId ? { groupId: opts.groupId } : {}),
    ...(opts.instanceIdx !== undefined ? { instanceIdx: opts.instanceIdx } : {}),
  };
}

function createAgent(opts: FactoryAgentOptions = {}) {
  const id = opts.id ?? `agent-${++agentCounter}`;
  return {
    id,
    type: opts.type ?? "person",
    ...(opts.name ? { name: opts.name } : {}),
  };
}

function createGroup(opts: FactoryGroupOptions = {}) {
  const id = opts.id ?? `group-${++groupCounter}`;
  return {
    id,
    label: opts.label ?? `Group ${groupCounter}`,
    color: opts.color ?? "#a3c9ff",
    templateVersion: opts.templateVersion ?? 0,
  };
}

function createFile(name: string, type: string, content: string | ArrayBuffer | Blob): File {
  const parts: BlobPart[] = [content as BlobPart];
  return new File(parts, name, { type });
}

function resetFactoryCounters() {
  lineCounter = 0;
  groupCounter = 0;
  agentCounter = 0;
}

export { createLine, createWord, createAgent, createGroup, createFile, resetFactoryCounters };
export type { FactoryLineOptions, FactoryWordOptions, FactoryAgentOptions, FactoryGroupOptions };
