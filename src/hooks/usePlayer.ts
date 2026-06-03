import { useCallback, useEffect, useRef, useState } from "react";
import type { Frame } from "@/types";

export interface PlayerState {
  index: number;
  frame: Frame | undefined;
  total: number;
  isPlaying: boolean;
  /** 1 (slow) .. 100 (fast) */
  speed: number;
  atStart: boolean;
  atEnd: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  stepForward: () => void;
  stepBack: () => void;
  reset: () => void;
  seek: (i: number) => void;
  setSpeed: (s: number) => void;
}

/**
 * Drives playback over a pre-computed array of frames.
 * Playback is just an index walk, so step-back is exact and free.
 */
export function usePlayer(frames: Frame[]): PlayerState {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(45);
  const timer = useRef<number | null>(null);

  const total = frames.length;
  const atEnd = index >= total - 1;
  const atStart = index <= 0;

  // Reset whenever the frame set changes (new algorithm / new data).
  useEffect(() => {
    setIndex(0);
    setIsPlaying(false);
  }, [frames]);

  const clearTimer = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };

  // Playback loop. Delay maps speed [1..100] -> [600ms..30ms] non-linearly.
  useEffect(() => {
    if (!isPlaying) return;
    if (index >= total - 1) {
      setIsPlaying(false);
      return;
    }
    const delay = Math.max(20, 620 - speed * 6);
    timer.current = window.setTimeout(() => {
      setIndex((i) => Math.min(i + 1, total - 1));
    }, delay);
    return clearTimer;
  }, [isPlaying, index, speed, total]);

  const play = useCallback(() => {
    if (total === 0) return;
    setIndex((i) => (i >= total - 1 ? 0 : i)); // restart if at end
    setIsPlaying(true);
  }, [total]);

  const pause = useCallback(() => setIsPlaying(false), []);
  const toggle = useCallback(
    () => (isPlaying ? setIsPlaying(false) : play()),
    [isPlaying, play],
  );

  const stepForward = useCallback(() => {
    setIsPlaying(false);
    setIndex((i) => Math.min(i + 1, total - 1));
  }, [total]);

  const stepBack = useCallback(() => {
    setIsPlaying(false);
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setIndex(0);
  }, []);

  const seek = useCallback(
    (i: number) => {
      setIsPlaying(false);
      setIndex(Math.max(0, Math.min(i, total - 1)));
    },
    [total],
  );

  return {
    index,
    frame: frames[index],
    total,
    isPlaying,
    speed,
    atStart,
    atEnd,
    play,
    pause,
    toggle,
    stepForward,
    stepBack,
    reset,
    seek,
    setSpeed,
  };
}
