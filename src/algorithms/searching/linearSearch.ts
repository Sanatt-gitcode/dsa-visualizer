import type { AlgorithmMeta, Frame, SearchInput, ElementState } from "@/types";

const code = [
  "function linearSearch(arr, target) {",
  "  for (let i = 0; i < arr.length; i++) {",
  "    if (arr[i] === target) {",
  "      return i;",
  "    }",
  "  }",
  "  return -1;",
  "}",
];

function getSteps({ array, target }: SearchInput): Frame[] {
  const arr = [...array];
  const frames: Frame[] = [];
  let comparisons = 0;

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

  push(1, `Search for target = ${target} by scanning left to right.`);
  for (let i = 0; i < arr.length; i++) {
    comparisons++;
    push(
      3,
      `Check a[${i}] = ${arr[i]} against target ${target}.`,
      { [i]: "comparing" },
      [{ label: "i", index: i }],
    );
    if (arr[i] === target) {
      push(
        4,
        `Match found at index ${i}! ✔`,
        { [i]: "found" },
        [{ label: "i", index: i }],
      );
      return frames;
    }
  }
  push(7, `Target ${target} not present in the array.`);
  return frames;
}

export const linearSearch: AlgorithmMeta = {
  id: "linear-search",
  name: "Linear Search",
  category: "searching",
  needsTarget: true,
  description:
    "Scans the array sequentially from the first element, comparing each with the target until found or the end is reached. Works on unsorted data.",
  complexity: {
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(1)",
  },
  code,
  getSteps: getSteps as AlgorithmMeta["getSteps"],
};
