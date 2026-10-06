"use client";

import React from "react";
import { Workload } from "@/types";
import { getInitials } from "@/lib/utils";
import { AlertCircle, ShieldAlert } from "lucide-react";

interface TeamListProps {
  workload: Workload[];
  isLoading?: boolean;
}

export function TeamList({ workload, isLoading }: TeamListProps) {
  const overloadedCount = workload.filter((w) => w.overloaded).length;

  return (
    <div className="bg-white border border-neutral-200/80 rounded-lg p-4 shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Team Workload
          </h3>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
            {workload.length} members
          </span>
        </div>

        {overloadedCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600">
            <ShieldAlert className="h-3.5 w-3.5 animate-pulse text-red-600" />
            <span>{overloadedCount} member overloaded (&gt;5 in progress)</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2 py-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-md bg-neutral-50 animate-pulse">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-full bg-neutral-200" />
                <div className="space-y-1">
                  <div className="h-3 w-20 bg-neutral-200 rounded" />
                  <div className="h-2.5 w-14 bg-neutral-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : workload.length === 0 ? (
        <p className="text-xs text-neutral-400 py-2">No team members assigned.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {workload.map((member) => {
            const isOverloaded = member.overloaded;

            return (
              <div
                key={member.userId}
                className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                  isOverloaded
                    ? "border-red-300/90 bg-red-50/40 shadow-xs"
                    : "border-neutral-200/80 bg-neutral-50/40 hover:bg-neutral-50"
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  {/* User Avatar - Red & Pulsing if Overloaded */}
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-transform ${
                      isOverloaded
                        ? "bg-red-600 text-white animate-pulse-subtle shadow-xs ring-2 ring-red-400/50"
                        : "bg-neutral-800 text-neutral-100"
                    }`}
                    title={isOverloaded ? `${member.name} is overloaded with ${member.inProgressCount} in-progress tasks` : member.name}
                  >
                    {getInitials(member.name)}
                  </div>

                  <div className="truncate">
                    <p className="text-xs font-semibold text-neutral-900 truncate">
                      {member.name}
                    </p>
                    <p
                      className={`text-[11px] font-medium flex items-center gap-1 ${
                        isOverloaded ? "text-red-700 font-semibold" : "text-neutral-500"
                      }`}
                    >
                      {member.inProgressCount} in progress
                    </p>
                  </div>
                </div>

                {/* Overloaded badge */}
                {isOverloaded && (
                  <span className="shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-red-100 text-red-700 border border-red-200">
                    <AlertCircle className="h-2.5 w-2.5" />
                    Overloaded
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
