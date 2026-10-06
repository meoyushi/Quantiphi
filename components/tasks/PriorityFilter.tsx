"use client";

import React from "react";
import { PriorityFilterType } from "@/types";
import { cn } from "@/lib/utils";

interface PriorityFilterProps {
  activePriority: PriorityFilterType;
  onChange: (priority: PriorityFilterType) => void;
}

const filters: { label: string; value: PriorityFilterType }[] = [
  { label: "All Priorities", value: "ALL" },
  { label: "Low", value: "LOW" },
  { label: "Medium", value: "MEDIUM" },
  { label: "High", value: "HIGH" },
];

export function PriorityFilter({ activePriority, onChange }: PriorityFilterProps) {
  return (
    <div className="inline-flex items-center p-0.5 rounded-lg bg-neutral-100/90 border border-neutral-200 text-xs">
      {filters.map((filter) => {
        const isSelected = activePriority === filter.value;
        return (
          <button
            key={filter.value}
            onClick={() => onChange(filter.value)}
            className={cn(
              "px-3 py-1 rounded-md font-medium transition-all",
              isSelected
                ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
