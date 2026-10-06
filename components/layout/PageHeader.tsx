"use client";

import React from "react";

interface PageHeaderProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  title = "Project Board",
  description = "Organize work and keep the team balanced.",
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 px-6 border-b border-neutral-200/60 bg-white">
      <div>
        <h2 className="text-lg font-bold text-neutral-900 tracking-tight">{title}</h2>
        <p className="text-xs text-neutral-500 mt-0.5">{description}</p>
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}
