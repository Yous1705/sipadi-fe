"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import type { AssignmentHistoryItem } from "@/types/student";
import {
  getAssignmentHistoryByClass,
  getMySubjects,
  getSubject,
} from "@/services/student/student.service";

import { Status } from "@/features/student/status";
import {
  AssignmentFilters,
  Filter,
} from "@/features/student/assignment-filter";

function pickErr(e: any) {
  return e?.message ?? e?.error ?? "Gagal memuat assignments";
}

export default function AllAssignmentsPage() {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [q, setQ] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<AssignmentHistoryItem[]>([]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    (async () => {
      // Ambil classId dari salah satu subject hub (student cuma 1 kelas)
      const subjects = await getMySubjects();
      if (!subjects.length) {
        setItems([]);
        return;
      }
      const hub = await getSubject(subjects[0].teachingAssigmentId);
      const classId = Number(hub.classId);
      if (!classId) {
        setItems([]);
        return;
      }

      const rows = await getAssignmentHistoryByClass(classId);
      setItems(rows);
    })()
      .catch((e: any) => setError(pickErr(e)))
      .finally(() => setLoading(false));
  }, []);

  const assignments = useMemo(() => {
    const qq = q.trim().toLowerCase();

    const byFilter =
      filter === "ALL" ? items : items.filter((x) => x.status === filter);

    const byQuery = !qq
      ? byFilter
      : byFilter.filter((x) => x.title.toLowerCase().includes(qq));

    // sort: dueDate desc (history enak terbaru dulu) — kalau kamu mau asc tinggal balik
    return [...byQuery].sort(
      (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime(),
    );
  }, [items, filter, q]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="All Assignments"
        subtitle="All tasks (current + history)."
        right={
          <Link href="/student/dashboard">
            <Button>Back</Button>
          </Link>
        }
      />

      {loading ? (
        <div className="text-sm text-slate-500">Loading...</div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
          {error}
        </div>
      ) : (
        <Card title="Assignments" description={`${assignments.length} item(s)`}>
          <div className="space-y-4">
            <AssignmentFilters
              filter={filter}
              onFilter={setFilter}
              q={q}
              onQ={setQ}
            />

            {assignments.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
                Belum ada assignment.
              </div>
            ) : (
              <div className="divide-y rounded-xl border border-slate-200 bg-white">
                {assignments.map((a) => {
                  const late = new Date(a.dueDate) < new Date();
                  const closed =
                    String(a.assignmentStatus ?? "").toUpperCase() === "CLOSED";
                  const submitted = a.status === "SUBMITTED";

                  return (
                    <Link
                      key={a.id}
                      href={`/student/assignments/${a.id}`}
                      className="block p-4 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 truncate">
                            {a.title}
                          </div>
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
                            {closed ? (
                              <Status tone="gray">Closed</Status>
                            ) : null}
                            <Status tone="blue">Score: {a.score ?? "-"}</Status>
                          </div>
                        </div>

                        <div className="shrink-0">
                          <Button variant={submitted ? "outline" : "primary"}>
                            {submitted ? "View" : "Open"}
                          </Button>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
