import type { ElementState } from "@/types";

/** Tailwind background classes per visual state (used for bars & nodes). */
export const STATE_BG: Record<ElementState, string> = {
  default: "bg-viz-default",
  comparing: "bg-viz-comparing",
  swapping: "bg-viz-swapping",
  sorted: "bg-viz-sorted",
  current: "bg-viz-current",
  visited: "bg-viz-visited",
  pivot: "bg-viz-pivot",
  found: "bg-viz-found",
};

/** Raw color references for SVG fills / strokes & inline styles. */
export const STATE_COLOR: Record<ElementState, string> = {
  default: "rgb(var(--viz-default))",
  comparing: "rgb(var(--viz-comparing))",
  swapping: "rgb(var(--viz-swapping))",
  sorted: "rgb(var(--viz-sorted))",
  current: "rgb(var(--viz-current))",
  visited: "rgb(var(--viz-visited))",
  pivot: "rgb(var(--viz-pivot))",
  found: "rgb(var(--viz-found))",
};

export const STATE_LABEL: Record<ElementState, string> = {
  default: "Unsorted",
  comparing: "Comparing",
  swapping: "Swapping",
  sorted: "Sorted / Done",
  current: "Current",
  visited: "Visited",
  pivot: "Pivot",
  found: "Found",
};

/** Which states are worth showing in a given category's legend. */
export const LEGEND_BY_CATEGORY: Record<string, ElementState[]> = {
  sorting: ["default", "comparing", "swapping", "pivot", "current", "sorted"],
  searching: ["default", "comparing", "current", "visited", "found"],
  graph: ["default", "current", "comparing", "visited", "sorted"],
};
