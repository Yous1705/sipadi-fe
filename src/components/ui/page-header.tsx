"use client";
import React from "react";

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        {subtitle ? (
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        ) : null}
      </div>
      {right}
    </div>
  );
}
