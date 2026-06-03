import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  code: string[];
  /** 1-based current line, or 0 / undefined for none. */
  activeLine: number;
  description: string;
}

export function CodePanel({ code, activeLine, description }: Props) {
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeLine]);

  return (
    <div className="flex h-full flex-col">
      <div className="scrollbar-thin flex-1 overflow-auto rounded-lg border border-border bg-background p-3 font-mono text-[12.5px] leading-relaxed">
        {code.map((line, i) => {
          const lineNo = i + 1;
          const active = lineNo === activeLine;
          return (
            <div
              key={i}
              ref={active ? activeRef : undefined}
              className={cn(
                "flex rounded border-l-2 px-2 transition-colors duration-150",
                active
                  ? "border-primary bg-primary-subtle"
                  : "border-transparent",
              )}
            >
              <span
                className={cn(
                  "mr-3 inline-block w-6 shrink-0 select-none text-right tabular-nums",
                  active ? "text-primary" : "text-muted-foreground/40",
                )}
              >
                {lineNo}
              </span>
              <span
                className={cn(
                  "whitespace-pre",
                  active ? "text-foreground" : "text-muted-foreground",
                  line.trim() === "" && "select-none",
                )}
              >
                {line || " "}
              </span>
              {active && (
                <motion.span
                  layoutId="code-cursor"
                  className="ml-2 self-center text-primary"
                >
                  ◀
                </motion.span>
              )}
            </div>
          );
        })}
      </div>

      {/* Live narration */}
      <div className="mt-2 min-h-[3.25rem] rounded-lg border border-border bg-secondary/40 px-3 py-2">
        <AnimatePresence mode="wait">
          <motion.p
            key={description}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="text-sm text-foreground/90"
          >
            {description}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
