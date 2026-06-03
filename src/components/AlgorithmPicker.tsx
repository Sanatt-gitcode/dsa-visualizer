import type { AlgorithmMeta, Category } from "@/types";
import { CATEGORY_LABELS, algorithmsByCategory } from "@/algorithms/registry";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface Props {
  selected: AlgorithmMeta;
  onSelect: (id: string) => void;
}

const CATEGORIES: Category[] = ["sorting", "searching", "graph"];

export function AlgorithmPicker({ selected, onSelect }: Props) {
  return (
    <Tabs
      value={selected.category}
      onValueChange={(cat) => {
        const first = algorithmsByCategory(cat as Category)[0];
        if (first && first.category !== selected.category) onSelect(first.id);
      }}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-3">
        {CATEGORIES.map((c) => (
          <TabsTrigger key={c} value={c}>
            {CATEGORY_LABELS[c]}
          </TabsTrigger>
        ))}
      </TabsList>

      {CATEGORIES.map((c) => (
        <TabsContent key={c} value={c}>
          <div className="flex flex-wrap gap-2">
            {algorithmsByCategory(c).map((algo) => {
              const active = algo.id === selected.id;
              return (
                <button
                  key={algo.id}
                  onClick={() => onSelect(algo.id)}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "border-primary/50 bg-primary-subtle text-primary"
                      : "border-border bg-secondary text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {algo.name}
                </button>
              );
            })}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
