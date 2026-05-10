import type { ReactNode } from "react";
import { create } from "zustand";
import { type SettingsState, useSettingsStore } from "@/stores/settings";

// -- Types --------------------------------------------------------------------

type SettingsBoolKey = {
  [K in keyof SettingsState]: SettingsState[K] extends boolean ? K : never;
}[keyof SettingsState];

interface ConfirmOptions {
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "destructive" | "primary";
  settingsKey?: SettingsBoolKey;
  recoverable?: boolean;
}

interface QueuedConfirm {
  options: ConfirmOptions;
  resolve: (value: boolean) => void;
}

interface ConfirmStore {
  isOpen: boolean;
  options: ConfirmOptions | null;
  resolve: ((value: boolean) => void) | null;
  queue: QueuedConfirm[];
  open: (options: ConfirmOptions) => Promise<boolean>;
  resolveAndClose: (value: boolean, dontAskAgain: boolean) => void;
}

// -- Store --------------------------------------------------------------------

const useConfirmStore = create<ConfirmStore>((set, get) => ({
  isOpen: false,
  options: null,
  resolve: null,
  queue: [],

  open: (options) => {
    if (options.settingsKey && useSettingsStore.getState()[options.settingsKey] === false) {
      return Promise.resolve(true);
    }
    return new Promise<boolean>((resolve) => {
      if (get().isOpen) {
        // Queue the request; it will open after the active modal closes.
        set((state) => ({ queue: [...state.queue, { options, resolve }] }));
        return;
      }
      set({ isOpen: true, options, resolve });
    });
  },

  resolveAndClose: (value, dontAskAgain) => {
    const { options, resolve, queue } = get();
    if (value && dontAskAgain && options?.settingsKey) {
      useSettingsStore.getState().set(options.settingsKey, false);
    }
    resolve?.(value);
    if (queue.length > 0) {
      const [next, ...rest] = queue;
      // Apply the same auto-skip rule for the next queued entry. If its
      // settings key is now false, resolve true immediately and continue
      // draining the queue rather than opening.
      if (next.options.settingsKey && useSettingsStore.getState()[next.options.settingsKey] === false) {
        next.resolve(true);
        set({ isOpen: false, options: null, resolve: null, queue: rest });
        // Re-trigger drain by re-invoking resolveAndClose with the next entry's
        // shape isn't safe (it would mutate state again). Instead, recursively
        // call ourselves via a microtask so we drain consecutive auto-skips.
        if (rest.length > 0) {
          queueMicrotask(() => {
            const state = useConfirmStore.getState();
            if (!state.isOpen && state.queue.length > 0) {
              const [n, ...r] = state.queue;
              useConfirmStore.setState({ isOpen: true, options: n.options, resolve: n.resolve, queue: r });
            }
          });
        }
        return;
      }
      set({ isOpen: true, options: next.options, resolve: next.resolve, queue: rest });
    } else {
      set({ isOpen: false, options: null, resolve: null });
    }
  },
}));

function useConfirm(): (options: ConfirmOptions) => Promise<boolean> {
  return useConfirmStore.getState().open;
}

// -- Exports ------------------------------------------------------------------

export { useConfirm, useConfirmStore };
export type { ConfirmOptions };
