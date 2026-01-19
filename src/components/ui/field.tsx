"use client";
import React from "react";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-medium text-slate-600">{label}</div>
        {hint ? <div className="text-xs text-slate-400">{hint}</div> : null}
      </div>
      {children}
    </div>
  );
}
