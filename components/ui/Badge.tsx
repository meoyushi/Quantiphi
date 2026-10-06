import React from "react";
import { cn } from "@/lib/utils";
import { Priority } from "@/types";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "low" | "medium" | "high" | "overloaded";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "sm",
  children,
  ...props
}: BadgeProps) {
  const base = "inline-flex items-center font-medium rounded tracking-wide uppercase";

  const variants = {
    default: "bg-neutral-100 text-neutral-700 border border-neutral-200",
    low: "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
    medium: "bg-amber-50 text-amber-700 border border-amber-200/80",
    high: "bg-red-50 text-red-700 border border-red-200/80",
    overloaded: "bg-red-100 text-red-800 border border-red-300 font-semibold",
  };

  const sizes = {
    sm: "px-1.5 py-0.5 text-[10px] leading-3",
    md: "px-2 py-0.5 text-xs leading-4",
  };

  return (
    <span className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const variantMap: Record<Priority, "low" | "medium" | "high"> = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
  };

  return <Badge variant={variantMap[priority]}>{priority}</Badge>;
}
