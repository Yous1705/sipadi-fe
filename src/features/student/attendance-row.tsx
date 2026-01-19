"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Status } from "./status";

export type AttendanceRowItem = {
  id: number;
  name?: string | null;
  openAt: string;
  closeAt?: string | null;
  isAttended: boolean;
  subjectName: string;
  teacherName: string;
};

export function AttendanceRow({ s }: { s: AttendanceRowItem }) {
  const openText = new Date(s.openAt).toLocaleString();
  const closeText = s.closeAt ? new Date(s.closeAt).toLocaleString() : null;

  return (
    <div className="p-4 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="font-semibold text-slate-900 truncate">
          {s.name ?? `Session #${s.id}`}
        </div>
        <div className="text-sm text-slate-600">
          {s.subjectName} • {s.teacherName}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          Open: {openText}
          {closeText ? ` • Close: ${closeText}` : ""}
        </div>

        <div className="mt-2">
          {s.isAttended ? (
            <Status tone="green">Done</Status>
          ) : (
            <Status tone="amber">Not yet</Status>
          )}
        </div>
      </div>

      <div className="shrink-0">
        <Link href={`/student/attendance/session/${s.id}`}>
          <Button variant={s.isAttended ? "outline" : "primary"}>
            {s.isAttended ? "View" : "Attend"}
          </Button>
        </Link>
      </div>
    </div>
  );
}
