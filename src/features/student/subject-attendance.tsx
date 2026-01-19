"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { SubjectResponse } from "@/types/student";

import { getAttendanceHistoryByClass } from "@/services/student/student.service";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Status } from "@/features/student/status";

type AttTab = "ACTIVE" | "HISTORY";

function pickErr(e: any) {
  return e?.message ?? e?.error ?? "Gagal memuat attendance history";
}

function norm(s?: string | null) {
  return String(s ?? "")
    .trim()
    .toLowerCase();
}

export function SubjectAttendance({ data }: { data: SubjectResponse }) {
  const [tab, setTab] = useState<AttTab>("ACTIVE");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  const active = data.activeAttendanceSessions ?? [];

  useEffect(() => {
    if (tab !== "HISTORY") return;

    // butuh classId untuk load history by class
    if (!data.classId) {
      setHistory([]);
      return;
    }

    setLoading(true);
    setError(null);

    getAttendanceHistoryByClass(Number(data.classId))
      .then((rows: any[]) => {
        // ✅ FIX: history response kamu tidak punya teachingAssigmentId,
        // jadi filter by subjectName + teacherName (yang memang dikirim BE)
        const targetSubject = norm(data.subjectName);
        const targetTeacher = norm(data.teacherName);

        const filtered = rows.filter((x: any) => {
          return (
            norm(x.subjectName) === targetSubject &&
            norm(x.teacherName) === targetTeacher
          );
        });

        setHistory(filtered);
      })
      .catch((e) => setError(pickErr(e)))
      .finally(() => setLoading(false));
  }, [tab, data.classId, data.subjectName, data.teacherName]);

  const list = useMemo(() => {
    const src = tab === "ACTIVE" ? active : history;
    return [...src].sort(
      (a: any, b: any) =>
        new Date(b.openAt).getTime() - new Date(a.openAt).getTime(),
    );
  }, [tab, active, history]);

  return (
    <Card
      title="Attendance"
      description={
        tab === "ACTIVE"
          ? "Sesi aktif untuk subject ini."
          : "Riwayat sesi untuk subject ini."
      }
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
      {tab === "HISTORY" && loading ? (
        <div className="text-sm text-slate-500">Loading...</div>
      ) : null}

      {tab === "HISTORY" && error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
          {error}
        </div>
      ) : null}

      {list.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
          {tab === "ACTIVE"
            ? "Tidak ada sesi aktif."
            : "Belum ada riwayat sesi untuk subject ini."}
        </div>
      ) : (
        <div className="divide-y rounded-xl border border-slate-200 bg-white">
          {list.map((s: any) => {
            const openText = new Date(s.openAt).toLocaleString();
            const closeText = s.closeAt
              ? new Date(s.closeAt).toLocaleString()
              : null;

            // ACTIVE: gunakan isAttended
            // HISTORY: gunakan attendance object
            const attended = tab === "ACTIVE" ? !!s.isAttended : !!s.attendance;
            const status = tab === "ACTIVE" ? s.status : s.attendance?.status;

            return (
              <div
                key={s.id}
                className="p-4 flex items-start justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 truncate">
                    {s.name ?? `Session #${s.id}`}
                  </div>

                  <div className="text-xs text-slate-500 mt-1">
                    Open: {openText}
                    {closeText ? ` • Close: ${closeText}` : ""}
                  </div>

                  <div className="mt-2 flex gap-2 flex-wrap">
                    {attended ? (
                      <Status tone="green">
                        Done{status ? ` (${status})` : ""}
                      </Status>
                    ) : (
                      <Status tone="amber">Not yet</Status>
                    )}
                    {tab === "HISTORY" ? (
                      <Status tone="gray">Read-only</Status>
                    ) : null}
                  </div>
                </div>

                <div className="shrink-0">
                  <Link href={`/student/attendance/session/${s.id}`}>
                    <Button variant={attended ? "outline" : "primary"}>
                      {attended ? "View" : "Attend"}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
