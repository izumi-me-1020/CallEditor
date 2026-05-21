import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "bg-color": [
        "bg-calleditor-bg",
        "bg-calleditor-bg-dark",
        "bg-calleditor-bg-elevated",
        "bg-calleditor-overlay",
        "bg-calleditor-overlay-hover",
        "bg-calleditor-button",
        "bg-calleditor-button-hover",
        "bg-calleditor-input",
        "bg-calleditor-accent",
        "bg-calleditor-accent-dark",
        "bg-calleditor-accent-darker",
        "bg-calleditor-accent-warm",
        "bg-calleditor-error",
        "bg-calleditor-warning",
      ],
      "text-color": [
        "text-calleditor-text",
        "text-calleditor-text-secondary",
        "text-calleditor-text-muted",
        "text-calleditor-text-disabled",
        "text-calleditor-text-tertiary",
        "text-calleditor-accent-text",
        "text-calleditor-error-text",
        "text-calleditor-link",
      ],
      "border-color": [
        "border-calleditor-border",
        "border-calleditor-border-hover",
        "border-calleditor-error",
        "border-calleditor-accent",
      ],
    },
  },
});

function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export { cn };
