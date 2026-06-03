import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  StepBack,
  StepForward,
  Gauge,
} from "lucide-react";
import type { PlayerState } from "@/hooks/usePlayer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  player: PlayerState;
}

export function ControlBar({ player }: Props) {
  const {
    index,
    total,
    isPlaying,
    speed,
    atStart,
    atEnd,
    toggle,
    stepForward,
    stepBack,
    reset,
    seek,
    setSpeed,
  } = player;

  return (
    <div className="flex flex-col gap-3">
      {/* Scrubber */}
      <div className="flex items-center gap-3">
        <span className="w-20 shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
          {Math.min(index + 1, total)} / {total}
        </span>
        <Slider
          value={[index]}
          min={0}
          max={Math.max(total - 1, 0)}
          step={1}
          onValueChange={(v) => seek(v[0])}
          aria-label="Timeline"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <IconBtn
            label="Reset to start"
            onClick={reset}
            disabled={atStart}
            variant="secondary"
          >
            <SkipBack />
          </IconBtn>
          <IconBtn
            label="Step back"
            onClick={stepBack}
            disabled={atStart}
            variant="secondary"
          >
            <StepBack />
          </IconBtn>

          <Button
            size="lg"
            onClick={toggle}
            disabled={total === 0}
            className="min-w-[7rem]"
          >
            {isPlaying ? <Pause /> : <Play />}
            {isPlaying ? "Pause" : atEnd ? "Replay" : "Play"}
          </Button>

          <IconBtn
            label="Step forward"
            onClick={stepForward}
            disabled={atEnd}
            variant="secondary"
          >
            <StepForward />
          </IconBtn>
          <IconBtn
            label="Jump to end"
            onClick={() => seek(total - 1)}
            disabled={atEnd}
            variant="secondary"
          >
            <SkipForward />
          </IconBtn>
        </div>

        {/* Speed */}
        <div className="flex min-w-[12rem] flex-1 items-center gap-3">
          <Gauge className="size-4 shrink-0 text-muted-foreground" />
          <Slider
            value={[speed]}
            min={1}
            max={100}
            step={1}
            onValueChange={(v) => setSpeed(v[0])}
            aria-label="Animation speed"
          />
          <span className="w-12 shrink-0 text-right font-mono text-xs text-muted-foreground">
            {speed}%
          </span>
        </div>
      </div>
    </div>
  );
}

function IconBtn({
  label,
  children,
  ...props
}: React.ComponentProps<typeof Button> & { label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" {...props}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
