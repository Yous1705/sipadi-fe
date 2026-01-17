"use client";

import { getAdminDashboard } from "@/services/admin/admin.service";
import { AdminDashboard } from "@/types/admin";
import React, { useEffect, useState } from "react";

function StatCard({
  title,
  value,
  sub,
}: {
  title: string;
  value: any;
  sub?: string;
}) {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {sub ? <div className="text-xs text-gray-500 mt-1">{sub}</div> : null}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAdminDashboard()
      .then(setData)
      .catch((e) => setError(e?.message ?? "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!data) return <div>No data</div>;

  const c = data.counts;
  const h = data.highlights;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">
          Generated: {new Date(data.generatedAt).toLocaleString()}
        </p>
      </div>

      {/* COUNTS */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Students" value={c.users.students} />
        <StatCard title="Teachers" value={c.users.teachers} />
        <StatCard
          title="Classes (Active/Total)"
          value={`${c.classes.active}/${c.classes.total}`}
        />
        <StatCard title="Subjects" value={c.subjects} />
        <StatCard title="Teaching Assignments" value={c.teachingAssignments} />
        <StatCard
          title="Assignments (Published)"
          value={c.assignments.published}
          sub={`Total: ${c.assignments.total}`}
        />
        <StatCard
          title="Active Sessions Now"
          value={c.attendanceSessions.activeNow}
        />
        <StatCard
          title="Pending Grading"
          value={c.submissions.pendingGrading}
        />
      </div>

      {/* HIGHLIGHTS */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Classes without homeroom */}
        <div className="border rounded-lg p-4 bg-white">
          <div className="font-semibold">Classes without Homeroom</div>
          <div className="text-sm text-gray-500 mb-3">Top 10 (active)</div>
          <div className="space-y-2">
            {h.classesWithoutHomeroom.length === 0 ? (
              <div className="text-sm text-gray-500">No issues 🎉</div>
            ) : (
              h.classesWithoutHomeroom.map((x) => (
                <div
                  key={x.id}
                  className="flex items-center justify-between border rounded p-2"
                >
                  <div className="text-sm">
                    <div className="font-medium">{x.name}</div>
                    <div className="text-xs text-gray-500">Year {x.year}</div>
                  </div>
                  <div className="text-xs text-gray-500">ID: {x.id}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming attendance sessions */}
        <div className="border rounded-lg p-4 bg-white">
          <div className="font-semibold">Upcoming Attendance Sessions</div>
          <div className="text-sm text-gray-500 mb-3">Next 5 closing</div>
          <div className="space-y-2">
            {h.upcomingAttendanceSessions.length === 0 ? (
              <div className="text-sm text-gray-500">No sessions</div>
            ) : (
              h.upcomingAttendanceSessions.map((s) => (
                <div key={s.id} className="border rounded p-2">
                  <div className="text-sm font-medium">
                    {s.name ?? `Session ${s.id}`}
                  </div>
                  <div className="text-xs text-gray-500">
                    {s.teachingAssigment.class.name} (
                    {s.teachingAssigment.class.year}) •{" "}
                    {s.teachingAssigment.subject.name} •{" "}
                    {s.teachingAssigment.teacher.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Open: {new Date(s.openAt).toLocaleString()}
                    <br />
                    Close: {new Date(s.closeAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent assignments */}
        <div className="border rounded-lg p-4 bg-white">
          <div className="font-semibold">Recent Assignments</div>
          <div className="text-sm text-gray-500 mb-3">Latest 5</div>
          <div className="space-y-2">
            {h.recentAssignments.length === 0 ? (
              <div className="text-sm text-gray-500">No assignments</div>
            ) : (
              h.recentAssignments.map((a) => (
                <div key={a.id} className="border rounded p-2">
                  <div className="text-sm font-medium">{a.title}</div>
                  <div className="text-xs text-gray-500">
                    {a.teachingAssigment.class.name} (
                    {a.teachingAssigment.class.year}) •{" "}
                    {a.teachingAssigment.subject.name} •{" "}
                    {a.teachingAssigment.teacher.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Status: {a.status} • Due:{" "}
                    {new Date(a.dueDate).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
