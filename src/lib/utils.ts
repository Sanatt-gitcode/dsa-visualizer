import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Generate `count` random integers in [min, max]. */
export function randomArray(count: number, min = 5, max = 99): number[] {
  return Array.from(
    { length: count },
    () => Math.floor(Math.random() * (max - min + 1)) + min,
  );
}

/** Parse a comma/space separated string into a clamped int array. */
export function parseArray(input: string): number[] {
  return input
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => parseInt(s, 10))
    .filter((n) => Number.isFinite(n))
    .map((n) => Math.max(1, Math.min(999, n)))
    .slice(0, 100);
}

export const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, n));
