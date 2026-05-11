import { useAudioStore } from "@/stores/audio";
import { bindAudioStateEvents } from "@/audio/audio-state-events";
import { beforeEach, describe, expect, it } from "vitest";

beforeEach(() => useAudioStore.getState().reset());

describe("bindAudioStateEvents", () => {
  it("flips store isPlaying to true when audio fires 'play'", () => {
    const audio = new Audio();
    bindAudioStateEvents(audio, useAudioStore.getState().setIsPlaying);
    expect(useAudioStore.getState().isPlaying).toBe(false);
    audio.dispatchEvent(new Event("play"));
    expect(useAudioStore.getState().isPlaying).toBe(true);
  });

  it("flips store isPlaying to false when audio fires 'pause'", () => {
    useAudioStore.setState({ isPlaying: true });
    const audio = new Audio();
    bindAudioStateEvents(audio, useAudioStore.getState().setIsPlaying);
    audio.dispatchEvent(new Event("pause"));
    expect(useAudioStore.getState().isPlaying).toBe(false);
  });

  it("cleanup removes both play and pause listeners", () => {
    useAudioStore.setState({ isPlaying: false });
    const audio = new Audio();
    const cleanup = bindAudioStateEvents(audio, useAudioStore.getState().setIsPlaying);
    cleanup();
    audio.dispatchEvent(new Event("play"));
    expect(useAudioStore.getState().isPlaying).toBe(false);
    useAudioStore.setState({ isPlaying: true });
    audio.dispatchEvent(new Event("pause"));
    expect(useAudioStore.getState().isPlaying).toBe(true);
  });
});
