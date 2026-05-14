import { useAudioStore } from "@/stores/audio";
import { useAuthStore } from "@/stores/auth";
import { useConfirmStore } from "@/stores/confirm-store";
import { useDivergenceStore } from "@/stores/divergence-store";
import { useModalStackStore } from "@/stores/modal-stack";
import { INITIAL_STATE as PROJECT_INITIAL_STATE, useProjectStore } from "@/stores/project";
import { DEFAULTS as SETTINGS_DEFAULTS, useSettingsStore } from "@/stores/settings";
import { useShortcutBindingsStore } from "@/stores/shortcut-bindings";

type PersistedStore = { persist?: { clearStorage?: () => void | Promise<void> } };

async function clearPersistedStorage(store: PersistedStore): Promise<void> {
  if (!store.persist?.clearStorage) return;
  await store.persist.clearStorage();
}

function hasLocalStorage(): boolean {
  return typeof globalThis.localStorage !== "undefined";
}

async function resetAllStores(): Promise<void> {
  await clearPersistedStorage(useSettingsStore);
  useSettingsStore.setState(SETTINGS_DEFAULTS);

  await clearPersistedStorage(useShortcutBindingsStore);
  useShortcutBindingsStore.setState({ overrides: {} });

  useAuthStore.getState().clear();
  useAudioStore.getState().reset();
  useProjectStore.setState(PROJECT_INITIAL_STATE);

  useConfirmStore.setState({ isOpen: false, options: null, resolve: null, queue: [] });
  useDivergenceStore.setState({ isOpen: false, options: null, resolve: null });
  useModalStackStore.setState({ count: 0 });

  if (hasLocalStorage()) globalThis.localStorage.clear();
}

export { resetAllStores };
