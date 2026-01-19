"use client";

import React from "react";

export function Status({
  tone,
  children,
}: {
  tone: "gray" | "green" | "amber" | "blue" | "rose";
  children: React.ReactNode;
}) {
  const cls =
    tone === "green"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : tone === "amber"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : tone === "blue"
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : tone === "rose"
            ? "bg-rose-50 text-rose-700 border-rose-200"
            : "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs rounded-full border ${cls}`}
    >
      {children}
    </span>
  );
}
