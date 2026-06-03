import type { AlgorithmMeta, Frame, SortInput, ElementState } from "@/types";

const code = [
  "function selectionSort(arr) {",
  "  const n = arr.length;",
  "  for (let i = 0; i < n - 1; i++) {",
  "    let min = i;",
  "    for (let j = i + 1; j < n; j++) {",
  "      if (arr[j] < arr[min]) {",
  "        min = j;",
  "      }",
  "    }",
  "    if (min !== i) {",
  "      swap(arr[i], arr[min]);",
  "    }",
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

  push(1, "Start Selection Sort.");
  for (let i = 0; i < n - 1; i++) {
    let min = i;
    push(
      4,
      `Assume index ${i} (value ${arr[i]}) is the minimum of the unsorted region.`,
      { [i]: "current", [min]: "pivot" },
      [
        { label: "i", index: i },
        { label: "min", index: min },
      ],
    );
    for (let j = i + 1; j < n; j++) {
      comparisons++;
      push(
        6,
        `Compare a[${j}] = ${arr[j]} with current min a[${min}] = ${arr[min]}.`,
        { [j]: "comparing", [min]: "pivot", [i]: "current" },
        [
          { label: "i", index: i },
          { label: "j", index: j },
          { label: "min", index: min },
        ],
      );
      if (arr[j] < arr[min]) {
        min = j;
        push(
          7,
          `New minimum found at index ${j} (value ${arr[j]}).`,
          { [min]: "pivot", [i]: "current" },
          [
            { label: "i", index: i },
            { label: "min", index: min },
          ],
        );
      }
    }
    if (min !== i) {
      push(
        11,
        `Swap minimum a[${min}] = ${arr[min]} into position ${i}.`,
        { [i]: "swapping", [min]: "swapping" },
      );
      [arr[i], arr[min]] = [arr[min], arr[i]];
      swaps++;
    }
    sorted.add(i);
    push(3, `Index ${i} is now finalized.`);
  }
  for (let k = 0; k < n; k++) sorted.add(k);
  push(14, "Array fully sorted. ✔");
  return frames;
}

export const selectionSort: AlgorithmMeta = {
  id: "selection-sort",
  name: "Selection Sort",
  category: "sorting",
  description:
    "Divides the array into sorted and unsorted regions, repeatedly selecting the smallest remaining element and moving it to the boundary.",
  complexity: {
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
  },
  code,
  getSteps: getSteps as AlgorithmMeta["getSteps"],
};
