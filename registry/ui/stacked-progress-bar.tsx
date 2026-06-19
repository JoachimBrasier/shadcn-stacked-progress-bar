"use client";
import { cva, VariantProps } from "class-variance-authority";
import {
  ComponentProps,
  createContext,
  Dispatch,
  SetStateAction,
  use,
  useEffect,
  useId,
  useState,
} from "react";

import { cn } from "@/lib/utils";

type StackedProgressBarContextValue = {
  max: number;
  legendId: string | null;
  setLegendId: Dispatch<SetStateAction<string | null>>;
};

const StackedProgressBarContext =
  createContext<StackedProgressBarContextValue | null>(null);

function useStackedProgressBarContext(componentName: string) {
  const context = use(StackedProgressBarContext);

  if (!context) {
    throw new Error(
      `${componentName} must be used within StackedProgressBarProvider.`,
    );
  }

  return context;
}

export function StackedProgressBarSegment({
  value,
  style,
  className,
  "aria-hidden": ariaHidden,
  ...props
}: { value: number } & ComponentProps<"div">) {
  const { max } = useStackedProgressBarContext("StackedProgressBarSegment");
  const safeValue = Number.isFinite(value)
    ? Math.min(Math.max(value, 0), max)
    : 0;

  return (
    <div
      data-slot="stacked-progress-bar-segment"
      aria-hidden={ariaHidden ?? true}
      {...{ ...props }}
      className={cn("h-full", className)}
      style={{ width: `${(safeValue / max) * 100}%`, ...style }}
    />
  );
}

export function StackedProgressBar({
  value,
  className,
  role,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-valuemin": ariaValueMin,
  "aria-valuemax": ariaValueMax,
  "aria-valuenow": ariaValueNow,
  "aria-valuetext": ariaValueText,
  ...props
}: { value?: number } & ComponentProps<"div">) {
  const context = useStackedProgressBarContext("StackedProgressBar");
  const max = context?.max ?? 100;
  const safeValue =
    value !== undefined && Number.isFinite(value)
      ? Math.min(Math.max(value, 0), max)
      : undefined;

  return (
    <div
      data-slot="stacked-progress-bar"
      role={role ?? "progressbar"}
      aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : "Progress")}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy ?? context?.legendId ?? undefined}
      aria-valuemin={ariaValueMin ?? 0}
      aria-valuemax={ariaValueMax ?? max}
      aria-valuenow={ariaValueNow ?? safeValue}
      aria-valuetext={ariaValueText}
      {...props}
      className={cn(
        "bg-muted flex h-3 overflow-hidden rounded-full",
        className,
      )}
    />
  );
}

export function StackedProgressBarLegend({
  id,
  className,
  role,
  ...props
}: ComponentProps<"div">) {
  const context = useStackedProgressBarContext("StackedProgressBarLegend");
  const generatedId = useId();
  const legendId = id ?? generatedId;

  useEffect(() => {
    context.setLegendId((currentLegendId) => {
      if (currentLegendId && currentLegendId !== legendId) {
        console.warn(
          "Only one StackedProgressBarLegend is allowed within StackedProgressBarProvider.",
        );

        return currentLegendId;
      }

      return legendId;
    });

    return () => {
      context.setLegendId((currentLegendId) => {
        return currentLegendId === legendId ? null : currentLegendId;
      });
    };
  }, [context, legendId]);

  return (
    <div
      data-slot="stacked-progress-bar-legend"
      id={legendId}
      role={role ?? "list"}
      {...props}
      className={cn("flex flex-row flex-wrap gap-4", className)}
    />
  );
}

const stackedProgressBarLegendDotVariant = cva(
  "inline-block mr-1.5 size-2 rounded-full shrink-0 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-muted",
        icon: "text-muted-foreground bg-transparent flex shrink-0 items-center mr-2.5 size-auto justify-center rounded-lg [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function StackedProgressBarLegendDot({
  className,
  variant = "default",
  "aria-hidden": ariaHidden = true,
  ...props
}: ComponentProps<"div"> &
  VariantProps<typeof stackedProgressBarLegendDotVariant>) {
  return (
    <span
      data-slot="stacked-progress-bar-legend-dot"
      aria-hidden={ariaHidden}
      {...props}
      className={cn(stackedProgressBarLegendDotVariant({ variant, className }))}
    />
  );
}

export function StackedProgressBarLegendLabel({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <span
      data-slot="stacked-progress-bar-legend-label"
      {...props}
      className={cn("text-muted-foreground", className)}
    />
  );
}

export function StackedProgressBarLegendItem({
  className,
  role,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="stacked-progress-bar-legend-item"
      role={role ?? "listitem"}
      {...props}
      className={cn("flex items-center", className)}
    />
  );
}

export function StackedProgressBarProvider({
  max = 100,
  ...props
}: { max?: number } & Omit<
  ComponentProps<typeof StackedProgressBarContext.Provider>,
  "value"
>) {
  const [legendId, setLegendId] = useState<string | null>(null);
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;

  return (
    <StackedProgressBarContext.Provider
      data-slot="stacked-progress-bar-provider"
      {...props}
      value={{ max: safeMax, legendId, setLegendId }}
    />
  );
}
