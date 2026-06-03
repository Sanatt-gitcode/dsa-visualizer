import type { Graph } from "@/types";

export interface GraphPreset {
  id: string;
  name: string;
  graph: Graph;
}

/** Node positions are normalized to [0, 1] and scaled by the canvas. */
export const GRAPH_PRESETS: GraphPreset[] = [
  {
    id: "tree",
    name: "Binary Tree",
    graph: {
      directed: false,
      nodes: [
        { id: "A", x: 0.5, y: 0.12 },
        { id: "B", x: 0.28, y: 0.4 },
        { id: "C", x: 0.72, y: 0.4 },
        { id: "D", x: 0.16, y: 0.72 },
        { id: "E", x: 0.4, y: 0.72 },
        { id: "F", x: 0.6, y: 0.72 },
        { id: "G", x: 0.84, y: 0.72 },
      ],
      edges: [
        { from: "A", to: "B" },
        { from: "A", to: "C" },
        { from: "B", to: "D" },
        { from: "B", to: "E" },
        { from: "C", to: "F" },
        { from: "C", to: "G" },
      ],
    },
  },
  {
    id: "grid",
    name: "Grid / Mesh",
    graph: {
      directed: false,
      nodes: [
        { id: "A", x: 0.2, y: 0.2 },
        { id: "B", x: 0.5, y: 0.2 },
        { id: "C", x: 0.8, y: 0.2 },
        { id: "D", x: 0.2, y: 0.5 },
        { id: "E", x: 0.5, y: 0.5 },
        { id: "F", x: 0.8, y: 0.5 },
        { id: "G", x: 0.2, y: 0.8 },
        { id: "H", x: 0.5, y: 0.8 },
        { id: "I", x: 0.8, y: 0.8 },
      ],
      edges: [
        { from: "A", to: "B" },
        { from: "B", to: "C" },
        { from: "D", to: "E" },
        { from: "E", to: "F" },
        { from: "G", to: "H" },
        { from: "H", to: "I" },
        { from: "A", to: "D" },
        { from: "D", to: "G" },
        { from: "B", to: "E" },
        { from: "E", to: "H" },
        { from: "C", to: "F" },
        { from: "F", to: "I" },
      ],
    },
  },
  {
    id: "cycle",
    name: "Cyclic Network",
    graph: {
      directed: false,
      nodes: [
        { id: "A", x: 0.5, y: 0.12 },
        { id: "B", x: 0.85, y: 0.35 },
        { id: "C", x: 0.72, y: 0.78 },
        { id: "D", x: 0.28, y: 0.78 },
        { id: "E", x: 0.15, y: 0.35 },
        { id: "F", x: 0.5, y: 0.5 },
      ],
      edges: [
        { from: "A", to: "B" },
        { from: "B", to: "C" },
        { from: "C", to: "D" },
        { from: "D", to: "E" },
        { from: "E", to: "A" },
        { from: "F", to: "A" },
        { from: "F", to: "C" },
        { from: "F", to: "E" },
      ],
    },
  },
];

export const DEFAULT_GRAPH = GRAPH_PRESETS[0].graph;
