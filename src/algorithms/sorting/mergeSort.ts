import type { AlgorithmMeta, Frame, SortInput, ElementState } from "@/types";

const code = [
  "function mergeSort(arr, lo = 0, hi = arr.length - 1) {",
  "  if (lo >= hi) return;",
  "  const mid = Math.floor((lo + hi) / 2);",
  "  mergeSort(arr, lo, mid);",
  "  mergeSort(arr, mid + 1, hi);",
  "  merge(arr, lo, mid, hi);",
  "}",
  "",
  "function merge(arr, lo, mid, hi) {",
  "  const left = arr.slice(lo, mid + 1);",
  "  const right = arr.slice(mid + 1, hi + 1);",
  "  let i = 0, j = 0, k = lo;",
  "  while (i < left.length && j < right.length) {",
  "    if (left[i] <= right[j]) arr[k++] = left[i++];",
  "    else arr[k++] = right[j++];",
  "  }",
  "  while (i < left.length) arr[k++] = left[i++];",
  "  while (j < right.length) arr[k++] = right[j++];",
  "}",
];

function getSteps({ array }: SortInput): Frame[] {
  const arr = [...array];
  const frames: Frame[] = [];
  let comparisons = 0;
  let swaps = 0;

  const rangeHL = (
    lo: number,
    hi: number,
    state: ElementState,
  ): Record<number, ElementState> => {
    const h: Record<number, ElementState> = {};
    for (let i = lo; i <= hi; i++) h[i] = state;
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
      swaps,
    });
  };

  const merge = (lo: number, mid: number, hi: number) => {
    const left = arr.slice(lo, mid + 1);
    const right = arr.slice(mid + 1, hi + 1);
    let i = 0,
      j = 0,
      k = lo;
    push(
      9,
      `Merge sorted halves [${lo}..${mid}] and [${mid + 1}..${hi}].`,
      { ...rangeHL(lo, mid, "current"), ...rangeHL(mid + 1, hi, "pivot") },
    );
    while (i < left.length && j < right.length) {
      comparisons++;
      push(
        13,
        `Compare ${left[i]} (left) vs ${right[j]} (right).`,
        { [lo + i]: "comparing", [mid + 1 + j]: "comparing", [k]: "current" },
        [{ label: "k", index: k }],
      );
      if (left[i] <= right[j]) {
        arr[k] = left[i];
        i++;
      } else {
        arr[k] = right[j];
        j++;
      }
      swaps++;
      push(
        14,
        `Place ${arr[k]} at index ${k}.`,
        { [k]: "swapping" },
        [{ label: "k", index: k }],
      );
      k++;
    }
    while (i < left.length) {
      arr[k] = left[i++];
      swaps++;
      push(17, `Copy remaining left value ${arr[k]} to index ${k}.`, {
        [k]: "swapping",
      });
      k++;
    }
    while (j < right.length) {
      arr[k] = right[j++];
      swaps++;
      push(18, `Copy remaining right value ${arr[k]} to index ${k}.`, {
        [k]: "swapping",
      });
      k++;
    }
    push(
      6,
      `Range [${lo}..${hi}] is now merged & sorted.`,
      rangeHL(lo, hi, "sorted"),
    );
  };

  const mergeSort = (lo: number, hi: number) => {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    push(
      3,
      `Divide range [${lo}..${hi}] at mid = ${mid}.`,
      { ...rangeHL(lo, mid, "current"), ...rangeHL(mid + 1, hi, "pivot") },
      [{ label: "mid", index: mid }],
    );
    mergeSort(lo, mid);
    mergeSort(mid + 1, hi);
    merge(lo, mid, hi);
  };

  push(1, "Start Merge Sort — divide & conquer.");
  mergeSort(0, arr.length - 1);
  push(7, "Array fully sorted. ✔", rangeHL(0, arr.length - 1, "sorted"));
  return frames;
}

export const mergeSort: AlgorithmMeta = {
  id: "merge-sort",
  name: "Merge Sort",
  category: "sorting",
  description:
    "A stable divide-and-conquer algorithm that recursively splits the array in half, sorts each half, then merges the sorted halves together.",
  complexity: {
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    space: "O(n)",
  },
  code,
  getSteps: getSteps as AlgorithmMeta["getSteps"],
};
