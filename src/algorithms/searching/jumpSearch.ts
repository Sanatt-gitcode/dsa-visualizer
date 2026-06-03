import type { AlgorithmMeta, Frame, SearchInput, ElementState } from "@/types";

const code = [
  "function jumpSearch(arr, target) {",
  "  const n = arr.length;",
  "  const step = Math.floor(Math.sqrt(n));",
  "  let prev = 0, curr = step;",
  "  while (arr[Math.min(curr, n) - 1] < target) {",
  "    prev = curr;",
  "    curr += step;",
  "    if (prev >= n) return -1;",
  "  }",
  "  for (let i = prev; i < Math.min(curr, n); i++) {",
  "    if (arr[i] === target) return i;",
  "  }",
  "  return -1;",
  "}",
];

function getSteps({ array, target }: SearchInput): Frame[] {
  const arr = [...array];
  const n = arr.length;
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

  const step = Math.floor(Math.sqrt(n)) || 1;
  let prev = 0;
  let curr = step;
  push(
    3,
    `Block size = ⌊√${n}⌋ = ${step}. Jump ahead in blocks. (Array must be sorted.)`,
  );

  while (arr[Math.min(curr, n) - 1] < target) {
    const probe = Math.min(curr, n) - 1;
    comparisons++;
    push(
      5,
      `Block end a[${probe}] = ${arr[probe]} < ${target} → jump to next block.`,
      { [probe]: "comparing" },
      [
        { label: "prev", index: prev },
        { label: "end", index: probe },
      ],
    );
    prev = curr;
    curr += step;
    if (prev >= n) {
      push(8, `Jumped past the end → target ${target} not found.`);
      return frames;
    }
  }
  const probe = Math.min(curr, n) - 1;
  comparisons++;
  push(
    5,
    `Block end a[${probe}] = ${arr[probe]} ≥ ${target} → target is in this block. Linear scan from ${prev}.`,
    { [probe]: "current" },
    [{ label: "prev", index: prev }],
  );

  for (let i = prev; i < Math.min(curr, n); i++) {
    comparisons++;
    push(
      10,
      `Scan a[${i}] = ${arr[i]} against ${target}.`,
      { [i]: "comparing" },
      [{ label: "i", index: i }],
    );
    if (arr[i] === target) {
      push(10, `Match found at index ${i}! ✔`, { [i]: "found" }, [
        { label: "i", index: i },
      ]);
      return frames;
    }
  }
  push(12, `Target ${target} not found within the block.`);
  return frames;
}

export const jumpSearch: AlgorithmMeta = {
  id: "jump-search",
  name: "Jump Search",
  category: "searching",
  needsTarget: true,
  requiresSorted: true,
  description:
    "On a sorted array, jumps ahead in fixed blocks of size √n to find the block containing the target, then performs a linear scan within that block.",
  complexity: {
    best: "O(1)",
    average: "O(√n)",
    worst: "O(√n)",
    space: "O(1)",
  },
  code,
  getSteps: getSteps as AlgorithmMeta["getSteps"],
};
