import { Button } from "@/ui/button";
import { cn } from "@/utils/cn";
import { IconCopy, IconDownload, IconExternalLink } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface ConvertArgs {
  input: string;
  filename: string;
}

interface ConverterViewProps {
  title: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleInput: string;
  convert: (
    args: ConvertArgs,
  ) => { ttml: string; projectPayload: string } | { error: string };
  downloadFilename: string;
}

const OPEN_IN_COMPOSER_HASH_PREFIX = "#import=";

const ConverterView: React.FC<ConverterViewProps> = ({
  title,
  inputLabel,
  inputPlaceholder,
  sampleInput,
  convert,
  downloadFilename,
}) => {
  const [input, setInput] = useState("");
  const [filename, setFilename] = useState(() => downloadFilename);

  const { ttml, error } = useMemo(() => {
    if (!input.trim()) return { ttml: "", error: null };
    const result = convert({ input, filename });
    if ("error" in result) return { ttml: "", error: result.error };
    return { ttml: result.ttml, error: null };
  }, [input, filename, convert]);

  const projectPayload = useMemo(() => {
    if (!input.trim() || error) return "";
    const result = convert({ input, filename });
    return "error" in result ? "" : result.projectPayload;
  }, [input, filename, convert, error]);

  const downloadTtml = () => {
    if (!ttml) return;
    const blob = new Blob([ttml], { type: "application/ttml+xml" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = downloadFilename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const copyTtml = async () => {
    if (!ttml) return;
    try {
      await navigator.clipboard.writeText(ttml);
      toast.success("Copied TTML to clipboard");
    } catch (clipboardError) {
      console.error("[CallEditor] Failed to copy TTML", clipboardError);
      toast.error("Could not copy to clipboard");
    }
  };

  const openInCallEditorHref = projectPayload
    ? `/${OPEN_IN_COMPOSER_HASH_PREFIX}${encodeURIComponent(projectPayload)}`
    : "/";

  return (
    <section className="px-6 py-14 max-w-6xl mx-auto">
      <h1 className="text-3xl md:text-5xl font-semibold text-calleditor-text text-center mb-4">
        {title}
      </h1>
      <p className="text-calleditor-text-secondary text-center max-w-2xl mx-auto mb-10">
        Paste your input on the left, download a standard TTML file on the
        right. Everything runs in your browser.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl bg-calleditor-bg-elevated border border-calleditor-border p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <label
              htmlFor="converter-input"
              className="text-sm font-medium text-calleditor-text select-none"
            >
              {inputLabel}
            </label>
            <button
              type="button"
              className="text-xs text-calleditor-accent-text hover:text-calleditor-accent cursor-pointer"
              onClick={() => setInput(sampleInput)}
            >
              Load sample
            </button>
          </div>
          <textarea
            id="converter-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={inputPlaceholder}
            spellCheck={false}
            className="flex-1 min-h-[280px] md:min-h-[420px] font-mono text-sm bg-calleditor-bg-dark border border-calleditor-border rounded-lg p-3 text-calleditor-text placeholder:text-calleditor-text-muted resize-y focus:outline-none focus:border-calleditor-accent cursor-text select-text"
          />
          <div className="mt-3 flex items-center gap-2">
            <label
              htmlFor="converter-filename"
              className="text-xs text-calleditor-text-muted select-none"
            >
              Filename
            </label>
            <input
              id="converter-filename"
              type="text"
              value={filename}
              onChange={(event) => setFilename(event.target.value)}
              className="flex-1 text-xs bg-calleditor-bg-dark border border-calleditor-border rounded-md px-2 py-1 text-calleditor-text focus:outline-none focus:border-calleditor-accent cursor-text select-text"
            />
          </div>
        </div>
        <div className="rounded-xl bg-calleditor-bg-elevated border border-calleditor-border p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-calleditor-text select-none">
              TTML output
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={copyTtml}
                disabled={!ttml}
                hasIcon
              >
                <IconCopy size={12} />
                Copy
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={downloadTtml}
                disabled={!ttml}
                hasIcon
              >
                <IconDownload size={12} />
                Download
              </Button>
            </div>
          </div>
          <pre
            className={cn(
              "flex-1 min-h-[280px] md:min-h-[420px] overflow-auto font-mono text-xs rounded-lg p-3 border",
              error
                ? "bg-calleditor-error/10 border-calleditor-error/40 text-calleditor-error-text"
                : "bg-calleditor-bg-dark border-calleditor-border text-calleditor-text select-text",
            )}
          >
            {error || ttml || "Paste input to see TTML output"}
          </pre>
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="text-xs text-calleditor-text-muted">
              Need to fine-tune timing against a waveform?
            </span>
            <a
              href={openInCallEditorHref}
              className={cn(
                !projectPayload && "pointer-events-none opacity-50",
              )}
            >
              <Button
                variant="primary"
                size="sm"
                disabled={!projectPayload}
                hasIcon
              >
                Open in CallEditor
                <IconExternalLink size={12} />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export { ConverterView };
export type { ConvertArgs };
