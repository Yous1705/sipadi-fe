"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import type { AdminDashboard } from "@/types/admin";

function KpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-2xl font-semibold text-slate-900 mt-1">{value}</div>
      {hint ? <div className="text-xs text-slate-500 mt-1">{hint}</div> : null}
    </div>
  );
}

export function Grid({ data }: { data: AdminDashboard }) {
  const c = data.counts;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        label="Users"
        value={c.users.total}
        hint={`Students: ${c.users.students} • Teachers: ${c.users.teachers} • Admins: ${c.users.admins}`}
      />

      <KpiCard
        label="Classes"
        value={c.classes.total}
        hint={`Active: ${c.classes.active}`}
      />

      <KpiCard label="Subjects" value={c.subjects} />
      <KpiCard label="Teaching Assignments" value={c.teachingAssignments} />

      <KpiCard
        label="Assignments"
        value={c.assignments.total}
        hint={`Draft: ${c.assignments.draft} • Published: ${c.assignments.published} • Closed: ${c.assignments.closed}`}
      />

      <KpiCard
        label="Attendance Sessions"
        value={c.attendanceSessions.activeNow}
        hint="Active now"
      />

      <KpiCard
        label="Submissions"
        value={c.submissions.pendingGrading}
        hint="Pending grading"
      />

      <KpiCard
        label="Health"
        value={c.users.total > 0 ? "OK" : "-"}
        hint="Quick overview"
      />
    </div>
  );
}
