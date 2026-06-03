import type { AlgorithmMeta, Frame, SortInput, ElementState } from "@/types";

const code = [
  "function heapSort(arr) {",
  "  const n = arr.length;",
  "  for (let i = n / 2 - 1; i >= 0; i--)",
  "    heapify(arr, n, i);",
  "  for (let i = n - 1; i > 0; i--) {",
  "    swap(arr[0], arr[i]);",
  "    heapify(arr, i, 0);",
  "  }",
  "}",
  "",
  "function heapify(arr, n, i) {",
  "  let largest = i, l = 2*i+1, r = 2*i+2;",
  "  if (l < n && arr[l] > arr[largest]) largest = l;",
  "  if (r < n && arr[r] > arr[largest]) largest = r;",
  "  if (largest !== i) {",
  "    swap(arr[i], arr[largest]);",
  "    heapify(arr, n, largest);",
  "  }",
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

  const heapify = (size: number, i: number) => {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    push(
      12,
      `Heapify at index ${i}. Children: left=${l < size ? l : "—"}, right=${
        r < size ? r : "—"
      }.`,
      { [i]: "current" },
      [{ label: "root", index: i }],
    );
    if (l < size) {
      comparisons++;
      push(
        13,
        `Compare left child a[${l}] = ${arr[l]} with a[${largest}] = ${arr[largest]}.`,
        { [l]: "comparing", [largest]: "current" },
      );
      if (arr[l] > arr[largest]) largest = l;
    }
    if (r < size) {
      comparisons++;
      push(
        14,
        `Compare right child a[${r}] = ${arr[r]} with a[${largest}] = ${arr[largest]}.`,
        { [r]: "comparing", [largest]: "current" },
      );
      if (arr[r] > arr[largest]) largest = r;
    }
    if (largest !== i) {
      push(16, `Swap a[${i}] and a[${largest}] to restore max-heap.`, {
        [i]: "swapping",
        [largest]: "swapping",
      });
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      swaps++;
      heapify(size, largest);
    }
  };

  push(1, "Start Heap Sort. First build a max-heap.");
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
  push(4, "Max-heap built — largest element is now at the root.");

  for (let i = n - 1; i > 0; i--) {
    push(6, `Move max (root) to index ${i} by swapping with a[0].`, {
      [0]: "swapping",
      [i]: "swapping",
    });
    [arr[0], arr[i]] = [arr[i], arr[0]];
    swaps++;
    sorted.add(i);
    push(7, `Index ${i} finalized. Re-heapify the reduced heap.`);
    heapify(i, 0);
  }
  for (let k = 0; k < n; k++) sorted.add(k);
  push(8, "Array fully sorted. ✔");
  return frames;
}

export const heapSort: AlgorithmMeta = {
  id: "heap-sort",
  name: "Heap Sort",
  category: "sorting",
  description:
    "Builds a max-heap from the array, then repeatedly extracts the maximum element to the end and re-heapifies the remaining elements.",
  complexity: {
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    space: "O(1)",
  },
  code,
  getSteps: getSteps as AlgorithmMeta["getSteps"],
};
