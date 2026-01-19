"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Status } from "./status";

export type AssignmentRowItem = {
  id: number;
  title: string;
  dueDate: string;
  status: "SUBMITTED" | "NOT_SUBMITTED";
  score?: number | null;
  subjectName: string;
  teacherName: string;

  // optional jika BE mengirim
  assignmentStatus?: string | null;
};

export function AssignmentRow({
  a,
  readonly,
}: {
  a: AssignmentRowItem;
  readonly: boolean;
}) {
  const late = new Date(a.dueDate) < new Date();
  const submitted = a.status === "SUBMITTED";

  return (
    <div className="p-4 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="font-semibold text-slate-900 truncate">{a.title}</div>
        <div className="text-sm text-slate-600">
          {a.subjectName} • {a.teacherName}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          Due: {new Date(a.dueDate).toLocaleString()}
        </div>

        <div className="mt-2 flex gap-2 flex-wrap">
          {submitted ? (
            <Status tone="green">Submitted</Status>
          ) : (
            <Status tone="amber">Not submitted</Status>
          )}

          {late ? <Status tone="rose">Late</Status> : null}

          {(a.assignmentStatus ?? "").toUpperCase() === "CLOSED" ? (
            <Status tone="gray">Closed</Status>
          ) : null}

          <Status tone="blue">Score: {a.score ?? "-"}</Status>
        </div>
      </div>

      <div className="shrink-0">
        <Link href={`/student/assignments/${a.id}`}>
          <Button variant={readonly ? "outline" : "primary"}>
            {readonly ? "View" : "Submit"}
          </Button>
        </Link>
      </div>
    </div>
  );
}
