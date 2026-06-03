import { motion } from "framer-motion";
import type { AlgorithmMeta } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  meta: AlgorithmMeta;
  comparisons: number;
  swaps: number;
  /** Hide the swap counter for searching / graph algorithms. */
  showSwaps: boolean;
  swapLabel?: string;
}

export function ComplexityBadge({
  meta,
  comparisons,
  swaps,
  showSwaps,
  swapLabel = "Swaps",
}: Props) {
  const { complexity } = meta;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Complexity & Counters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <ComplexityCell label="Best" value={complexity.best} variant="success" />
          <ComplexityCell
            label="Average"
            value={complexity.average}
            variant="warning"
          />
          <ComplexityCell label="Worst" value={complexity.worst} variant="danger" />
          <ComplexityCell label="Space" value={complexity.space} variant="accent" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Counter label="Comparisons" value={comparisons} />
          {showSwaps && <Counter label={swapLabel} value={swaps} />}
        </div>
      </CardContent>
    </Card>
  );
}

function ComplexityCell({
  label,
  value,
  variant,
}: {
  label: string;
  value: string;
  variant: "success" | "warning" | "danger" | "accent";
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-secondary/30 p-2">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <Badge variant={variant} className="w-fit font-mono">
        {value}
      </Badge>
    </div>
  );
}

function Counter({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <motion.div
        key={value}
        initial={{ scale: 1.2, color: "rgb(79 142 247)" }}
        animate={{ scale: 1, color: "rgb(232 234 240)" }}
        transition={{ duration: 0.25 }}
        className="font-mono text-2xl font-bold tabular-nums"
      >
        {value}
      </motion.div>
    </div>
  );
}
