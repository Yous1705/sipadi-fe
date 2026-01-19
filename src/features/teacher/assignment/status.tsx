"use client";
import React from "react";

export function AssignmentStatus({ value }: { value: string }) {
  const v = String(value ?? "").toUpperCase();

  const cls =
    v === "PUBLISHED"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : v === "DRAFT"
        ? "bg-slate-50 text-slate-700 border-slate-200"
        : v === "CLOSED"
          ? "bg-amber-50 text-amber-700 border-amber-200"
          : "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <span className={`text-xs px-2.5 py-1 rounded-full border ${cls}`}>
      {value}
    </span>
  );
}
