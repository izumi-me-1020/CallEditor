import {
  exportProjectToFile,
  importProjectFromFile,
  clearCurrentProject,
  cancelPendingSave,
} from "@/lib/persistence";
import { useAppLanguage } from "@/lib/i18n";
import { useAudioStore } from "@/stores/audio";
import { useConfirm } from "@/stores/confirm-store";
import { useProjectStore } from "@/stores/project";
import { Button } from "@/ui/button";
import { EmptyState } from "@/ui/empty-state";
import { Scroll } from "@/ui/scroll";
import { effectiveBounds } from "@/domain/line/bounds";
import { generateTTML } from "@/utils/ttml";
import {
  IconCheck,
  IconCopy,
  IconDownload,
  IconEdit,
  IconFolderOpen,
  IconRefresh,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import { Highlight, themes } from "prism-react-renderer";
import { useCallback, useMemo, useRef, useState } from "react";

// -- Components ---------------------------------------------------------------

const ExportPanel: React.FC = () => {
  const metadata = useProjectStore((s) => s.metadata);
  const agents = useProjectStore((s) => s.agents);
  const lines = useProjectStore((s) => s.lines);
  const groups = useProjectStore((s) => s.groups);
  const granularity = useProjectStore((s) => s.granularity);
  const duration = useAudioStore((s) => s.duration);
  const setMetadata = useProjectStore((s) => s.setMetadata);
  const setLines = useProjectStore((s) => s.setLines);
  const setGranularity = useProjectStore((s) => s.setGranularity);
  const setAgents = useProjectStore((s) => s.setAgents);
  const reset = useProjectStore((s) => s.reset);
  const markClean = useProjectStore((s) => s.markClean);
  const confirm = useConfirm();
  const { t, language } = useAppLanguage();

  const [copied, setCopied] = useState(false);
  const [editState, setEditState] = useState<{
    source: string;
    content: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasSyncedContent = useMemo(() => {
    return lines.some((line) => effectiveBounds(line) !== null);
  }, [lines]);

  const syncedLineCount = useMemo(() => {
    return lines.filter((line) => effectiveBounds(line) !== null).length;
  }, [lines]);

  const generatedTtml = useMemo(() => {
    if (!hasSyncedContent) return "";
    return generateTTML({
      metadata,
      agents,
      lines,
      groups,
      granularity,
      duration,
    });
  }, [
    metadata,
    agents,
    lines,
    groups,
    granularity,
    duration,
    hasSyncedContent,
  ]);

  const minifiedTtml = useMemo(() => {
    if (!hasSyncedContent) return "";
    return generateTTML({
      metadata,
      agents,
      lines,
      groups,
      granularity,
      minify: true,
      duration,
    });
  }, [
    metadata,
    agents,
    lines,
    groups,
    granularity,
    duration,
    hasSyncedContent,
  ]);

  const editedContent =
    editState && editState.source === generatedTtml ? editState.content : null;
  const isEditing = editedContent !== null;
  const displayContent = editedContent ?? generatedTtml;
  const exportContent = editedContent ?? minifiedTtml;

  const handleDownload = useCallback(() => {
    if (!exportContent) return;

    const blob = new Blob([exportContent], {
      type: "application/ttml+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${metadata.title || "lyrics"}.ttml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [exportContent, metadata.title]);

  const handleCopy = useCallback(async () => {
    if (!exportContent) return;

    await navigator.clipboard.writeText(exportContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [exportContent]);

  const handleEdit = useCallback(() => {
    setEditState((prev) =>
      prev ? null : { source: generatedTtml, content: displayContent },
    );
  }, [generatedTtml, displayContent]);

  const handleRegenerate = useCallback(() => {
    setEditState(null);
  }, []);

  const handleExportProject = useCallback(() => {
    const audioSource = useAudioStore.getState().source;
    const audioFileName =
      audioSource?.type === "file" ? audioSource.file.name : undefined;
    const dismissed = useProjectStore.getState().dismissedSuggestions;
    const dismissedExplicit =
      useProjectStore.getState().dismissedExplicitSuggestions;
    exportProjectToFile(
      metadata,
      agents,
      lines,
      groups,
      granularity,
      dismissed,
      dismissedExplicit,
      audioFileName,
    );
  }, [metadata, agents, lines, groups, granularity]);

  const handleImportProject = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const existingLineCount = useProjectStore.getState().lines.length;
      if (existingLineCount > 0) {
        const ok = await confirm({
          title: t("export.confirmReplace.title"),
          description: `Loading this project file will replace your ${existingLineCount} existing line${existingLineCount === 1 ? "" : "s"} and metadata. This cannot be undone.`,
          confirmLabel: t("export.confirmReplace.confirm"),
          variant: "destructive",
          settingsKey: "confirmReplaceLyrics",
        });
        if (!ok) {
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }
      }

      const project = await importProjectFromFile(file);
      setMetadata(project.metadata);
      setLines(project.lines);
      useProjectStore.getState().setGroups(project.groups ?? []);
      useProjectStore
        .getState()
        .setDismissedSuggestions(project.dismissedSuggestions ?? []);
      useProjectStore
        .getState()
        .setDismissedExplicitSuggestions(
          project.dismissedExplicitSuggestions ?? [],
        );
      setGranularity(project.granularity);
      setAgents(project.agents);
      markClean();

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [setMetadata, setLines, setGranularity, setAgents, markClean, confirm],
  );

  const handleClearProject = useCallback(async () => {
    const ok = await confirm({
      title: t("export.confirmClear.title"),
      description: t("export.confirmClear.description"),
      confirmLabel: t("export.confirmClear.confirm"),
      variant: "destructive",
      settingsKey: "confirmClearProject",
    });
    if (!ok) return;
    cancelPendingSave();
    reset();
    await clearCurrentProject();
  }, [reset, confirm]);

  const importAction = (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.ttml-project.json"
        onChange={handleImportProject}
        className="hidden"
      />
      <Button
        hasIcon
        variant="secondary"
        onClick={() => fileInputRef.current?.click()}
        className="mt-2"
      >
        <IconFolderOpen className="size-4 text-calleditor-text opacity-50" />
        {t("export.importProject")}
      </Button>
    </>
  );

  if (lines.length === 0) {
    return (
      <div className="flex flex-col flex-1 p-4">
        <EmptyState
          message={t("export.empty.noLyrics")}
          hint={t("export.empty.noLyricsHint")}
          action={importAction}
        />
      </div>
    );
  }

  if (!hasSyncedContent) {
    return (
      <div className="flex flex-col flex-1 p-4">
        <EmptyState
          message={t("export.empty.noSynced")}
          hint={t("export.empty.noSyncedHint")}
          action={importAction}
        />
      </div>
    );
  }

  return (
    <div
      data-tour="export-panel"
      className="flex flex-col flex-1 overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col gap-3 px-4 py-4 border-b border-calleditor-border md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex items-baseline gap-3">
          <h2 className="text-lg font-medium">{t("export.title")}</h2>
          <span className="text-sm text-calleditor-text-muted">
            {new Intl.NumberFormat(language).format(syncedLineCount)}/
            {new Intl.NumberFormat(language).format(lines.length)} lines synced
            {editedContent !== null && ` · ${t("export.edited")}`}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {editedContent !== null && (
            <Button hasIcon onClick={handleRegenerate}>
              <IconRefresh className="size-4" />
              {t("export.regenerate")}
            </Button>
          )}
          <Button
            hasIcon
            variant={isEditing ? "primary" : "secondary"}
            onClick={handleEdit}
          >
            <IconEdit className="size-4" />
            {isEditing ? t("export.done") : t("export.edit")}
          </Button>
          <Button hasIcon onClick={handleCopy}>
            {copied ? (
              <IconCheck className="size-4" />
            ) : (
              <IconCopy className="size-4" />
            )}
            {copied ? t("export.copied") : t("export.copy")}
          </Button>
          <Button hasIcon variant="primary" onClick={handleDownload}>
            <IconDownload className="size-4" />
            {t("export.download")}
          </Button>
        </div>
      </div>

      {/* Project management */}
      <div className="flex flex-col gap-3 px-4 py-3 border-b border-calleditor-border bg-calleditor-bg-elevated/50 md:flex-row md:items-center md:justify-between md:px-6">
        <span className="text-sm text-calleditor-text-muted">
          {t("export.project")}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.ttml-project.json"
            onChange={handleImportProject}
            className="hidden"
          />
          <Button
            hasIcon
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <IconFolderOpen className="size-4 text-calleditor-text opacity-50" />
            {t("export.importProject")}
          </Button>
          <Button
            hasIcon
            variant="ghost"
            size="sm"
            onClick={handleExportProject}
          >
            <IconUpload className="size-4 text-calleditor-text opacity-50" />
            {t("export.exportProject")}
          </Button>
          <Button
            hasIcon
            variant="ghost"
            size="sm"
            onClick={handleClearProject}
          >
            <IconTrash className="size-4 text-calleditor-text opacity-50" />
            {t("export.clear")}
          </Button>
        </div>
      </div>

      {/* Preview / Editor */}
      <Scroll className="flex-1 p-6">
        {isEditing ? (
          <textarea
            value={editedContent ?? ""}
            onChange={(e) =>
              setEditState({ source: generatedTtml, content: e.target.value })
            }
            className="w-full h-full p-4 rounded-lg font-mono text-xs bg-calleditor-bg-elevated text-calleditor-text resize-none focus:outline-none focus:ring-1 focus:ring-calleditor-accent"
            spellCheck={false}
          />
        ) : (
          <Highlight
            theme={themes.nightOwl}
            code={displayContent}
            language="xml"
          >
            {({ style, tokens, getLineProps, getTokenProps }) => (
              <pre
                className="p-4 rounded-lg font-mono text-xs whitespace-pre-wrap break-all select-text"
                style={{
                  ...style,
                  background: "var(--color-calleditor-bg-elevated)",
                }}
              >
                {tokens.map((line, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: stable line indices
                  <div key={i} {...getLineProps({ line })}>
                    {line.map((token, j) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: stable token indices
                      <span key={j} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        )}
      </Scroll>
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { ExportPanel };
