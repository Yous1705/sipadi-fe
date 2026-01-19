"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { AdminDashboard } from "@/types/admin";

function fmt(dt: string) {
  try {
    return new Date(dt).toLocaleString();
  } catch {
    return dt;
  }
}

export function Highlights({ data }: { data: AdminDashboard }) {
  const classesWithoutHomeroom = data.highlights.classesWithoutHomeroom ?? [];
  const upcomingSessions = data.highlights.upcomingAttendanceSessions ?? [];
  const recentAssignments = data.highlights.recentAssignments ?? [];

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card
        title="Classes Without Homeroom"
        description="Classes that still need a homeroom teacher."
        action={
          <Link href="/admin/classes">
            <Button variant="ghost">Open Classes</Button>
          </Link>
        }
      >
        <div className="space-y-2">
          {classesWithoutHomeroom.map((c, idx) => (
            <div
              key={c.id}
              className="rounded-lg border border-slate-200 bg-white p-3 flex items-center justify-between"
            >
              <div>
                <div className="font-medium text-slate-900">{c.name}</div>
                <div className="text-xs text-slate-500">Year: {c.year}</div>
              </div>
              <div className="text-xs text-slate-500">No. {idx + 1}</div>
            </div>
          ))}

          {classesWithoutHomeroom.length === 0 ? (
            <div className="text-sm text-slate-500">
              All classes have homeroom.
            </div>
          ) : null}
        </div>
      </Card>

      <Card
        title="Upcoming Attendance Sessions"
        description="Next sessions that will open soon."
        action={
          <Link href="/admin/attendances">
            <Button variant="ghost">Open Attendance</Button>
          </Link>
        }
      >
        <div className="space-y-2">
          {upcomingSessions.map((s, idx) => (
            <div
              key={s.id}
              className="rounded-lg border border-slate-200 bg-white p-3 flex items-start justify-between gap-3"
            >
              <div>
                <div className="font-medium text-slate-900">
                  {s.name ?? `Session #${s.id}`}
                </div>
                <div className="text-xs text-slate-500">
                  {s.teachingAssigment.class.name} (
                  {s.teachingAssigment.class.year}) •{" "}
                  {s.teachingAssigment.subject.name} •{" "}
                  {s.teachingAssigment.teacher.name}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Open: {fmt(s.openAt)} • Close: {fmt(s.closeAt)}
                </div>
              </div>
              <div className="text-xs text-slate-500">No. {idx + 1}</div>
            </div>
          ))}

          {upcomingSessions.length === 0 ? (
            <div className="text-sm text-slate-500">No upcoming sessions.</div>
          ) : null}
        </div>
      </Card>

      <Card
        title="Recent Assignments"
        description="Latest assignments created by teachers."
        action={
          <Link href="/admin/teaching-assignments">
            <Button variant="ghost">Open Teaching</Button>
          </Link>
        }
      >
        <div className="space-y-2">
          {recentAssignments.map((a, idx) => (
            <div
              key={a.id}
              className="rounded-lg border border-slate-200 bg-white p-3 flex items-start justify-between gap-3"
            >
              <div>
                <div className="font-medium text-slate-900">{a.title}</div>
                <div className="text-xs text-slate-500">
                  {a.teachingAssigment.class.name} (
                  {a.teachingAssigment.class.year}) •{" "}
                  {a.teachingAssigment.subject.name} •{" "}
                  {a.teachingAssigment.teacher.name}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Due: {fmt(a.dueDate)} • Status: {a.status}
                </div>
              </div>
              <div className="text-xs text-slate-500">No. {idx + 1}</div>
            </div>
          ))}

          {recentAssignments.length === 0 ? (
            <div className="text-sm text-slate-500">No recent assignments.</div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
