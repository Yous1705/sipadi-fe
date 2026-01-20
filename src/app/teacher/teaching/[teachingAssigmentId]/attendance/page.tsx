"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { AttendanceSessionProgress } from "@/types/teacher";
import { getAttendanceSessionsProgress } from "@/services/teacher/teacher.service";

import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AttendanceStatus } from "@/features/teacher/attendance/attendance-status";

function pickErr(e: any) {
  return e?.message ?? e?.error ?? "Gagal memuat attendance sessions";
}

function progressPercent(progress?: string | number | null) {
  if (progress === null || progress === undefined) return 0;

  if (typeof progress === "number") {
    const n = Number.isFinite(progress) ? progress : 0;
    return Math.max(0, Math.min(100, n));
  }

  const s = String(progress).trim();
  const m = s.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (m) {
    const a = Number(m[1]);
    const b = Number(m[2]);
    if (!b) return 0;
    return Math.max(0, Math.min(100, Math.round((a / b) * 100)));
  }

  const n = Number(s.replace("%", "").trim());
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

function TeacherAttendanceSessionsPage() {
  const params = useParams();
  const teachingAssigmentId = Number(params.teachingAssigmentId);

  const [items, setItems] = useState<AttendanceSessionProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");

  useEffect(() => {
    if (!teachingAssigmentId) return;

    setLoading(true);
    setError(null);

    getAttendanceSessionsProgress(teachingAssigmentId)
      .then(setItems)
      .catch((e) => setError(pickErr(e)))
      .finally(() => setLoading(false));
  }, [teachingAssigmentId]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return items;
    return items.filter((s) =>
      String(s.name ?? `Session ${s.id}`)
        .toLowerCase()
        .includes(qq),
    );
  }, [items, q]);

  if (!teachingAssigmentId) {
    return (
      <Card
        title="Invalid params"
        description="teachingAssigmentId tidak valid."
      >
        <Link
          href="/teacher"
          className="text-sm text-slate-600 hover:underline"
        >
          ← Back
        </Link>
      </Card>
    );
  }

  if (loading) return <div className="text-sm text-slate-500">Loading...</div>;

  if (error) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
          {error}
        </div>
        <Link
          href={`/teacher/teaching/${teachingAssigmentId}`}
          className="text-sm text-slate-600 hover:underline"
        >
          ← Kembali
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Attendance Sessions"
        subtitle={`Teaching ID: ${teachingAssigmentId}`}
        right={
          <div className="flex items-center gap-2">
            <Link
              href={`/teacher/teaching/${teachingAssigmentId}/attendance/open`}
            >
              <Button variant="primary">+ Open Session</Button>
            </Link>
            <Link href={`/teacher/teaching/${teachingAssigmentId}`}>
              <Button>Back</Button>
            </Link>
          </div>
        }
      />

      <Card title="Sessions" description={`${filtered.length} session(s)`}>
        <div className="space-y-4">
          <div className="max-w-sm">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search session..."
            />
          </div>

          {!filtered.length ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
              Belum ada attendance session untuk teaching ini.
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((s) => {
                const pct = progressPercent(s.progress);
                return (
                  <Link
                    key={s.id}
                    href={`/teacher/teaching/${teachingAssigmentId}/attendance/${s.id}`}
                    className="block rounded-xl border border-slate-200 bg-white p-4 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate">
                          {s.name ?? `Session ${s.id}`}
                        </div>
                        <div className="text-sm text-slate-600 mt-1">
                          {new Date(s.openAt).toLocaleString()} —{" "}
                          {new Date(s.closeAt).toLocaleString()}
                        </div>

                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>Progress</span>
                            <span>{pct}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100 overflow-hidden mt-1">
                            <div
                              className="h-full bg-blue-600"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <AttendanceStatus active={!!s.isActive} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div>
            <Link
              href={`/teacher/teaching/${teachingAssigmentId}`}
              className="text-sm text-slate-600 hover:underline"
            >
              ← Kembali ke Teaching
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default TeacherAttendanceSessionsPage;
