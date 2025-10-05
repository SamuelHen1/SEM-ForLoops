// BackgroundMusic.tsx
import { useEffect, useRef } from "react";

export default function BackgroundMusic({ src, volume = 0.5 }: { src: string; volume?: number }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = volume;

    // Start muted initially to bypass autoplay restrictions
    audio.muted = true;
    audio.play().catch(() => {});

    // Unmute after a short delay or user interaction
    const unmute = () => {
      audio.muted = false;
      audio.play().catch(() => {});
      document.removeEventListener("click", unmute);
    };
    document.addEventListener("click", unmute);

    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
      document.removeEventListener("click", unmute);
    };
  }, [src, volume]);

  return null;
}