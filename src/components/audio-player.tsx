"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";

export function AudioPlayer({
  src,
  title,
  category,
}: {
  src: string;
  title: string;
  category?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * duration;
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="rounded-xl border border-foreground/10 bg-white p-4 shadow-sm">
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-light transition-colors"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-medium text-sm truncate">{title}</span>
            {category && (
              <span className="text-xs text-foreground/40 shrink-0">
                {category}
              </span>
            )}
          </div>

          <div
            className="h-2 rounded-full bg-foreground/10 cursor-pointer"
            onClick={seek}
            role="slider"
            aria-valuenow={currentTime}
            aria-valuemin={0}
            aria-valuemax={duration}
            tabIndex={0}
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-foreground/40 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{duration > 0 ? formatTime(duration) : "--:--"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
