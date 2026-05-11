function bindAudioStateEvents(audio: HTMLAudioElement, setIsPlaying: (isPlaying: boolean) => void): () => void {
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  audio.addEventListener("play", handlePlay);
  audio.addEventListener("pause", handlePause);
  return () => {
    audio.removeEventListener("play", handlePlay);
    audio.removeEventListener("pause", handlePause);
  };
}

export { bindAudioStateEvents };
