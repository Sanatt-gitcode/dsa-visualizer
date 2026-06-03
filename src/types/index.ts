/**
 * Core type definitions for the DSA Visualizer.
 *
 * Every algorithm is a pure function that takes its input and returns a
 * fully pre-computed array of `Frame`s. The player then simply walks that
 * array forward and backward — there is no live computation during playback,
 * which makes step-back trivial and deterministic.
 */

export type Category = "sorting" | "searching" | "graph";

/** Visual state applied to a single array element / graph node. */
export type ElementState =
  | "default"
  | "comparing"
  | "swapping"
  | "sorted"
  | "current"
  | "visited"
  | "pivot"
  | "found";

/** A labelled pointer rendered beneath an array element (e.g. i, j, low, mid). */
export interface Pointer {
  label: string;
  index: number;
}

/* ------------------------------------------------------------------ */
/* Graph primitives                                                    */
/* ------------------------------------------------------------------ */

export interface GraphNode {
  id: string;
  /** Normalized layout position in [0, 1] range; scaled to the canvas. */
  x: number;
  y: number;
}

export interface GraphEdge {
  from: string;
  to: string;
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  directed: boolean;
}

/** Per-frame visual snapshot of a graph traversal. */
export interface GraphState {
  /** Node id -> visual state. */
  nodeStates: Record<string, ElementState>;
  /** Highlighted edges, keyed as `"from->to"`. */
  edgeStates: Record<string, ElementState>;
  /** The frontier (queue for BFS, stack for DFS). */
  frontier: string[];
  /** Already-finalized / fully explored nodes, in discovery order. */
  result: string[];
}

/* ------------------------------------------------------------------ */
/* Frame — one captured moment of an algorithm's execution            */
/* ------------------------------------------------------------------ */

export interface Frame {
  /** Array snapshot (sorting / searching). */
  array?: number[];
  /** index -> visual state for the array. */
  highlights?: Record<number, ElementState>;
  /** Named pointers to render under the bars. */
  pointers?: Pointer[];

  /** Graph snapshot (graph algorithms). */
  graph?: GraphState;

  /** 1-based line number in the algorithm source to highlight. */
  line: number;
  /** Human-readable explanation of what is happening this frame. */
  description: string;

  /** Running counters surfaced in the complexity panel. */
  comparisons: number;
  swaps: number;
}

/* ------------------------------------------------------------------ */
/* Algorithm metadata + registry                                       */
/* ------------------------------------------------------------------ */

export interface Complexity {
  best: string;
  average: string;
  worst: string;
  space: string;
}

/** Inputs an algorithm visualizer accepts from the controls. */
export interface SortInput {
  array: number[];
}
export interface SearchInput {
  array: number[];
  target: number;
}
export interface GraphInput {
  graph: Graph;
  start: string;
}

export type StepFn =
  | ((input: SortInput) => Frame[])
  | ((input: SearchInput) => Frame[])
  | ((input: GraphInput) => Frame[]);

export interface AlgorithmMeta {
  id: string;
  name: string;
  category: Category;
  /** True if this algorithm needs a search target input. */
  needsTarget?: boolean;
  /** True if the input array must be pre-sorted (binary/jump/interpolation). */
  requiresSorted?: boolean;
  description: string;
  complexity: Complexity;
  /** Source code as an array of lines (1-based when highlighting). */
  code: string[];
  /** Pure step generator. */
  getSteps: StepFn;
}
