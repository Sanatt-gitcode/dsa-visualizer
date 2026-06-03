import { useState } from "react";
import { Shuffle, Check, Pencil, Eye, Target } from "lucide-react";
import type { AlgorithmMeta, Graph } from "@/types";
import type { GraphPreset } from "@/lib/graphPresets";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parseArray } from "@/lib/utils";

interface Props {
  meta: AlgorithmMeta;
  disabled: boolean;

  // array (sorting / searching)
  array: number[];
  size: number;
  onSize: (n: number) => void;
  onRandomize: () => void;
  onCustomArray: (values: number[]) => void;

  // searching
  target: number;
  onTarget: (n: number) => void;

  // graph
  presets: GraphPreset[];
  presetId: string;
  onPreset: (id: string) => void;
  editing: boolean;
  onToggleEdit: () => void;
  startNode: string;
  graph: Graph;
}

export function DataControls(props: Props) {
  const { meta } = props;
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {meta.category === "graph" ? "Graph Controls" : "Data Controls"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {meta.category === "graph" ? (
          <GraphControls {...props} />
        ) : (
          <ArrayControls {...props} />
        )}
      </CardContent>
    </Card>
  );
}

function ArrayControls({
  meta,
  disabled,
  array,
  size,
  onSize,
  onRandomize,
  onCustomArray,
  target,
  onTarget,
}: Props) {
  const [custom, setCustom] = useState("");

  const applyCustom = () => {
    const vals = parseArray(custom);
    if (vals.length >= 2) onCustomArray(vals);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant="accent"
          className="flex-1"
          onClick={onRandomize}
          disabled={disabled}
        >
          <Shuffle /> Randomize
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Array size</span>
          <span className="font-mono text-foreground">{size}</span>
        </div>
        <Slider
          value={[size]}
          min={5}
          max={100}
          step={1}
          disabled={disabled}
          onValueChange={(v) => onSize(v[0])}
        />
      </div>

      <div className="space-y-2">
        <span className="text-sm text-muted-foreground">
          Custom array{" "}
          <span className="text-xs text-muted-foreground/60">
            (comma / space separated)
          </span>
        </span>
        <div className="flex gap-2">
          <Input
            value={custom}
            disabled={disabled}
            placeholder={array.slice(0, 8).join(", ") + " …"}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyCustom()}
          />
          <Button
            variant="secondary"
            size="icon"
            onClick={applyCustom}
            disabled={disabled}
            aria-label="Apply custom array"
          >
            <Check />
          </Button>
        </div>
        {meta.requiresSorted && (
          <p className="text-xs text-viz-swapping">
            Note: this algorithm requires sorted input — your values will be
            sorted automatically.
          </p>
        )}
      </div>

      {meta.needsTarget && (
        <div className="space-y-2">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Target className="size-3.5" /> Search target
          </span>
          <Input
            type="number"
            value={target}
            disabled={disabled}
            onChange={(e) => onTarget(parseInt(e.target.value, 10) || 0)}
          />
          <div className="flex flex-wrap gap-1">
            {sampleTargets(array).map((t) => (
              <button
                key={t}
                disabled={disabled}
                onClick={() => onTarget(t)}
                className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground disabled:opacity-50"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function sampleTargets(array: number[]): number[] {
  if (array.length === 0) return [];
  const present = array[Math.floor(array.length / 2)];
  const present2 = array[array.length - 1];
  const absent = Math.max(...array) + 1;
  return Array.from(new Set([present, present2, absent]));
}

function GraphControls({
  presets,
  presetId,
  onPreset,
  editing,
  onToggleEdit,
  startNode,
  disabled,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <span className="text-sm text-muted-foreground">Preset graph</span>
        <Select value={presetId} onValueChange={onPreset} disabled={disabled}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {presets.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
            {presetId === "custom" && (
              <SelectItem value="custom">Custom graph</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <Button
        variant={editing ? "accent" : "secondary"}
        className="w-full"
        onClick={onToggleEdit}
        disabled={disabled}
      >
        {editing ? <Eye /> : <Pencil />}
        {editing ? "Done editing" : "Edit graph"}
      </Button>

      <div className="rounded-lg border border-border bg-secondary/30 p-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Start node</span>
          <span className="rounded bg-accent/20 px-2 py-0.5 font-bold text-accent">
            {startNode}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground/70">
          {editing
            ? "Build your graph, then press Done."
            : "Click any node to set it as the traversal start."}
        </p>
      </div>
    </div>
  );
}
