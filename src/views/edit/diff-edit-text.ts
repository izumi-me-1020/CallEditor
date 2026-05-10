import { extractLinkedFields } from "@/stores/project";
import type { LyricLine } from "@/stores/project";

// -- Types --------------------------------------------------------------------

interface ContentUpdate {
  id: string;
  updates: Partial<LyricLine>;
}

interface DiffResult {
  contentUpdates: ContentUpdate[];
  hasStructuralChange: boolean;
}

// -- Constants ----------------------------------------------------------------

const TIMING_CLEAR_FIELDS = ["words", "begin", "end", "backgroundWords"] as const;
const CONTENT_FIELDS = ["text", "agentId", "backgroundText"] as const;

// -- Helpers ------------------------------------------------------------------

function diffEditTextChange(oldLines: LyricLine[], newLines: LyricLine[]): DiffResult {
  if (oldLines.length !== newLines.length) {
    return { contentUpdates: [], hasStructuralChange: true };
  }

  for (let i = 0; i < oldLines.length; i++) {
    if (oldLines[i].id !== newLines[i].id) {
      return { contentUpdates: [], hasStructuralChange: true };
    }
  }

  const contentUpdates: ContentUpdate[] = [];
  for (let i = 0; i < oldLines.length; i++) {
    const oldLine = oldLines[i];
    const newLine = newLines[i];
    const updates: Partial<LyricLine> = {};

    for (const field of CONTENT_FIELDS) {
      if (oldLine[field] !== newLine[field]) {
        (updates as Record<string, unknown>)[field] = newLine[field];
      }
    }

    for (const field of TIMING_CLEAR_FIELDS) {
      if (oldLine[field] !== undefined && newLine[field] === undefined) {
        (updates as Record<string, unknown>)[field] = undefined;
      }
    }

    if (Object.keys(updates).length > 0) {
      contentUpdates.push({ id: oldLine.id, updates });
    }
  }

  return { contentUpdates, hasStructuralChange: false };
}

interface ImpactedInstance {
  groupId: string;
  instanceIdx: number;
}

function instancesByKey(lines: LyricLine[]): Map<string, Set<string>> {
  const out = new Map<string, Set<string>>();
  for (const line of lines) {
    if (line.groupId === undefined || line.instanceIdx === undefined) continue;
    const key = `${line.groupId}:${line.instanceIdx}`;
    let bucket = out.get(key);
    if (!bucket) {
      bucket = new Set();
      out.set(key, bucket);
    }
    bucket.add(line.id);
  }
  return out;
}

function findStructurallyImpactedInstances(oldLines: LyricLine[], newLines: LyricLine[]): ImpactedInstance[] {
  const oldByKey = instancesByKey(oldLines);
  const newByKey = instancesByKey(newLines);

  const impacted: ImpactedInstance[] = [];
  for (const [key, oldIds] of oldByKey) {
    const newIds = newByKey.get(key) ?? new Set<string>();
    let differs = oldIds.size !== newIds.size;
    if (!differs) {
      for (const id of oldIds) {
        if (!newIds.has(id)) {
          differs = true;
          break;
        }
      }
    }
    if (differs) {
      const [groupId, instanceIdxStr] = key.split(":");
      impacted.push({ groupId, instanceIdx: Number.parseInt(instanceIdxStr, 10) });
    }
  }
  return impacted;
}

function detachInstancesFromLines(lines: LyricLine[], instances: ImpactedInstance[]): LyricLine[] {
  if (instances.length === 0) return lines;
  const impactedKeys = new Set(instances.map((i) => `${i.groupId}:${i.instanceIdx}`));

  return lines.map((line) => {
    if (line.groupId === undefined || line.instanceIdx === undefined) return line;
    if (!impactedKeys.has(`${line.groupId}:${line.instanceIdx}`)) return line;
    return {
      ...line,
      groupId: undefined,
      instanceIdx: undefined,
      templateLineIdx: undefined,
      detached: undefined,
    };
  });
}

function propagateContentUpdates(lines: LyricLine[], contentUpdates: ContentUpdate[]): LyricLine[] {
  if (contentUpdates.length === 0) return lines;

  const updatesById = new Map<string, ContentUpdate>();
  for (const update of contentUpdates) {
    updatesById.set(update.id, update);
  }

  const linkedScopes: Array<{ groupId: string; templateLineIdx: number; linkedUpdate: Partial<LyricLine> }> = [];
  for (const update of contentUpdates) {
    const source = lines.find((line) => line.id === update.id);
    if (!source) continue;
    if (source.groupId === undefined || source.templateLineIdx === undefined || source.detached) continue;
    const linkedUpdate = extractLinkedFields(update.updates);
    if (Object.keys(linkedUpdate).length === 0) continue;
    linkedScopes.push({
      groupId: source.groupId,
      templateLineIdx: source.templateLineIdx,
      linkedUpdate,
    });
  }

  if (linkedScopes.length === 0) return lines;

  return lines.map((line) => {
    if (updatesById.has(line.id)) return line;
    if (line.groupId === undefined || line.templateLineIdx === undefined || line.detached) return line;

    const merged: Partial<LyricLine> = {};
    for (const scope of linkedScopes) {
      if (line.groupId !== scope.groupId) continue;
      if (line.templateLineIdx !== scope.templateLineIdx) continue;
      Object.assign(merged, scope.linkedUpdate);
    }
    if (Object.keys(merged).length === 0) return line;
    return { ...line, ...merged };
  });
}

// -- Exports ------------------------------------------------------------------

export { detachInstancesFromLines, diffEditTextChange, findStructurallyImpactedInstances, propagateContentUpdates };
export type { ContentUpdate, DiffResult, ImpactedInstance };
