"use client";

import { Card } from "@/components/ui/card";
import { SubjectResponse } from "@/types/student";

export function SubjectSummary({ data }: { data: SubjectResponse }) {
  const total = data.assignments.length;
  const submitted = data.assignments.filter(
    (a) => a.status === "SUBMITTED",
  ).length;
  const pending = total - submitted;
  const activeSessions = data.activeAttendanceSessions.length;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Card title="Assignments">
        <div className="text-3xl font-bold">{total}</div>
      </Card>
      <Card title="Submitted">
        <div className="text-3xl font-bold">{submitted}</div>
      </Card>
      <Card title="Pending">
        <div className="text-3xl font-bold">{pending}</div>
      </Card>
      <Card title="Active Attendance">
        <div className="text-3xl font-bold">{activeSessions}</div>
      </Card>
    </div>
  );
}
