import type { AlgorithmMeta, Frame, SortInput, ElementState } from "@/types";

const code = [
  "function bubbleSort(arr) {",
  "  const n = arr.length;",
  "  for (let i = 0; i < n - 1; i++) {",
  "    let swapped = false;",
  "    for (let j = 0; j < n - i - 1; j++) {",
  "      if (arr[j] > arr[j + 1]) {",
  "        swap(arr[j], arr[j + 1]);",
  "        swapped = true;",
  "      }",
  "    }",
  "    if (!swapped) break;",
  "  }",
  "  return arr;",
  "}",
];

function getSteps({ array }: SortInput): Frame[] {
  const arr = [...array];
  const n = arr.length;
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

  push(1, "Start Bubble Sort.");
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      push(
        6,
        `Compare a[${j}] = ${arr[j]} and a[${j + 1}] = ${arr[j + 1]}.`,
        { [j]: "comparing", [j + 1]: "comparing" },
        [
          { label: "j", index: j },
          { label: "j+1", index: j + 1 },
        ],
      );
      if (arr[j] > arr[j + 1]) {
        push(
          7,
          `${arr[j]} > ${arr[j + 1]} → swap them.`,
          { [j]: "swapping", [j + 1]: "swapping" },
          [
            { label: "j", index: j },
            { label: "j+1", index: j + 1 },
          ],
        );
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swaps++;
        swapped = true;
        push(
          7,
          `Swapped → now a[${j}] = ${arr[j]}, a[${j + 1}] = ${arr[j + 1]}.`,
          { [j]: "swapping", [j + 1]: "swapping" },
          [
            { label: "j", index: j },
            { label: "j+1", index: j + 1 },
          ],
        );
      }
    }
    sorted.add(n - i - 1);
    push(11, `Largest unsorted element bubbled to index ${n - i - 1}.`);
    if (!swapped) {
      // remaining are already sorted
      for (let k = 0; k < n - i - 1; k++) sorted.add(k);
      push(11, "No swaps in this pass → array is sorted, stop early.");
      break;
    }
  }
  for (let k = 0; k < n; k++) sorted.add(k);
  push(13, "Array fully sorted. ✔");
  return frames;
}

export const bubbleSort: AlgorithmMeta = {
  id: "bubble-sort",
  name: "Bubble Sort",
  category: "sorting",
  description:
    "Repeatedly steps through the list, comparing adjacent items and swapping them if out of order. Largest values 'bubble' to the end each pass.",
  complexity: {
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
  },
  code,
  getSteps: getSteps as AlgorithmMeta["getSteps"],
};
