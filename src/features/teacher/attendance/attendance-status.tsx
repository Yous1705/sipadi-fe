"use client";
import React from "react";

export function AttendanceStatus({ active }: { active: boolean }) {
  return (
    <span
      className={[
        "text-xs px-2.5 py-1 rounded-full border",
        active
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-slate-50 text-slate-700 border-slate-200",
      ].join(" ")}
    >
      {active ? "ACTIVE" : "CLOSED"}
    </span>
  );
}
