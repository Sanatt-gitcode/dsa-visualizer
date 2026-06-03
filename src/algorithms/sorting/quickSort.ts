import type { AlgorithmMeta, Frame, SortInput, ElementState } from "@/types";

const code = [
  "function quickSort(arr, lo = 0, hi = arr.length - 1) {",
  "  if (lo >= hi) return;",
  "  const p = partition(arr, lo, hi);",
  "  quickSort(arr, lo, p - 1);",
  "  quickSort(arr, p + 1, hi);",
  "}",
  "",
  "function partition(arr, lo, hi) {",
  "  const pivot = arr[hi];",
  "  let i = lo - 1;",
  "  for (let j = lo; j < hi; j++) {",
  "    if (arr[j] < pivot) {",
  "      i++;",
  "      swap(arr[i], arr[j]);",
  "    }",
  "  }",
  "  swap(arr[i + 1], arr[hi]);",
  "  return i + 1;",
  "}",
];

function getSteps({ array }: SortInput): Frame[] {
  const arr = [...array];
  const frames: Frame[] = [];
  let comparisons = 0;
  let swaps = 0;
  const sorted = new Set<number>();

  const push = (
    line: number,
    description: string,
    highlights: Record<number, ElementState> = {},
    pointers: { label: string; index: number }[] = [],
  ) => {
    const merged: Record<number, ElementState> = {};
    sorted.forEach((i) => (merged[i] = "sorted"));
    Object.assign(merged, highlights);
    frames.push({
      array: [...arr],
      highlights: merged,
      pointers,
      line,
      description,
      comparisons,
      swaps,
    });
  };

  const partition = (lo: number, hi: number): number => {
    const pivot = arr[hi];
    let i = lo - 1;
    push(
      9,
      `Choose pivot = a[${hi}] = ${pivot}.`,
      { [hi]: "pivot" },
      [{ label: "pivot", index: hi }],
    );
    for (let j = lo; j < hi; j++) {
      comparisons++;
      push(
        12,
        `Compare a[${j}] = ${arr[j]} with pivot ${pivot}.`,
        { [j]: "comparing", [hi]: "pivot", ...(i >= lo ? { [i]: "current" } : {}) },
        [
          { label: "i", index: Math.max(i, lo) },
          { label: "j", index: j },
        ],
      );
      if (arr[j] < pivot) {
        i++;
        if (i !== j) {
          push(
            14,
            `${arr[j]} < pivot → swap a[${i}] and a[${j}].`,
            { [i]: "swapping", [j]: "swapping", [hi]: "pivot" },
          );
          [arr[i], arr[j]] = [arr[j], arr[i]];
          swaps++;
        }
      }
    }
    push(
      17,
      `Place pivot at its sorted position by swapping a[${i + 1}] and a[${hi}].`,
      { [i + 1]: "swapping", [hi]: "swapping" },
    );
    [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
    swaps++;
    sorted.add(i + 1);
    push(18, `Pivot ${arr[i + 1]} is now at its final index ${i + 1}.`, {
      [i + 1]: "sorted",
    });
    return i + 1;
  };

  const quickSort = (lo: number, hi: number) => {
    if (lo > hi) return;
    if (lo === hi) {
      sorted.add(lo);
      push(2, `Single element at index ${lo} is sorted.`);
      return;
    }
    push(1, `Sort sub-array [${lo}..${hi}].`);
    const p = partition(lo, hi);
    quickSort(lo, p - 1);
    quickSort(p + 1, hi);
  };

  push(1, "Start Quick Sort (Lomuto partition, last element as pivot).");
  quickSort(0, arr.length - 1);
  for (let k = 0; k < arr.length; k++) sorted.add(k);
  push(5, "Array fully sorted. ✔");
  return frames;
}

export const quickSort: AlgorithmMeta = {
  id: "quick-sort",
  name: "Quick Sort",
  category: "sorting",
  description:
    "A divide-and-conquer algorithm that picks a pivot, partitions elements around it (smaller left, larger right), then recursively sorts each partition.",
  complexity: {
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n²)",
    space: "O(log n)",
  },
  code,
  getSteps: getSteps as AlgorithmMeta["getSteps"],
};
