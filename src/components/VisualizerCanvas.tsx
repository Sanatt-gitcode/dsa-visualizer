import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Frame, ElementState } from "@/types";
import { STATE_BG } from "@/lib/stateColors";
import { cn } from "@/lib/utils";

interface Props {
  frame: Frame | undefined;
  /** Show numeric value labels on top of each bar (array size < 30). */
  showValues: boolean;
  /** When set (searching algos), draw a dashed target line at its height. */
  target?: number;
}

export function VisualizerCanvas({ frame, showValues, target }: Props) {
  const array = frame?.array ?? [];
  const highlights = frame?.highlights ?? {};
  const pointers = frame?.pointers ?? [];

  // --- settle bounce: detect bars that *just* became sorted ---------------
  const prevSortedRef = useRef<Set<number>>(new Set());
  const [bouncing, setBouncing] = useState<Set<number>>(new Set());
  useEffect(() => {
    const cur = new Set<number>();
    for (const [k, v] of Object.entries(highlights)) {
      if (v === "sorted" || v === "found") cur.add(Number(k));
    }
    const newly = new Set<number>();
    cur.forEach((i) => {
      if (!prevSortedRef.current.has(i)) newly.add(i);
    });
    prevSortedRef.current = cur;
    if (newly.size) {
      setBouncing(newly);
      const t = setTimeout(() => setBouncing(new Set()), 450);
      return () => clearTimeout(t);
    }
  }, [highlights]);

  if (!frame?.array) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        No data to visualize.
      </div>
    );
  }

  const max = Math.max(...array, 1);
  const n = array.length;
  const gap = n > 50 ? 1 : n > 30 ? 2 : 4;

  // Identify active pairs so we can tilt / cross them.
  const comparing: number[] = [];
  const swapping: number[] = [];
  array.forEach((_, i) => {
    if (highlights[i] === "comparing") comparing.push(i);
    if (highlights[i] === "swapping") swapping.push(i);
  });
  const pairCompare = comparing.length === 2;
  const pairSwap = swapping.length === 2;

  // Pointer labels grouped by index.
  const pointersByIndex = new Map<number, string[]>();
  pointers.forEach((p) => {
    const list = pointersByIndex.get(p.index) ?? [];
    list.push(p.label);
    pointersByIndex.set(p.index, list);
  });

  return (
    <div className="relative flex h-full w-full flex-col">
      <div
        className="relative flex h-full w-full items-end justify-center px-3 pb-7 pt-7"
        style={{ gap }}
      >
        {/* Search target reference line */}
        {target !== undefined && (
          <div
            className="pointer-events-none absolute inset-x-3 bottom-7 z-30"
            style={{ height: `${(Math.min(target, max) / max) * 100}%` }}
          >
            <div className="absolute inset-x-0 top-0 border-t border-dashed border-primary/70">
              <span className="absolute -top-2.5 right-0 rounded bg-primary/15 px-1.5 text-[10px] font-medium text-primary">
                target {target}
              </span>
            </div>
          </div>
        )}

        {array.map((value, i) => {
          const state: ElementState = highlights[i] ?? "default";
          const labels = pointersByIndex.get(i);
          const heightPct = (value / max) * 100;

          // Tilt comparing bars toward each other.
          let rotate = 0;
          if (pairCompare && state === "comparing") {
            const [lo, hi] = comparing;
            rotate = i === lo ? 2 : i === hi ? -2 : 0;
          }

          // Physically cross swapping bars by translating along X.
          let xPct = 0;
          if (pairSwap && state === "swapping") {
            const [lo, hi] = swapping;
            const other = i === lo ? hi : lo;
            xPct = (other - i) * 100;
          }

          const isBouncing = bouncing.has(i);
          const zIndex =
            state === "swapping" ? 20 : state === "comparing" ? 10 : 1;

          return (
            <div
              key={i}
              className="relative flex h-full min-w-0 flex-1 items-end justify-center"
              style={{ maxWidth: 64, zIndex }}
            >
              {/* Pointer labels */}
              {labels && (
                <div className="absolute -top-1 z-40 flex -translate-y-full flex-col items-center">
                  <div className="flex gap-0.5">
                    {labels.map((l) => (
                      <span
                        key={l}
                        className="rounded bg-primary/15 px-1 text-[10px] font-semibold leading-tight text-primary"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                  <span className="text-[8px] leading-none text-primary">▾</span>
                </div>
              )}

              <motion.div
                className={cn("relative w-full rounded-t-[3px]", STATE_BG[state])}
                style={{ transformOrigin: "bottom center", minHeight: 4 }}
                animate={{
                  height: `${Math.max(heightPct, 1.5)}%`,
                  rotate,
                  x: `${xPct}%`,
                  y: isBouncing ? [0, -10, 0, -3, 0] : 0,
                }}
                transition={{
                  height: { type: "spring", stiffness: 300, damping: 26 },
                  x: { type: "spring", stiffness: 480, damping: 32 },
                  rotate: { duration: 0.15 },
                  y: { duration: 0.45, ease: "easeOut" },
                }}
              >
                {/* Top-edge highlight for a raised, 3D feel */}
                <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-[3px] bg-white/25" />

                {/* Value label on top of the bar */}
                {showValues && (
                  <span
                    className={cn(
                      "absolute -top-[18px] left-1/2 -translate-x-1/2 text-[10px] font-medium tabular-nums",
                      state === "default"
                        ? "text-muted-foreground"
                        : "text-foreground",
                    )}
                  >
                    {value}
                  </span>
                )}
              </motion.div>

              {/* Index label below the bar */}
              {showValues && (
                <span className="absolute -bottom-[22px] text-[9px] tabular-nums text-muted-foreground/60">
                  {i}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
