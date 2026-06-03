import type { AlgorithmMeta, Frame, SortInput, ElementState } from "@/types";

const code = [
  "function insertionSort(arr) {",
  "  for (let i = 1; i < arr.length; i++) {",
  "    let key = arr[i];",
  "    let j = i - 1;",
  "    while (j >= 0 && arr[j] > key) {",
  "      arr[j + 1] = arr[j];",
  "      j--;",
  "    }",
  "    arr[j + 1] = key;",
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
  const sorted = new Set<number>([0]);

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

  push(1, "Start Insertion Sort. The first element is trivially sorted.");
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    push(
      3,
      `Select key = a[${i}] = ${key} to insert into the sorted region.`,
      { [i]: "current" },
      [
        { label: "i", index: i },
        { label: "key", index: i },
      ],
    );
    while (j >= 0 && arr[j] > key) {
      comparisons++;
      push(
        5,
        `a[${j}] = ${arr[j]} > key ${key} → shift it right.`,
        { [j]: "comparing", [j + 1]: "swapping" },
        [{ label: "j", index: j }],
      );
      arr[j + 1] = arr[j];
      swaps++;
      j--;
    }
    if (j >= 0) comparisons++; // the comparison that ended the loop
    arr[j + 1] = key;
    sorted.add(i);
    push(
      9,
      `Insert key ${key} at index ${j + 1}.`,
      { [j + 1]: "found" },
      [{ label: "ins", index: j + 1 }],
    );
  }
  for (let k = 0; k < n; k++) sorted.add(k);
  push(11, "Array fully sorted. ✔");
  return frames;
}

export const insertionSort: AlgorithmMeta = {
  id: "insertion-sort",
  name: "Insertion Sort",
  category: "sorting",
  description:
    "Builds the sorted array one element at a time by taking each new element and inserting it into its correct position among the already-sorted prefix.",
  complexity: {
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
  },
  code,
  getSteps: getSteps as AlgorithmMeta["getSteps"],
};
