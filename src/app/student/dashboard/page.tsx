"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  getMySubjects,
  getStudentDashboard,
} from "@/services/student/student.service";
import type { Subject } from "@/types/student";
import type {
  StudentDashboardResponse,
  StudentDashboardAssignment,
  StudentDashboardAttendance,
} from "@/types/student";

import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function pickErr(e: any) {
  return e?.message ?? e?.error ?? "Gagal memuat dashboard";
}

function MiniRow({
  title,
  subtitle,
  meta,
  href,
  cta,
}: {
  title: string;
  subtitle: string;
  meta?: string;
  href: string;
  cta: string;
}) {
  return (
    <Link href={href} className="block p-4 hover:bg-slate-50 transition">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="font-semibold text-slate-900 truncate">{title}</div>
          <div className="text-sm text-slate-600 truncate">{subtitle}</div>
          {meta ? (
            <div className="text-xs text-slate-500 mt-1">{meta}</div>
          ) : null}
        </div>
        <div className="shrink-0">
          <Button variant="primary">{cta}</Button>
        </div>
      </div>
    </Link>
  );
}

function StatCard({
  title,
  value,
  hint,
  href,
}: {
  title: string;
  value: number;
  hint: string;
  href: string;
}) {
  return (
    <Card
      title={title}
      description={hint}
      action={
        <Link href={href}>
          <Button variant="outline">View</Button>
        </Link>
      }
    >
      <div className="text-3xl font-bold text-slate-900">{value}</div>
    </Card>
  );
}

export default function StudentDashboardPage() {
  const [dash, setDash] = useState<StudentDashboardResponse | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [d, subs] = await Promise.all([
        getStudentDashboard(),
        getMySubjects(),
      ]);
      setDash(d);
      setSubjects(subs);
    } catch (e) {
      setError(pickErr(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const pendingAssignments = useMemo<StudentDashboardAssignment[]>(
    () => dash?.pendingAssignments ?? [],
    [dash],
  );
  const pendingAttendances = useMemo<StudentDashboardAttendance[]>(
    () => dash?.pendingAttendances ?? [],
    [dash],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Yang perlu kamu kerjakan sekarang."
        right={
          <Button onClick={load} variant="outline" disabled={loading}>
            Refresh
          </Button>
        }
      />

      {loading ? (
        <div className="text-sm text-slate-500">Loading...</div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
          {error}
        </div>
      ) : !dash ? (
        <Card title="No data">
          <div className="text-sm text-slate-600">
            Dashboard tidak tersedia.
          </div>
        </Card>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard
              title="Pending assignments"
              value={dash.pendingAssignmentsCount}
              hint="Belum submit & belum lewat due date."
              href="/student/assignments"
            />
            <StatCard
              title="Pending attendance"
              value={dash.pendingAttendancesCount}
              hint="Sesi aktif yang belum kamu isi."
              href="/student/attendance"
            />
          </div>

          <Card
            title="To-do assignments"
            description="Klik untuk langsung ke halaman pengumpulan."
            action={
              <Link href="/student/assignments">
                <Button variant="outline">All</Button>
              </Link>
            }
          >
            {pendingAssignments.length === 0 ? (
              <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600">
                Mantap — tidak ada tugas yang perlu kamu submit sekarang.
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white divide-y">
                {pendingAssignments.map((a) => (
                  <MiniRow
                    key={a.id}
                    title={a.title}
                    subtitle={`${a.subjectName} • ${a.teacherName}`}
                    meta={`Due: ${new Date(a.dueDate).toLocaleString()}`}
                    href={`/student/assignments/${a.id}`}
                    cta="Submit"
                  />
                ))}
              </div>
            )}
          </Card>

          <Card
            title="To-do attendance"
            description="Klik untuk langsung mengisi attendance."
            action={
              <Link href="/student/attendance">
                <Button variant="outline">All</Button>
              </Link>
            }
          >
            {pendingAttendances.length === 0 ? (
              <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600">
                Tidak ada sesi absensi yang perlu kamu isi.
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white divide-y">
                {pendingAttendances.map((s) => (
                  <MiniRow
                    key={s.id}
                    title={s.name ?? `Session #${s.id}`}
                    subtitle={`${s.subjectName} • ${s.teacherName}`}
                    meta={`Open: ${new Date(s.openAt).toLocaleString()}${
                      s.closeAt
                        ? ` • Close: ${new Date(s.closeAt).toLocaleString()}`
                        : ""
                    }`}
                    href={`/student/attendance/session/${s.id}`}
                    cta="Attend"
                  />
                ))}
              </div>
            )}
          </Card>

          <Card
            title="My Subjects"
            description="Pilih subject untuk lihat tugas & absensi."
          >
            {subjects.length === 0 ? (
              <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600">
                Belum ada subject.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {subjects.map((s) => (
                  <div
                    key={s.teachingAssigmentId}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate">
                          {s.subjectName}
                        </div>
                        <div className="text-sm text-slate-600 truncate">
                          {s.teacherName}
                        </div>
                      </div>

                      <Link href={`/student/subjects/${s.teachingAssigmentId}`}>
                        <Button variant="primary">Open</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
