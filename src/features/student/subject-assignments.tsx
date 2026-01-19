"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { SubjectResponse, AssignmentHistoryItem } from "@/types/student";

import { getAssignmentHistoryByClass } from "@/services/student/student.service";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Status } from "@/features/student/status";

type Filter = "ALL" | "NOT_SUBMITTED" | "SUBMITTED";

function pickErr(e: any) {
  return e?.message ?? e?.error ?? "Gagal memuat assignment history";
}

export function SubjectAssignments({
  data,
  teachingAssigmentId,
}: {
  data: SubjectResponse;
  teachingAssigmentId: number;
}) {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [q, setQ] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<AssignmentHistoryItem[]>([]);

  // load history by class → filter by teachingAssigmentId (subject hub)
  useEffect(() => {
    if (!data.classId) {
      setItems([]);
      return;
    }

    setLoading(true);
    setError(null);

    getAssignmentHistoryByClass(Number(data.classId))
      .then((rows) => {
        const filtered = rows.filter(
          (x) => Number(x.teachingAssigmentId) === Number(teachingAssigmentId),
        );
        setItems(filtered);
      })
      .catch((e) => setError(pickErr(e)))
      .finally(() => setLoading(false));
  }, [data.classId, teachingAssigmentId]);

  const view = useMemo(() => {
    const qq = q.trim().toLowerCase();

    const byFilter =
      filter === "ALL" ? items : items.filter((a) => a.status === filter);

    const byQuery = !qq
      ? byFilter
      : byFilter.filter((a) => a.title.toLowerCase().includes(qq));

    // sort: dueDate desc (history enak terbaru dulu)
    return [...byQuery].sort(
      (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime(),
    );
  }, [items, filter, q]);

  return (
    <Card
      title="Assignments"
      description="All tasks for this subject (current + history)."
      action={
        <div className="hidden sm:block w-64">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search assignment..."
          />
        </div>
      }
    >
      <div className="space-y-4">
        <div className="sm:hidden">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search assignment..."
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            type="button"
            variant={filter === "ALL" ? "primary" : "outline"}
            onClick={() => setFilter("ALL")}
          >
            All
          </Button>
          <Button
            type="button"
            variant={filter === "NOT_SUBMITTED" ? "primary" : "outline"}
            onClick={() => setFilter("NOT_SUBMITTED")}
          >
            Not submitted
          </Button>
          <Button
            type="button"
            variant={filter === "SUBMITTED" ? "primary" : "outline"}
            onClick={() => setFilter("SUBMITTED")}
          >
            Submitted
          </Button>
        </div>

        {loading ? (
          <div className="text-sm text-slate-500">Loading...</div>
        ) : null}

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
            {error}
          </div>
        ) : null}

        {!loading && !error && view.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
            Tidak ada assignment untuk filter ini.
          </div>
        ) : (
          <div className="divide-y rounded-xl border border-slate-200 bg-white">
            {view.map((a) => {
              const late = new Date(a.dueDate) < new Date();
              const closed =
                String(a.assignmentStatus ?? "").toUpperCase() === "CLOSED";
              const submitted = a.status === "SUBMITTED";

              return (
                <div
                  key={a.id}
                  className="p-4 flex items-start justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 truncate">
                      {a.title}
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
                      {closed ? <Status tone="gray">Closed</Status> : null}
                      <Status tone="blue">Score: {a.score ?? "-"}</Status>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <Link href={`/student/assignments/${a.id}`}>
                      <Button variant={submitted ? "outline" : "primary"}>
                        {submitted ? "View" : "Open"}
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
