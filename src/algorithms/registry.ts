import type { AlgorithmMeta, Category } from "@/types";
import { bubbleSort } from "./sorting/bubbleSort";
import { selectionSort } from "./sorting/selectionSort";
import { insertionSort } from "./sorting/insertionSort";
import { mergeSort } from "./sorting/mergeSort";
import { quickSort } from "./sorting/quickSort";
import { heapSort } from "./sorting/heapSort";
import { linearSearch } from "./searching/linearSearch";
import { binarySearch } from "./searching/binarySearch";
import { jumpSearch } from "./searching/jumpSearch";
import { interpolationSearch } from "./searching/interpolationSearch";
import { bfs } from "./graph/bfs";
import { dfs } from "./graph/dfs";

export const ALGORITHMS: AlgorithmMeta[] = [
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
  linearSearch,
  binarySearch,
  jumpSearch,
  interpolationSearch,
  bfs,
  dfs,
];

export const ALGORITHMS_BY_ID: Record<string, AlgorithmMeta> =
  Object.fromEntries(ALGORITHMS.map((a) => [a.id, a]));

export const CATEGORY_LABELS: Record<Category, string> = {
  sorting: "Sorting",
  searching: "Searching",
  graph: "Graph",
};

export function algorithmsByCategory(category: Category): AlgorithmMeta[] {
  return ALGORITHMS.filter((a) => a.category === category);
}
