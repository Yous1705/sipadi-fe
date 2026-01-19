"use client";
import React from "react";

export type SubjectTab = "assignments" | "attendance";

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

export function SubjectTab({
  value,
  onChange,
}: {
  value: SubjectTab;
  onChange: (v: SubjectTab) => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onChange("assignments")}
        className={cx(
          "px-3 py-2 rounded-lg text-sm font-medium transition",
          value === "assignments"
            ? "bg-blue-600 text-white"
            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",
        )}
      >
        Assignments
      </button>

      <button
        onClick={() => onChange("attendance")}
        className={cx(
          "px-3 py-2 rounded-lg text-sm font-medium transition",
          value === "attendance"
            ? "bg-blue-600 text-white"
            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",
        )}
      >
        Attendance
      </button>
    </div>
  );
}
