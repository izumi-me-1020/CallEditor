import { DEFAULTS, useSettingsStore } from "@/stores/settings";
import { useAppLanguage } from "@/lib/i18n";
import { Button } from "@/ui/button";
import { Modal } from "@/ui/modal";
import { useCallback, useEffect, useState } from "react";

// -- Split Character Setting --------------------------------------------------

const BLOCKED_CHARS = new Set([" ", "\n", "\t", "\r"]);
const WARNED_CHARS = new Set([
  ",",
  ".",
  "'",
  '"',
  "-",
  "!",
  "?",
  ":",
  ";",
  "(",
  ")",
  "&",
]);

type SplitCaptureState =
  | { status: "idle" }
  | { status: "listening"; error?: string }
  | { status: "warning"; char: string };

function validateSplitChar(char: string): "blocked" | "warned" | "allowed" {
  if (BLOCKED_CHARS.has(char) || /[a-zA-Z0-9]/.test(char)) return "blocked";
  if (WARNED_CHARS.has(char)) return "warned";
  return "allowed";
}

const SplitCharacterSetting: React.FC = () => {
  const splitCharacter = useSettingsStore((s) => s.splitCharacter);
  const set = useSettingsStore((s) => s.set);
  const { t } = useAppLanguage();
  const isDefault = splitCharacter === DEFAULTS.splitCharacter;
  const [captureState, setCaptureState] = useState<SplitCaptureState>({
    status: "idle",
  });

  const cancelCapture = useCallback(() => {
    setCaptureState({ status: "idle" });
  }, []);

  useEffect(() => {
    if (captureState.status !== "listening") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.key === "Escape") {
        cancelCapture();
        return;
      }

      if (
        e.key === "Shift" ||
        e.key === "Alt" ||
        e.key === "Control" ||
        e.key === "Meta"
      )
        return;
      if (e.key.length !== 1) return;

      const result = validateSplitChar(e.key);

      if (result === "blocked") {
        setCaptureState({
          status: "listening",
          error: t("settings.splitCharacter.errorBlocked"),
        });
        return;
      }

      if (result === "warned") {
        setCaptureState({ status: "warning", char: e.key });
        return;
      }

      set("splitCharacter", e.key);
      setCaptureState({ status: "idle" });
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [captureState.status, set, cancelCapture, t]);

  return (
    <>
      <div className="flex items-center justify-between py-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-calleditor-text">
            {t("settings.splitCharacter.label")}
          </span>
          <span className="text-xs text-calleditor-text-muted">
            {t("settings.splitCharacter.description")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!isDefault && (
            <button
              type="button"
              onClick={() => set("splitCharacter", DEFAULTS.splitCharacter)}
              className="text-xs text-calleditor-text-muted hover:text-calleditor-text cursor-pointer transition-colors"
            >
              {t("settings.splitCharacter.reset")}
            </button>
          )}
          <button
            type="button"
            onClick={() => setCaptureState({ status: "listening" })}
            className="flex items-center justify-center min-w-8 h-7 px-2 rounded-lg bg-calleditor-input border border-calleditor-border cursor-pointer transition-colors hover:border-calleditor-accent"
          >
            <span className="text-sm font-mono text-calleditor-text">
              {splitCharacter}
            </span>
          </button>
        </div>
      </div>

      <Modal
        isOpen={captureState.status === "listening"}
        onClose={cancelCapture}
        title={t("settings.splitCharacter.modalTitle")}
      >
        <div className="text-center py-4 pb-0 space-y-10">
          <div className="space-y-2">
            <p className="text-sm text-calleditor-text-secondary">
              {t("settings.splitCharacter.modalPrompt")}
            </p>
            <p className="text-xs text-calleditor-text-muted">
              {t("settings.splitCharacter.modalEscape")}
            </p>
          </div>
          <p className="text-xs text-calleditor-text-muted bg-calleditor-button/50 rounded-lg px-3 py-2 text-left">
            {t("settings.splitCharacter.modalAdvice")}
          </p>
        </div>
        {captureState.status === "listening" && captureState.error && (
          <p className="text-xs text-red-400 text-center mt-4">
            {captureState.error}
          </p>
        )}
      </Modal>

      {captureState.status === "warning" && (
        <Modal
          isOpen
          onClose={cancelCapture}
          title={t("settings.splitCharacter.warningTitle")}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-calleditor-text">
              <span className="inline-flex items-center justify-center min-w-7 h-7 px-2 rounded-md bg-calleditor-button border border-calleditor-border font-mono">
                {captureState.char}
              </span>
              <span className="text-calleditor-text-secondary">
                {t("settings.splitCharacter.warningCommon")}
              </span>
            </div>
            <p className="text-xs text-calleditor-text-muted">
              {t("settings.splitCharacter.warningDescription")}
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" size="sm" onClick={cancelCapture}>
                {t("settings.splitCharacter.warningCancel")}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  set("splitCharacter", captureState.char);
                  setCaptureState({ status: "idle" });
                }}
              >
                {t("settings.splitCharacter.warningConfirm")}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

// -- Exports ------------------------------------------------------------------

export { SplitCharacterSetting };
