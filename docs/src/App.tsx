import {
  ComponentProps,
  CSSProperties,
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Check, RefreshCw, X } from "lucide-react";
type StackedProgressContextValue = {
  max: number;
};

const StackedProgressContext =
  createContext<StackedProgressContextValue | null>(null);

function cn(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(" ");
}

function useStackedProgressContext() {
  const context = useContext(StackedProgressContext);

  if (!context) {
    throw new Error(
      "StackedProgressBarSegment must be used inside StackedProgressBarProvider.",
    );
  }

  return context;
}

function StackedProgressBarProvider({
  max = 100,
  children,
}: {
  max?: number;
  children: ReactNode;
}) {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
  const value = useMemo(() => ({ max: safeMax }), [safeMax]);

  return (
    <StackedProgressContext.Provider value={value}>
      {children}
    </StackedProgressContext.Provider>
  );
}

function StackedProgressBar({
  value,
  label,
  valueText,
  className,
  children,
}: {
  value?: number;
  label?: string;
  valueText?: string;
  className?: string;
  children: ReactNode;
}) {
  const context = useContext(StackedProgressContext);
  const max = context?.max ?? 100;
  const safeValue =
    value !== undefined && Number.isFinite(value)
      ? Math.max(0, Math.min(value, max))
      : undefined;

  return (
    <div
      role="progressbar"
      aria-label={label ?? "Progress"}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={safeValue}
      aria-valuetext={valueText}
      className={cn(
        "bg-zinc-200 flex h-3 w-full overflow-hidden rounded-full",
        className,
      )}
    >
      {children}
    </div>
  );
}

function StackedProgressBarSegment({
  value,
  className,
  style,
  ...props
}: {
  value: number;
  className?: string;
  style?: CSSProperties;
} & ComponentProps<"div">) {
  const { max } = useStackedProgressContext();
  const safeValue = Number.isFinite(value)
    ? Math.max(0, Math.min(value, max))
    : 0;

  return (
    <div
      aria-hidden="true"
      className={cn("h-full", className)}
      style={{ width: `${(safeValue / max) * 100}%`, ...style }}
      {...props}
    />
  );
}

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

