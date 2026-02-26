"use client";

import { useEffect, useRef, useState } from "react";

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio("/music/song.mp3");
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  return (
    <button
      type="button"
      onClick={togglePlay}
      title={isPlaying ? "Pause music" : "Play music"}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-zinc-900 text-white shadow-lg flex items-center justify-center hover:bg-zinc-700 transition-colors"
    >
      {isPlaying ? (
        <svg
          aria-label={isPlaying ? "Pause" : "Play"}
          role="img"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="20"
          height="20"
        >
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
      ) : (
        <svg
          aria-label={isPlaying ? "Pause" : "Play"}
          role="img"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="20"
          height="20"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </button>
  );
}
