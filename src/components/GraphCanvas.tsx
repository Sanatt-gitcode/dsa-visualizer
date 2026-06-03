import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Graph, Frame, ElementState } from "@/types";
import { STATE_COLOR } from "@/lib/stateColors";
import { cn } from "@/lib/utils";

interface Props {
  graph: Graph;
  frame: Frame | undefined;
  editing: boolean;
  startNode: string;
  onSetStart: (id: string) => void;
  onAddNode: (x: number, y: number) => void;
  onAddEdge: (from: string, to: string) => void;
  onRemoveNode: (id: string) => void;
}

const R = 4; // node radius in viewBox units (0..100)

export function GraphCanvas({
  graph,
  frame,
  editing,
  startNode,
  onSetStart,
  onAddNode,
  onAddEdge,
  onRemoveNode,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pendingEdge, setPendingEdge] = useState<string | null>(null);

  const gs = frame?.graph;
  const nodeState = (id: string): ElementState =>
    gs?.nodeStates[id] ?? "default";

  /** Returns the visual state + traversal direction for an edge. */
  const edgeInfo = (
    from: string,
    to: string,
  ): { state: ElementState; dir: "forward" | "reverse" | null } => {
    if (!gs) return { state: "default", dir: null };
    const fwd = gs.edgeStates[`${from}->${to}`];
    const rev = gs.edgeStates[`${to}->${from}`];
    if (fwd && fwd !== "default") return { state: fwd, dir: "forward" };
    if (rev && rev !== "default") return { state: rev, dir: "reverse" };
    return { state: "default", dir: null };
  };

  const pos = (id: string) => graph.nodes.find((n) => n.id === id)!;

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!editing) return;
    const tag = (e.target as Element).tagName;
    if (tag !== "svg" && tag !== "rect") return;
    const rect = svgRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setPendingEdge(null);
    onAddNode(x, y);
  };

  const handleNodeClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editing) {
      onSetStart(id);
      return;
    }
    if (pendingEdge === null) {
      setPendingEdge(id);
    } else if (pendingEdge === id) {
      setPendingEdge(null);
    } else {
      onAddEdge(pendingEdge, id);
      setPendingEdge(null);
    }
  };

  return (
    <div className="relative h-full min-h-[500px] w-full">
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        className={cn(
          "h-full w-full",
          editing ? "cursor-crosshair" : "cursor-default",
        )}
        onClick={handleCanvasClick}
      >
        <defs>
          {/* Arrow inherits the edge's stroke colour via context-stroke. */}
          <marker
            id="arrow"
            markerWidth="5"
            markerHeight="5"
            refX="4.2"
            refY="2.5"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L5,2.5 L0,5 Z" fill="context-stroke" />
          </marker>
        </defs>

        {/* Edges */}
        {graph.edges.map((e, i) => {
          const a = pos(e.from);
          const b = pos(e.to);
          if (!a || !b) return null;
          const { state, dir } = edgeInfo(e.from, e.to);
          const active = state !== "default";
          // Shorten the line to the node border so arrowheads sit cleanly.
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const len = Math.hypot(dx, dy) || 1;
          const ux = (dx / len) * R;
          const uy = (dy / len) * R;
          const showArrow = active && (dir === "forward" || graph.directed);
          const showArrowStart = active && dir === "reverse" && !graph.directed;
          return (
            <line
              key={`${e.from}-${e.to}-${i}`}
              x1={a.x * 100 + (showArrowStart ? ux : 0)}
              y1={a.y * 100 + (showArrowStart ? uy : 0)}
              x2={b.x * 100 - (showArrow ? ux : 0)}
              y2={b.y * 100 - (showArrow ? uy : 0)}
              stroke={active ? STATE_COLOR[state] : "rgb(var(--border))"}
              strokeWidth={active ? 1.1 : 0.6}
              strokeLinecap="round"
              markerEnd={showArrow ? "url(#arrow)" : undefined}
              markerStart={showArrowStart ? "url(#arrow)" : undefined}
              style={{ transition: "stroke 0.2s, stroke-width 0.2s" }}
            />
          );
        })}

        {/* Pending edge hint */}
        {editing && pendingEdge && pos(pendingEdge) && (
          <circle
            cx={pos(pendingEdge).x * 100}
            cy={pos(pendingEdge).y * 100}
            r={R + 1.6}
            fill="none"
            stroke="rgb(var(--accent))"
            strokeWidth="0.6"
            strokeDasharray="1.5 1.5"
          />
        )}

        {/* Nodes */}
        {graph.nodes.map((node) => {
          const st = nodeState(node.id);
          const isStart = node.id === startNode;
          const cx = node.x * 100;
          const cy = node.y * 100;
          return (
            <g
              key={node.id}
              onClick={(e) => handleNodeClick(node.id, e)}
              className="cursor-pointer"
            >
              {isStart && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={R + 1.5}
                  fill="none"
                  stroke="rgb(var(--accent))"
                  strokeWidth="0.7"
                />
              )}
              <motion.circle
                cx={cx}
                cy={cy}
                r={R}
                initial={false}
                animate={{
                  fill: STATE_COLOR[st],
                  scale: st === "current" || st === "found" ? 1.18 : 1,
                }}
                transition={{ duration: 0.2 }}
                stroke="rgb(var(--background))"
                strokeWidth="0.6"
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              />
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="3.2"
                fontWeight="700"
                fill={
                  st === "current" || st === "pivot"
                    ? "rgb(var(--background))"
                    : "rgb(var(--foreground))"
                }
                pointerEvents="none"
              >
                {node.id}
              </text>
              {editing && (
                <text
                  x={cx + R + 0.5}
                  y={cy - R}
                  fontSize="3"
                  fill="rgb(var(--destructive))"
                  className="cursor-pointer"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    onRemoveNode(node.id);
                    setPendingEdge(null);
                  }}
                >
                  ✕
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Frontier + result overlay */}
      {gs && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-1 p-3 text-xs">
          <FrontierRow
            label="Frontier"
            items={gs.frontier}
            accent="bg-primary/15 text-primary"
          />
          <FrontierRow
            label="Visited order"
            items={gs.result}
            accent="bg-viz-sorted/15 text-viz-sorted"
          />
        </div>
      )}

      {editing && (
        <div className="absolute left-3 top-3 max-w-[15rem] rounded-lg border border-border bg-secondary p-2 text-[11px] leading-snug text-muted-foreground">
          <span className="font-semibold text-foreground">Edit mode:</span> click
          empty space to add a node, click two nodes to connect them, ✕ to
          delete.
        </div>
      )}
    </div>
  );
}

function FrontierRow({
  label,
  items,
  accent,
}: {
  label: string;
  items: string[];
  accent: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-24 shrink-0 text-muted-foreground">{label}:</span>
      <div className="flex flex-wrap gap-1">
        {items.length === 0 ? (
          <span className="text-muted-foreground/40">—</span>
        ) : (
          items.map((id, i) => (
            <span
              key={`${id}-${i}`}
              className={cn(
                "rounded px-1.5 py-0.5 font-semibold tabular-nums",
                accent,
              )}
            >
              {id}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
