"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import {
  getMySubjects,
  getSubject,
  getActiveAttendanceByClass,
  getAttendanceHistoryByClass,
} from "@/services/student/student.service";

import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Tab = "ACTIVE" | "HISTORY";

function pickErr(e: any) {
  return e?.message ?? e?.error ?? "Gagal memuat attendance";
}

function StatusBadge({
  tone,
  children,
}: {
  tone: "gray" | "green" | "amber";
  children: React.ReactNode;
}) {
  const cls =
    tone === "green"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : tone === "amber"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs rounded-full border ${cls}`}
    >
      {children}
    </span>
  );
}

export default function AllAttendancePage() {
  const [tab, setTab] = useState<Tab>("ACTIVE");
  const [q, setQ] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [classId, setClassId] = useState<number | null>(null);

  const [active, setActive] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    (async () => {
      // ambil classId dari salah satu subject hub
      const subjects = await getMySubjects();
      if (!subjects.length) {
        setClassId(null);
        setActive([]);
        setHistory([]);
        return;
      }

      const hub = await getSubject(subjects[0].teachingAssigmentId);
      const cid = hub.classId ? Number(hub.classId) : null;
      setClassId(cid);

      if (!cid) {
        setActive([]);
        setHistory([]);
        return;
      }

      // ambil active + history dari class (karena student cuma 1 kelas)
      const [a, h] = await Promise.all([
        getActiveAttendanceByClass(cid),
        getAttendanceHistoryByClass(cid),
      ]);

      setActive(a);
      setHistory(h);
    })()
      .catch((e: any) => setError(pickErr(e)))
      .finally(() => setLoading(false));
  }, []);

  const list = useMemo(() => {
    const source = tab === "ACTIVE" ? active : history;
    const qq = q.trim().toLowerCase();

    const filtered = !qq
      ? source
      : source.filter((s: any) => {
          const name = String(s.name ?? `Session #${s.id}`).toLowerCase();
          const subj = String(s.subjectName ?? "").toLowerCase();
          const teacher = String(s.teacherName ?? "").toLowerCase();
          return name.includes(qq) || subj.includes(qq) || teacher.includes(qq);
        });

    return filtered.sort((a: any, b: any) => {
      const ta = new Date(a.openAt).getTime();
      const tb = new Date(b.openAt).getTime();
      return tb - ta;
    });
  }, [tab, active, history, q]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Attendance"
        subtitle="Active bisa diisi. History hanya lihat detail."
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
        <Card
          title={tab === "ACTIVE" ? "Active sessions" : "History"}
          description={classId ? `Class ID: ${classId}` : "Class not found"}
          action={
            <div className="flex gap-2">
              <Button
                type="button"
                variant={tab === "ACTIVE" ? "primary" : "outline"}
                onClick={() => setTab("ACTIVE")}
              >
                Active
              </Button>
              <Button
                type="button"
                variant={tab === "HISTORY" ? "primary" : "outline"}
                onClick={() => setTab("HISTORY")}
              >
                History
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="max-w-sm">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search session / subject..."
              />
            </div>

            {list.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
                Tidak ada data untuk tab ini.
              </div>
            ) : (
              <div className="divide-y rounded-xl border border-slate-200 bg-white">
                {list.map((s: any) => {
                  const openText = new Date(s.openAt).toLocaleString();
                  const closeText = s.closeAt
                    ? new Date(s.closeAt).toLocaleString()
                    : null;

                  const attended =
                    tab === "ACTIVE" ? !!s.isAttended : !!s.attendance;
                  const status =
                    tab === "ACTIVE" ? s.status : s.attendance?.status;

                  return (
                    <Link
                      key={s.id}
                      href={`/student/attendance/session/${s.id}`}
                      className="block p-4 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-start justify-between gap-4">
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

                          <div className="mt-2 flex gap-2 flex-wrap">
                            {attended ? (
                              <StatusBadge tone="green">
                                Done {status ? `(${status})` : ""}
                              </StatusBadge>
                            ) : (
                              <StatusBadge tone="amber">Not yet</StatusBadge>
                            )}

                            {tab === "HISTORY" ? (
                              <StatusBadge tone="gray">Read-only</StatusBadge>
                            ) : null}
                          </div>
                        </div>

                        <div className="shrink-0">
                          <Button
                            variant={tab === "HISTORY" ? "outline" : "primary"}
                          >
                            {tab === "HISTORY"
                              ? "View"
                              : attended
                                ? "View"
                                : "Attend"}
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
