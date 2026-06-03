import type { Category } from "@/types";
import { LEGEND_BY_CATEGORY, STATE_BG, STATE_LABEL } from "@/lib/stateColors";
import { cn } from "@/lib/utils";

export function Legend({ category }: { category: Category }) {
  const states = LEGEND_BY_CATEGORY[category] ?? [];
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {states.map((s) => (
        <div key={s} className="flex items-center gap-1.5">
          <span className={cn("size-3 rounded", STATE_BG[s])} />
          <span className="text-xs text-muted-foreground">
            {STATE_LABEL[s]}
          </span>
        </div>
      ))}
    </div>
  );
}
