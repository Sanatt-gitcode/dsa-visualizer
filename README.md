# DSA Visualizer — Algorithms in Motion

An interactive, production-ready single-page app for visualizing how classic
data-structures-and-algorithms work, step by step. Watch every comparison,
swap, and pointer movement, synced with the source code and live complexity
counters.

![stack](https://img.shields.io/badge/React-18-61dafb) ![ts](https://img.shields.io/badge/TypeScript-5-3178c6) ![tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8) ![motion](https://img.shields.io/badge/Framer%20Motion-11-ff0080)

## Features

- **12 algorithms** across three categories
  - **Sorting:** Bubble, Selection, Insertion, Merge, Quick, Heap
  - **Searching:** Linear, Binary, Jump, Interpolation
  - **Graph:** BFS, DFS
- **Visualizer engine** — play / pause / step-forward / step-back / scrub, with
  an adjustable speed slider. Every frame (each comparison, swap, and pointer
  move) is pre-computed, so stepping backward is exact and instant.
- **Color-coded states** — default, comparing, swapping, sorted, current,
  visited, pivot, found.
- **Code panel** — the actual algorithm source, with the executing line
  highlighted in sync with the animation, plus live narration.
- **Complexity panel** — best / average / worst time + space complexity, with
  live comparison and swap counters.
- **Array controls** — randomize, custom input, and a 5–100 element size slider.
  Searching algorithms get a target input; sorted-input algorithms auto-sort.
- **Graph controls** — preset graphs (tree / grid / cyclic) plus an interactive
  node-edge builder: click empty space to add nodes, click two nodes to connect,
  click a node to set the traversal start.
- **Polished dark UI** — gradient palette, glassmorphism, smooth Framer Motion
  micro-interactions, responsive split-pane layout.

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check + production build into dist/
npm run preview  # preview the production build
```

## Architecture

The codebase is intentionally modular. Each algorithm is a **pure function**
that takes its input and returns a fully pre-computed array of `Frame`s — there
is no live computation during playback, which makes step-back trivial and
deterministic.

```
src/
├── types/index.ts            # Step / Frame / AlgorithmMeta type definitions
├── hooks/usePlayer.ts        # playback engine (index walk over frames)
├── algorithms/
│   ├── sorting/*.ts          # each exports an AlgorithmMeta with getSteps()
│   ├── searching/*.ts
│   ├── graph/*.ts
│   └── registry.ts           # central catalogue
├── lib/                      # utils, graph presets, state→colour maps
└── components/
    ├── VisualizerCanvas.tsx  # animated array bars
    ├── GraphCanvas.tsx       # SVG graph renderer + interactive builder
    ├── CodePanel.tsx         # synced code + line highlight
    ├── ControlBar.tsx        # transport controls + speed
    ├── ComplexityBadge.tsx   # complexity + live counters
    ├── DataControls.tsx      # array / graph input controls
    └── ui/                   # Shadcn-style primitives
```

### Adding a new algorithm

1. Create `src/algorithms/<category>/myAlgo.ts` exporting an `AlgorithmMeta`
   whose `getSteps()` returns a `Frame[]`.
2. Register it in `src/algorithms/registry.ts`.

That's it — the picker, code panel, complexity panel, and player pick it up
automatically.
