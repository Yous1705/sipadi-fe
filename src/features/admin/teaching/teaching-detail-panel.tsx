"use client";

import React from "react";
import type { TeachingRow } from "@/types/admin";
import { Card } from "@/components/ui/card";

export function TeachingDetailPanel({ row }: { row: TeachingRow | null }) {
  return (
    <Card title="Detail" description="Selected teaching assignment details.">
      {!row ? (
        <div className="text-sm text-slate-500">Select an item from table.</div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="text-sm text-slate-600">Teaching Assignment</div>
            <div className="font-semibold text-slate-900">#{row.id}</div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="text-sm text-slate-600">Teacher</div>
            <div className="font-medium text-slate-900">
              {row.teacher?.name ?? `Teacher #${row.teacherId}`}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="text-sm text-slate-600">Class</div>
            <div className="font-medium text-slate-900">
              {row.class
                ? `${row.class.name} (${row.class.year})`
                : `Class #${row.classId}`}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="text-sm text-slate-600">Subject</div>
            <div className="font-medium text-slate-900">
              {row.subject?.name ?? `Subject #${row.subjectId}`}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
