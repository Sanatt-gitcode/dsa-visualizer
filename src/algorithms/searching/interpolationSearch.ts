import type { AlgorithmMeta, Frame, SearchInput, ElementState } from "@/types";

const code = [
  "function interpolationSearch(arr, target) {",
  "  let lo = 0, hi = arr.length - 1;",
  "  while (lo <= hi && target >= arr[lo] && target <= arr[hi]) {",
  "    const pos = lo + Math.floor(",
  "      ((target - arr[lo]) * (hi - lo)) / (arr[hi] - arr[lo]));",
  "    if (arr[pos] === target) return pos;",
  "    if (arr[pos] < target) lo = pos + 1;",
  "    else hi = pos - 1;",
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
  push(
    2,
    `Search for ${target}. Estimate position by value distribution. (Sorted, ~uniform data.)`,
  );

  while (lo <= hi && target >= arr[lo] && target <= arr[hi]) {
    let pos: number;
    if (arr[hi] === arr[lo]) {
      pos = lo;
    } else {
      pos =
        lo +
        Math.floor(((target - arr[lo]) * (hi - lo)) / (arr[hi] - arr[lo]));
    }
    comparisons++;
    push(
      4,
      `Estimate pos = ${pos} from values a[${lo}]=${arr[lo]}, a[${hi}]=${arr[hi]}. Check a[${pos}] = ${arr[pos]}.`,
      { ...rangeOutside(lo, hi), [pos]: "current" },
      [
        { label: "lo", index: lo },
        { label: "pos", index: pos },
        { label: "hi", index: hi },
      ],
    );
    if (arr[pos] === target) {
      push(
        6,
        `a[${pos}] === ${target} → found at index ${pos}! ✔`,
        { ...rangeOutside(lo, hi), [pos]: "found" },
        [{ label: "pos", index: pos }],
      );
      return frames;
    }
    if (arr[pos] < target) {
      push(7, `${arr[pos]} < ${target} → search right of pos.`, {
        ...rangeOutside(lo, hi),
        [pos]: "comparing",
      });
      lo = pos + 1;
    } else {
      push(8, `${arr[pos]} > ${target} → search left of pos.`, {
        ...rangeOutside(lo, hi),
        [pos]: "comparing",
      });
      hi = pos - 1;
    }
  }
  push(10, `Target ${target} not found (out of value range).`);
  return frames;
}

export const interpolationSearch: AlgorithmMeta = {
  id: "interpolation-search",
  name: "Interpolation Search",
  category: "searching",
  needsTarget: true,
  requiresSorted: true,
  description:
    "An improvement over binary search for uniformly distributed sorted data: estimates the target's probable position using linear interpolation of values.",
  complexity: {
    best: "O(1)",
    average: "O(log log n)",
    worst: "O(n)",
    space: "O(1)",
  },
  code,
  getSteps: getSteps as AlgorithmMeta["getSteps"],
};
