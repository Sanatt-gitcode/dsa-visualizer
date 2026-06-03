import type {
  AlgorithmMeta,
  Frame,
  GraphInput,
  GraphState,
  ElementState,
} from "@/types";

const code = [
  "function bfs(graph, start) {",
  "  const visited = new Set([start]);",
  "  const queue = [start];",
  "  const order = [];",
  "  while (queue.length > 0) {",
  "    const node = queue.shift();",
  "    order.push(node);",
  "    for (const next of graph[node]) {",
  "      if (!visited.has(next)) {",
  "        visited.add(next);",
  "        queue.push(next);",
  "      }",
  "    }",
  "  }",
  "  return order;",
  "}",
];

function buildAdjacency(input: GraphInput): Record<string, string[]> {
  const adj: Record<string, string[]> = {};
  input.graph.nodes.forEach((n) => (adj[n.id] = []));
  input.graph.edges.forEach((e) => {
    adj[e.from].push(e.to);
    if (!input.graph.directed) adj[e.to].push(e.from);
  });
  // Stable neighbour order for deterministic traversal.
  Object.values(adj).forEach((list) => list.sort());
  return adj;
}

function getSteps(input: GraphInput): Frame[] {
  const adj = buildAdjacency(input);
  const frames: Frame[] = [];
  let comparisons = 0;

  const nodeStates: Record<string, ElementState> = {};
  const edgeStates: Record<string, ElementState> = {};
  const result: string[] = [];

  const snapshot = (frontier: string[]): GraphState => ({
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    frontier: [...frontier],
    result: [...result],
  });

  const push = (line: number, description: string, frontier: string[]) => {
    frames.push({
      graph: snapshot(frontier),
      line,
      description,
      comparisons,
      swaps: 0,
    });
  };

  const visited = new Set<string>([input.start]);
  const queue: string[] = [input.start];
  nodeStates[input.start] = "current";
  push(3, `Enqueue start node ${input.start}.`, queue);

  while (queue.length > 0) {
    const node = queue.shift()!;
    nodeStates[node] = "current";
    push(6, `Dequeue ${node} and visit it.`, queue);
    result.push(node);

    for (const next of adj[node]) {
      comparisons++;
      const edgeKey = `${node}->${next}`;
      edgeStates[edgeKey] = "comparing";
      push(8, `Explore edge ${node} → ${next}.`, queue);
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
        nodeStates[next] = "visited";
        edgeStates[edgeKey] = "visited";
        push(10, `${next} is unvisited → mark visited & enqueue.`, queue);
      } else {
        edgeStates[edgeKey] = "default";
        push(9, `${next} already visited → skip.`, queue);
      }
    }
    nodeStates[node] = "sorted"; // fully explored
    push(5, `Finished exploring ${node}.`, queue);
  }
  push(14, `BFS complete. Visit order: ${result.join(" → ")}. ✔`, []);
  return frames;
}

export const bfs: AlgorithmMeta = {
  id: "bfs",
  name: "Breadth-First Search",
  category: "graph",
  description:
    "Explores a graph level by level using a queue, visiting all neighbours of a node before moving deeper. Finds shortest paths in unweighted graphs.",
  complexity: {
    best: "O(V + E)",
    average: "O(V + E)",
    worst: "O(V + E)",
    space: "O(V)",
  },
  code,
  getSteps: getSteps as AlgorithmMeta["getSteps"],
};
