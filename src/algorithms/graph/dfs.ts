import type {
  AlgorithmMeta,
  Frame,
  GraphInput,
  GraphState,
  ElementState,
} from "@/types";

const code = [
  "function dfs(graph, start) {",
  "  const visited = new Set();",
  "  const order = [];",
  "  function explore(node) {",
  "    visited.add(node);",
  "    order.push(node);",
  "    for (const next of graph[node]) {",
  "      if (!visited.has(next)) {",
  "        explore(next);",
  "      }",
  "    }",
  "  }",
  "  explore(start);",
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
  const stack: string[] = [];

  const snapshot = (): GraphState => ({
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    frontier: [...stack],
    result: [...result],
  });

  const push = (line: number, description: string) => {
    frames.push({
      graph: snapshot(),
      line,
      description,
      comparisons,
      swaps: 0,
    });
  };

  const visited = new Set<string>();

  const explore = (node: string) => {
    visited.add(node);
    stack.push(node);
    nodeStates[node] = "current";
    push(5, `Visit ${node} (push onto recursion stack).`);
    result.push(node);

    for (const next of adj[node]) {
      comparisons++;
      const edgeKey = `${node}->${next}`;
      edgeStates[edgeKey] = "comparing";
      push(7, `From ${node}, look at neighbour ${next}.`);
      if (!visited.has(next)) {
        edgeStates[edgeKey] = "visited";
        nodeStates[node] = "visited";
        push(8, `${next} unvisited → recurse deeper into ${next}.`);
        explore(next);
        nodeStates[node] = "current";
        push(7, `Backtrack to ${node}.`);
      } else {
        edgeStates[edgeKey] = "default";
        push(7, `${next} already visited → skip.`);
      }
    }
    nodeStates[node] = "sorted"; // fully explored
    stack.pop();
    push(4, `Done with ${node}, pop from stack.`);
  };

  push(1, `Start DFS from ${input.start}.`);
  explore(input.start);
  push(13, `DFS complete. Visit order: ${result.join(" → ")}. ✔`);
  return frames;
}

export const dfs: AlgorithmMeta = {
  id: "dfs",
  name: "Depth-First Search",
  category: "graph",
  description:
    "Explores a graph as deeply as possible along each branch before backtracking, using a stack (here via recursion). Useful for cycle detection and topological sort.",
  complexity: {
    best: "O(V + E)",
    average: "O(V + E)",
    worst: "O(V + E)",
    space: "O(V)",
  },
  code,
  getSteps: getSteps as AlgorithmMeta["getSteps"],
};