function TooltipContent({
  className,
  sideOffset = 8,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          "z-50 overflow-hidden rounded-md bg-zinc-900 px-3 py-1.5 text-xs text-zinc-50 shadow-md",
          "data-[state=delayed-open]:animate-in data-[state=closed]:animate-out",
          className,
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
}

function StackedProgressBarLegend({ children }: { children: ReactNode }) {
  return <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">{children}</div>;
}

function StackedProgressBarLegendItem({ children }: { children: ReactNode }) {
  return <div className="flex items-center text-sm">{children}</div>;
}

function StackedProgressBarLegendDot({
  className,
  variant = "default",
  children,
}: {
  className?: string;
  variant?: "default" | "icon";
  children?: ReactNode;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block mr-1.5 size-2 rounded-full shrink-0 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        variant === "icon"
          ? "text-muted-foreground bg-transparent flex shrink-0 items-center mr-2.5 size-auto justify-center rounded-lg [&_svg:not([class*='size-'])]:size-4"
          : "bg-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

function StackedProgressBarLegendLabel({ children }: { children: ReactNode }) {
  return <span className="text-muted-foreground">{children}</span>;
}

function ExampleBlock({
  title,
  description,
  code,
  children,
}: {
  title: string;
  description: string;
  code: string;
  children: ReactNode;
}) {
  const [tab, setTab] = useState<"preview" | "code">("preview");

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <header className="border-b border-zinc-200 px-5 py-4">
        <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
        <p className="mt-1 text-sm text-zinc-600">{description}</p>
      </header>

      <div className="flex items-center gap-2 border-b border-zinc-200 px-5 py-3 text-sm">
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={cn(
            "rounded-md px-3 py-1.5 transition",
            tab === "preview"
              ? "bg-zinc-900 text-white"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
          )}
        >
          Preview
        </button>
        <button
          type="button"
          onClick={() => setTab("code")}
          className={cn(
            "rounded-md px-3 py-1.5 transition",
            tab === "code"
              ? "bg-zinc-900 text-white"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
          )}
        >
          Code
        </button>
      </div>

      {tab === "preview" ? (
        <div className="p-5">{children}</div>
      ) : (
        <pre className="overflow-x-auto bg-zinc-950 p-5 text-xs leading-6 text-zinc-100">
          <code>{code}</code>
        </pre>
      )}
    </section>
  );
}

const basicCode = `
<StackedProgressBarProvider max={100}>
  <StackedProgressBar value={74} label="Project progress" valueText="74% completed">
    <StackedProgressBarSegment value={40} className="bg-emerald-500" />
    <StackedProgressBarSegment value={24} className="bg-sky-500" />
    <StackedProgressBarSegment value={10} className="bg-amber-500" />
  </StackedProgressBar>
</StackedProgressBarProvider>
`.trim();

const legendCode = `
<StackedProgressBarProvider max={100}>
  <StackedProgressBar value={96} label="Pipeline status" valueText="96 of 100 jobs done">
    <StackedProgressBarSegment value={66} className="bg-emerald-500" />
    <StackedProgressBarSegment value={20} className="bg-blue-500" />
    <StackedProgressBarSegment value={10} className="bg-rose-500" />
  </StackedProgressBar>

  <StackedProgressBarLegend>
    <StackedProgressBarLegendItem>
      <StackedProgressBarLegendDot className="bg-emerald-500" />
      <StackedProgressBarLegendLabel>Success (66%)</StackedProgressBarLegendLabel>
    </StackedProgressBarLegendItem>
    <StackedProgressBarLegendItem>
      <StackedProgressBarLegendDot className="bg-blue-500" />
      <StackedProgressBarLegendLabel>Running (20%)</StackedProgressBarLegendLabel>
    </StackedProgressBarLegendItem>
    <StackedProgressBarLegendItem>
      <StackedProgressBarLegendDot className="bg-rose-500" />
      <StackedProgressBarLegendLabel>Failed (10%)</StackedProgressBarLegendLabel>
    </StackedProgressBarLegendItem>
  </StackedProgressBarLegend>
</StackedProgressBarProvider>
`.trim();

const legendIconCode = `
<StackedProgressBarProvider max={100}>
  <StackedProgressBar value={96} label="Pipeline status" valueText="96 of 100 jobs done">
    <StackedProgressBarSegment value={66} className="bg-emerald-500" />
    <StackedProgressBarSegment value={20} className="bg-blue-500" />
    <StackedProgressBarSegment value={10} className="bg-red-500" />
  </StackedProgressBar>

  <StackedProgressBarLegend>
    <StackedProgressBarLegendItem>
      <StackedProgressBarLegendDot variant="icon" className="text-emerald-500">
        <Check />
      </StackedProgressBarLegendDot>
      <StackedProgressBarLegendLabel>Success (66%)</StackedProgressBarLegendLabel>
    </StackedProgressBarLegendItem>
    <StackedProgressBarLegendItem>
      <StackedProgressBarLegendDot variant="icon" className="text-blue-500">
        <RefreshCw />
      </StackedProgressBarLegendDot>
      <StackedProgressBarLegendLabel>Running (20%)</StackedProgressBarLegendLabel>
    </StackedProgressBarLegendItem>
    <StackedProgressBarLegendItem>
      <StackedProgressBarLegendDot variant="icon" className="text-red-500">
        <X />
      </StackedProgressBarLegendDot>
      <StackedProgressBarLegendLabel>Failed (10%)</StackedProgressBarLegendLabel>
    </StackedProgressBarLegendItem>
  </StackedProgressBarLegend>
</StackedProgressBarProvider>
`.trim();

const customCode = `
<StackedProgressBarProvider max={240}>
  <StackedProgressBar value={186} label="Quarterly capacity" valueText="186 out of 240 points delivered">
    <StackedProgressBarSegment
      value={120}
      style={{ background: "linear-gradient(90deg, #10b981, #059669)" }}
    />
    <StackedProgressBarSegment value={46} className="bg-cyan-500" />
    <StackedProgressBarSegment value={20} className="bg-zinc-400" />
  </StackedProgressBar>
</StackedProgressBarProvider>
`.trim();

const tooltipCode = `
<TooltipProvider delayDuration={120}>
  <StackedProgressBarProvider max={240}>
    <StackedProgressBar value={186} label="Quarterly capacity" valueText="186 out of 240 points delivered">
      <Tooltip>
        <TooltipTrigger asChild>
          <StackedProgressBarSegment
            tabIndex={0}
            value={120}
            className="cursor-help"
            style={{ background: "linear-gradient(90deg, #10b981, #059669)" }}
          />
        </TooltipTrigger>
        <TooltipContent>Done: 120</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <StackedProgressBarSegment tabIndex={0} value={46} className="bg-cyan-500 cursor-help" />
        </TooltipTrigger>
        <TooltipContent>In review: 46</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <StackedProgressBarSegment tabIndex={0} value={20} className="bg-zinc-400 cursor-help" />
        </TooltipTrigger>
        <TooltipContent>Blocked: 20</TooltipContent>
      </Tooltip>
    </StackedProgressBar>
  </StackedProgressBarProvider>
</TooltipProvider>
`.trim();

function App() {
  return (
    <main className="min-h-screen py-10 px-4 text-zinc-900">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-10 rounded-3xl">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            stacked-progress-bar
          </h1>
          <p className="mt-3 max-w-2xl text-zinc-600">
            A composable stacked progress bar for shadcn/ui to display multiple
            statuses in one track, with optional legend, tooltips, and
            accessible semantics.
          </p>
        </header>

        <section className="mb-10 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-2xl font-semibold">Installation</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Add the component, then import the primitives in your project.
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-zinc-700">Command</p>
              <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-xs text-zinc-100">
                <code>
                  npx shadcn add https://your-registry/stacked-progress-bar.json
                </code>
              </pre>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-zinc-700">Import</p>
              <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-xs text-zinc-100">
                <code>{`import {
  StackedProgressBar,
  StackedProgressBarLegend,
  StackedProgressBarLegendDot,
  StackedProgressBarLegendItem,
  StackedProgressBarLegendLabel,
  StackedProgressBarProvider,
  StackedProgressBarSegment,
} from "@/components/ui/stacked-progress-bar";`}</code>
              </pre>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <ExampleBlock
            title="Basic usage"
            description="The minimal setup with provider, bar and segments."
            code={basicCode}
          >
            <StackedProgressBarProvider max={100}>
              <StackedProgressBar
                value={74}
                label="Project progress"
                valueText="74% completed"
              >
                <StackedProgressBarSegment
                  value={40}
                  className="bg-emerald-500"
                />
                <StackedProgressBarSegment value={24} className="bg-sky-500" />
                <StackedProgressBarSegment
                  value={10}
                  className="bg-amber-500"
                />
              </StackedProgressBar>
            </StackedProgressBarProvider>
          </ExampleBlock>

          <ExampleBlock
            title="With legend"
            description="Add a semantic legend to describe each segment meaning."
            code={legendCode}
          >
            <StackedProgressBarProvider max={100}>
              <StackedProgressBar
                value={96}
                label="Pipeline status"
                valueText="96 of 100 jobs done"
              >
                <StackedProgressBarSegment
                  value={66}
                  className="bg-emerald-500"
                />
                <StackedProgressBarSegment value={20} className="bg-blue-500" />
                <StackedProgressBarSegment value={10} className="bg-rose-500" />
              </StackedProgressBar>

              <StackedProgressBarLegend>
                <StackedProgressBarLegendItem>
                  <StackedProgressBarLegendDot className="!bg-emerald-500" />
                  <StackedProgressBarLegendLabel>
                    Success (66%)
                  </StackedProgressBarLegendLabel>
                </StackedProgressBarLegendItem>
                <StackedProgressBarLegendItem>
                  <StackedProgressBarLegendDot className="!bg-blue-500" />
                  <StackedProgressBarLegendLabel>
                    Running (20%)
                  </StackedProgressBarLegendLabel>
                </StackedProgressBarLegendItem>
                <StackedProgressBarLegendItem>
                  <StackedProgressBarLegendDot className="!bg-rose-500" />
                  <StackedProgressBarLegendLabel>
                    Failed (10%)
                  </StackedProgressBarLegendLabel>
                </StackedProgressBarLegendItem>
              </StackedProgressBarLegend>
            </StackedProgressBarProvider>
          </ExampleBlock>

          <ExampleBlock
            title="Legend with icon"
            description="Mix colored dots and icon markers in the legend."
            code={legendIconCode}
          >
            <StackedProgressBarProvider max={100}>
              <StackedProgressBar
                value={96}
                label="Pipeline status"
                valueText="96 of 100 jobs done"
              >
                <StackedProgressBarSegment
                  value={66}
                  className="bg-emerald-500"
                />
                <StackedProgressBarSegment value={20} className="bg-blue-500" />
                <StackedProgressBarSegment value={10} className="bg-rose-500" />
              </StackedProgressBar>

              <StackedProgressBarLegend>
                <StackedProgressBarLegendItem>
                  <StackedProgressBarLegendDot
                    variant="icon"
                    className="!text-emerald-500"
                  >
                    <Check />
                  </StackedProgressBarLegendDot>
                  <StackedProgressBarLegendLabel>
                    Success (66%)
                  </StackedProgressBarLegendLabel>
                </StackedProgressBarLegendItem>
                <StackedProgressBarLegendItem>
                  <StackedProgressBarLegendDot
                    variant="icon"
                    className="!text-blue-500"
                  >
                    <RefreshCw />
                  </StackedProgressBarLegendDot>
                  <StackedProgressBarLegendLabel>
                    Running (20%)
                  </StackedProgressBarLegendLabel>
                </StackedProgressBarLegendItem>
                <StackedProgressBarLegendItem>
                  <StackedProgressBarLegendDot
                    variant="icon"
                    className="!text-red-500"
                  >
                    <X />
                  </StackedProgressBarLegendDot>
                  <StackedProgressBarLegendLabel>
                    Failed (10%)
                  </StackedProgressBarLegendLabel>
                </StackedProgressBarLegendItem>
              </StackedProgressBarLegend>
            </StackedProgressBarProvider>
          </ExampleBlock>

          <ExampleBlock
            title="With tooltip"
            description="Shadcn-style tooltips on each segment for exact values."
            code={tooltipCode}
          >
            <TooltipProvider delayDuration={120}>
              <StackedProgressBarProvider max={240}>
                <StackedProgressBar
                  value={186}
                  label="Quarterly capacity"
                  valueText="186 out of 240 points delivered"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <StackedProgressBarSegment
                        tabIndex={0}
                        value={120}
                        className="cursor-help"
                        style={{
                          background:
                            "linear-gradient(90deg, #10b981, #059669)",
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>Done: 120</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <StackedProgressBarSegment
                        tabIndex={0}
                        value={46}
                        className="bg-cyan-500 cursor-help"
                      />
                    </TooltipTrigger>
                    <TooltipContent>In review: 46</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <StackedProgressBarSegment
                        tabIndex={0}
                        value={20}
                        className="bg-zinc-400 cursor-help"
                      />
                    </TooltipTrigger>
                    <TooltipContent>Blocked: 20</TooltipContent>
                  </Tooltip>
                </StackedProgressBar>
              </StackedProgressBarProvider>
            </TooltipProvider>
          </ExampleBlock>

          <ExampleBlock
            title="Custom max and styling"
            description="Use a non-100 max value and one-off visual styles."
            code={customCode}
          >
            <StackedProgressBarProvider max={240}>
              <StackedProgressBar
                value={186}
                label="Quarterly capacity"
                valueText="186 out of 240 points delivered"
              >
                <StackedProgressBarSegment
                  value={120}
                  style={{
                    background: "linear-gradient(90deg, #10b981, #059669)",
                  }}
                />
                <StackedProgressBarSegment value={46} className="bg-cyan-500" />
                <StackedProgressBarSegment value={20} className="bg-zinc-400" />
              </StackedProgressBar>
            </StackedProgressBarProvider>
          </ExampleBlock>
        </section>

        <section className="mt-10 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-2xl font-semibold">API</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Composable primitives exposed by stacked-progress-bar.
          </p>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-600">
                  <th className="py-3 pr-4 font-medium">Component</th>
                  <th className="py-3 pr-4 font-medium">Purpose</th>
                  <th className="py-3 pr-4 font-medium">Key props</th>
                </tr>
              </thead>
              <tbody className="align-top">
                <tr className="border-b border-zinc-100">
                  <td className="py-3 pr-4 font-medium text-zinc-900">
                    StackedProgressBarProvider
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">
                    Provides max to all segments through context.
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">max?: number</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="py-3 pr-4 font-medium text-zinc-900">
                    StackedProgressBar
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">
                    Main progress container with ARIA support.
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">
                    value?, label?, valueText?, className?
                  </td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="py-3 pr-4 font-medium text-zinc-900">
                    StackedProgressBarSegment
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">
                    A visual segment whose width is value divided by max.
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">
                    value: number, className?, style?
                  </td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="py-3 pr-4 font-medium text-zinc-900">
                    StackedProgressBarLegend
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">
                    Wraps legend items.
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">children</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="py-3 pr-4 font-medium text-zinc-900">
                    StackedProgressBarLegendItem
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">
                    Single legend row item.
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">children</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="py-3 pr-4 font-medium text-zinc-900">
                    StackedProgressBarLegendDot
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">
                    Visual marker for a legend item.
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">className?</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-zinc-900">
                    StackedProgressBarLegendLabel
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">
                    Text label for legend item.
                  </td>
                  <td className="py-3 pr-4 text-zinc-700">children</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
