"use client";

import React from "react";
import Link from "next/link";
import { Assignment } from "@/types/teacher";
import { AssignmentStatus } from "./status";

export function AssignmentItem({
  teachingAssigmentId,
  a,
}: {
  teachingAssigmentId: number;
  a: Assignment;
}) {
  return (
    <Link
      href={`/teacher/teaching/${teachingAssigmentId}/assignments/${a.id}`}
      className="block rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
    >
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-semibold text-slate-900 truncate">{a.title}</div>
          <div className="text-sm text-slate-500 mt-1">
            Due: {new Date(a.dueDate).toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Policy: {a.submissionPolicy} • Max: {a.maxFileSizeMb}MB
            {a.allowedMime ? ` • Mime: ${a.allowedMime}` : ""}
          </div>
        </div>

        <div className="shrink-0">
          <AssignmentStatus value={String(a.status)} />
        </div>
      </div>
    </Link>
  );
}
