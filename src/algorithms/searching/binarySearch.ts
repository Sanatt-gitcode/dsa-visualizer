import type { AlgorithmMeta, Frame, SearchInput, ElementState } from "@/types";

const code = [
  "function binarySearch(arr, target) {",
  "  let lo = 0, hi = arr.length - 1;",
  "  while (lo <= hi) {",
  "    const mid = Math.floor((lo + hi) / 2);",
  "    if (arr[mid] === target) return mid;",
  "    if (arr[mid] < target) lo = mid + 1;",
  "    else hi = mid - 1;",
  "  }",
  "  return -1;",
  "}",
];

function getSteps({ array, target }: SearchInput): Frame[] {
  const arr = [...array];
  const frames: Frame[] = [];
  let comparisons = 0;

  const rangeOutside = (lo: number, hi: number): Record<number, ElementState> => {
    const h: Record<number, ElementState> = {};
    for (let i = 0; i < arr.length; i++) if (i < lo || i > hi) h[i] = "visited";
    return h;
  };

  const push = (
    line: number,
    description: string,
    highlights: Record<number, ElementState> = {},
    pointers: { label: string; index: number }[] = [],
  ) => {
    frames.push({
      array: [...arr],
      highlights,
      pointers,
      line,
      description,
      comparisons,
      swaps: 0,
    });
  };

  let lo = 0,
    hi = arr.length - 1;
  push(2, `Search for ${target}. Set lo = 0, hi = ${hi}. (Array must be sorted.)`);
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    comparisons++;
    push(
      4,
      `mid = ⌊(${lo}+${hi})/2⌋ = ${mid}. Inspect a[${mid}] = ${arr[mid]}.`,
      { ...rangeOutside(lo, hi), [mid]: "current" },
      [
        { label: "lo", index: lo },
        { label: "mid", index: mid },
        { label: "hi", index: hi },
      ],
    );
    if (arr[mid] === target) {
      push(
        5,
        `a[${mid}] === ${target} → found at index ${mid}! ✔`,
        { ...rangeOutside(lo, hi), [mid]: "found" },
        [{ label: "mid", index: mid }],
      );
      return frames;
    }
    if (arr[mid] < target) {
      push(
        6,
        `${arr[mid]} < ${target} → discard left half, search right.`,
        { ...rangeOutside(lo, hi), [mid]: "comparing" },
      );
      lo = mid + 1;
    } else {
      push(
        7,
        `${arr[mid]} > ${target} → discard right half, search left.`,
        { ...rangeOutside(lo, hi), [mid]: "comparing" },
      );
      hi = mid - 1;
    }
  }
  push(9, `lo > hi → target ${target} not found.`);
  return frames;
}

export const binarySearch: AlgorithmMeta = {
  id: "binary-search",
  name: "Binary Search",
  category: "searching",
  needsTarget: true,
  requiresSorted: true,
  description:
    "On a sorted array, repeatedly halves the search interval by comparing the target with the middle element, discarding the half that cannot contain it.",
  complexity: {
    best: "O(1)",
    average: "O(log n)",
    worst: "O(log n)",
    space: "O(1)",
  },
  code,
  getSteps: getSteps as AlgorithmMeta["getSteps"],
};
