import { useEffect, useMemo, useState } from "react";
import { Github, Activity } from "lucide-react";
import type {
  AlgorithmMeta,
  Frame,
  Graph,
  GraphInput,
  SearchInput,
  SortInput,
} from "@/types";
import { ALGORITHMS_BY_ID } from "@/algorithms/registry";
import { GRAPH_PRESETS } from "@/lib/graphPresets";
import { randomArray, cn } from "@/lib/utils";
import { usePlayer } from "@/hooks/usePlayer";

import { AlgorithmPicker } from "@/components/AlgorithmPicker";
import { VisualizerCanvas } from "@/components/VisualizerCanvas";
import { GraphCanvas } from "@/components/GraphCanvas";
import { CodePanel } from "@/components/CodePanel";
import { ControlBar } from "@/components/ControlBar";
import { ComplexityBadge } from "@/components/ComplexityBadge";
import { DataControls } from "@/components/DataControls";
import { Legend } from "@/components/Legend";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const DEFAULT_SIZE = 20;

export default function App() {
  const [selectedId, setSelectedId] = useState("bubble-sort");
  const meta: AlgorithmMeta = ALGORITHMS_BY_ID[selectedId];

  // Array state (sorting / searching)
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [baseArray, setBaseArray] = useState<number[]>(() =>
    randomArray(DEFAULT_SIZE),
  );
  const [target, setTarget] = useState<number>(0);

  // Graph state
  const [presetId, setPresetId] = useState(GRAPH_PRESETS[0].id);
  const [graph, setGraph] = useState<Graph>(() =>
    structuredClone(GRAPH_PRESETS[0].graph),
  );
  const [startNode, setStartNode] = useState("A");
  const [editing, setEditing] = useState(false);

  // For searching algorithms requiring sorted input, sort a copy.
  const processedArray = useMemo(() => {
    if (meta.category === "searching" && meta.requiresSorted) {
      return [...baseArray].sort((a, b) => a - b);
    }
    return baseArray;
  }, [baseArray, meta]);

  // Keep target sensible for searching algorithms.
  useEffect(() => {
    if (meta.needsTarget && processedArray.length > 0) {
      const inRange =
        target >= Math.min(...processedArray) &&
        target <= Math.max(...processedArray);
      if (!inRange) {
        setTarget(processedArray[Math.floor(processedArray.length / 2)]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  // Compute frames for the current algorithm + inputs (pure & memoized).
  const frames: Frame[] = useMemo(() => {
    if (meta.category === "graph") {
      const start = graph.nodes.some((n) => n.id === startNode)
        ? startNode
        : (graph.nodes[0]?.id ?? "A");
      if (!graph.nodes.length) return [];
      return (meta.getSteps as (i: GraphInput) => Frame[])({ graph, start });
    }
    if (meta.category === "searching") {
      return (meta.getSteps as (i: SearchInput) => Frame[])({
        array: processedArray,
        target,
      });
    }
    return (meta.getSteps as (i: SortInput) => Frame[])({
      array: processedArray,
    });
  }, [meta, processedArray, target, graph, startNode]);

  const player = usePlayer(frames);
  const frame = player.frame;
  const isGraph = meta.category === "graph";

  /* ----------------------------- handlers ----------------------------- */

  const handleSelect = (id: string) => {
    setEditing(false);
    setSelectedId(id);
  };

  const handleRandomize = () => setBaseArray(randomArray(size));

  const handleSize = (n: number) => {
    setSize(n);
    setBaseArray(randomArray(n));
  };

  const handleCustomArray = (values: number[]) => {
    setBaseArray(values);
    setSize(values.length);
  };

  const handlePreset = (id: string) => {
    const preset = GRAPH_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setPresetId(id);
    const g = structuredClone(preset.graph);
    setGraph(g);
    setStartNode(g.nodes[0]?.id ?? "A");
    setEditing(false);
  };

  const nextNodeId = (g: Graph): string => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const used = new Set(g.nodes.map((n) => n.id));
    for (const c of alphabet) if (!used.has(c)) return c;
    return `N${g.nodes.length}`;
  };

  const handleAddNode = (x: number, y: number) => {
    setGraph((g) => {
      const id = nextNodeId(g);
      return { ...g, nodes: [...g.nodes, { id, x, y }] };
    });
    setPresetId("custom");
  };

  const handleAddEdge = (from: string, to: string) => {
    setGraph((g) => {
      const exists = g.edges.some(
        (e) =>
          (e.from === from && e.to === to) ||
          (!g.directed && e.from === to && e.to === from),
      );
      if (exists) return g;
      return { ...g, edges: [...g.edges, { from, to }] };
    });
    setPresetId("custom");
  };

  const handleRemoveNode = (id: string) => {
    setGraph((g) => {
      const nodes = g.nodes.filter((n) => n.id !== id);
      const edges = g.edges.filter((e) => e.from !== id && e.to !== id);
      return { ...g, nodes, edges };
    });
    setStartNode((s) => (s === id ? (graph.nodes[0]?.id ?? "A") : s));
    setPresetId("custom");
  };

  const handleSetStart = (id: string) => {
    if (!editing) setStartNode(id);
  };

  /* ------------------------------ render ------------------------------ */

  return (
    <TooltipProvider delayDuration={300}>
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-5 p-4 lg:p-6">
        {/* Header */}
        <header className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-lg border border-border bg-secondary">
                <Activity className="size-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-foreground">
                  DSA Visualizer
                </h1>
                <p className="text-xs text-muted-foreground">
                  Algorithms in motion — step through every comparison & swap.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="gap-2"
              >
                <Github className="size-4" /> Source
              </a>
            </Button>
          </div>

          <AlgorithmPicker selected={meta} onSelect={handleSelect} />
        </header>

        {/* Split layout */}
        <main className="grid flex-1 grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
          {/* LEFT — visualization */}
          <Card className="flex min-h-[28rem] flex-col lg:min-h-0">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="normal-case tracking-normal">
                <span className="text-base font-bold text-foreground">
                  {meta.name}
                </span>
              </CardTitle>
              <Legend category={meta.category} />
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4">
              <div
                className={cn(
                  "relative flex-1 overflow-hidden rounded-lg border border-border bg-background",
                  isGraph ? "min-h-[500px]" : "min-h-[20rem]",
                )}
              >
                {isGraph ? (
                  <GraphCanvas
                    graph={graph}
                    frame={editing ? undefined : frame}
                    editing={editing}
                    startNode={startNode}
                    onSetStart={handleSetStart}
                    onAddNode={handleAddNode}
                    onAddEdge={handleAddEdge}
                    onRemoveNode={handleRemoveNode}
                  />
                ) : (
                  <VisualizerCanvas
                    frame={frame}
                    showValues={size < 30}
                    target={meta.needsTarget ? target : undefined}
                  />
                )}
              </div>
              <ControlBar player={player} />
            </CardContent>
          </Card>

          {/* RIGHT — code + stats + controls */}
          <div className="flex flex-col gap-5">
            <Card className="flex min-h-[20rem] flex-col">
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle>Algorithm Code</CardTitle>
                <span className="text-xs text-muted-foreground">
                  line{" "}
                  <span className="font-mono text-primary">
                    {frame?.line ?? "—"}
                  </span>
                </span>
              </CardHeader>
              <CardContent className="flex-1">
                <CodePanel
                  code={meta.code}
                  activeLine={frame?.line ?? 0}
                  description={frame?.description ?? meta.description}
                />
              </CardContent>
            </Card>

            <ComplexityBadge
              meta={meta}
              comparisons={frame?.comparisons ?? 0}
              swaps={frame?.swaps ?? 0}
              showSwaps={meta.category === "sorting"}
            />

            <DataControls
              meta={meta}
              disabled={isGraph ? editing : player.isPlaying}
              array={processedArray}
              size={size}
              onSize={handleSize}
              onRandomize={handleRandomize}
              onCustomArray={handleCustomArray}
              target={target}
              onTarget={setTarget}
              presets={GRAPH_PRESETS}
              presetId={presetId}
              onPreset={handlePreset}
              editing={editing}
              onToggleEdit={() => setEditing((e) => !e)}
              startNode={startNode}
              graph={graph}
            />
          </div>
        </main>

        <footer className="pb-2 text-center text-xs text-muted-foreground/60">
          Built with React + TypeScript · Tailwind · Framer Motion — 12
          algorithms, frame-by-frame.
        </footer>
      </div>
    </TooltipProvider>
  );
}
