# shadcn-stacked-progress-bar

A composable, accessible, and highly customizable stacked progress bar built for **shadcn/ui**. It allows you to display multiple sequential or categorical statuses inside a single track, complete with an optional interactive legend, multi-segment tooltips, and robust screen-reader support.

**[Documentation & Examples](https://joachimbrasier.github.io/shadcn-stacked-progress-bar)**

---

## Features

- **Multi-Status Tracking:** Display multiple values/segments linearly in a single unified track.
- **Composable Architecture:** Clean API syntax mimicking the standard `shadcn/ui` atomic design pattern.
- **Accessible (A11y):** Built with full ARIA semantics (`role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`) ensuring screen readers accurately announce the breakdown.
- **Interactive Tooltips:** Easily wrap segments with your existing shadcn `Tooltip` components to show accurate breakdowns on hover.
- **Flexible Legend System:** Includes built-in sub-components to generate matching grids or lists for status labels.
- **Tailwind Native:** Fully styled via Tailwind CSS utility classes, supporting dark mode and custom shadcn theme variables out of the box.

---

## Prerequisites

Before installing the stacked progress bar, ensure your project meets the following requirements:

- **React 19** & **react-dom 19**
- A standard **shadcn/ui** project initialized with Tailwind CSS.
- The standard shadcn shared utilities (usually available at `@/lib/utils` containing `clsx` and `tailwind-merge`).

## Installation

### Method 1: Using the shadcn CLI (Recommended)

Once your registry is built and deployed, you can add it directly using the CLI pointer:

```bash
npx shadcn@latest add https://raw.githubusercontent.com/JoachimBrasier/shadcn-stacked-progress-bar/main/stacked-progress-bar.json
```

### Method 2: Manual Installation

If you prefer manual control, copy the stacked-progress-bar.tsx file into your components directory (e.g., src/stacked-progress-bar.tsx).

### Usage

Here is a quick example of how to implement a stacked progress bar representing project task statuses:

```typescript
import { StackedProgressBarProvider, StackedProgressBar, StackedProgressBarSegment } from "@/components/ui/stacked-progress-bar"

export default function Demo() {
  return (
    <StackedProgressBarProvider max={100}>
      <StackedProgressBar value={74} aria-label="Project progress" aria-valuetext="74% completed">
        <StackedProgressBarSegment value={40} className="bg-emerald-500" />
        <StackedProgressBarSegment value={24} className="bg-sky-500" />
        <StackedProgressBarSegment value={10} className="bg-amber-500" />
      </StackedProgressBar>
    </StackedProgressBarProvider>
  )
}
```

### API Reference

`<StackedProgressBarProvider />`

The mandatory state provider that coordinates the maximum bounds and binds accessibility references between the bar and its legend.

- `max` (number, optional): The maximum scale value for calculations (e.g., `100`, total count of tasks, etc.). **Default: `100`**.

`<StackedProgressBar />`

The main progress bar track container. Built with automatic screen-reader fallback attributes (`role="progressbar"`).

- `value` (number, optional): The total completed value. If omitted, it calculates its safe bounds automatically.
- Supports standard ARIA overrides (`aria-label`, `aria-valuemin`, `aria-valuemax`, etc.). It automatically links its `aria-describedby` to an active `<StackedProgressBarLegend />` ID.
- Accepts all standard HTMLDivElement props.

`<StackedProgressBarSegment />`

Represents a single custom slice/segment inside the tracking bar.

- `value` (number, required): The numeric weight of this segment. Its width percentage is dynamically computed as `(value / max) * 100`.
- `aria-hidden` (boolean, optional): **Default: `true`**. Automatically hidden from screen readers to prevent confusing segmented announcements (the summary is read by the main container).
- Accepts all standard HTMLDivElement props.

`<StackedProgressBarLegend />`

The flex wrapper for your progress legends. Built with an automatic `role="list"` semantic standard.

- `id` (string, optional): A unique identifier. If not provided, a unique `useId()` is generated to automatically bind assistive text to the parent progress bar.
- Accepts all standard HTMLDivElement props.
> **Note:** Only one `<StackedProgressBarLegend />` is allowed inside a single `StackedProgressBarProvider`.

`<StackedProgressBarLegendItem />`

A list item layout container for an individual legend status entry.

- `role` (string, optional): **Default: `"listitem"`** for structured screen-reader tree parsing.
- Accepts all standard HTMLDivElement props.

`<StackedProgressBarLegendDot />`

The visual colored status indicator for the legend entry. Styled using `class-variance-authority`.

- `variant` (string, optional): 
  - `"default"`: Renders a smooth, rounded standard dot (`bg-muted`).
  - `"icon"`: Designed to contain custom vector graphics or symbols cleanly.
- - Accepts all standard HTMLSpanElement props.

`<StackedProgressBarLegendLabel />`

The text label element accompanying a legend item.

- Pre-styled with native shadcn utility classes (`text-muted-foreground`).
- Accepts all standard HTMLDivElement props.
