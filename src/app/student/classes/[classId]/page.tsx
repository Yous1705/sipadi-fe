"use client";
import StudentNavbar from "@/components/student-navbar";
import {
  getActiveAttendanceByClass,
  getAttendanceHistoryByClass,
  getClass,
  selfAttend,
} from "@/services/student/student.service";
import {
  ActiveAttendanceItem,
  AttendanceHistoryItem,
  ClassResponse,
} from "@/types/student";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

type Tab = "assignments" | "attendance";
function page() {
  const { classId } = useParams<{ classId: string }>();
  const idClass = Number(classId);
  const [tab, setTab] = useState<Tab>("assignments");

  const [classs, setClases] = useState<ClassResponse | null>(null);
  const [activeSessions, setActiveSessions] = useState<ActiveAttendanceItem[]>(
    []
  );
  const [history, setHistory] = useState<AttendanceHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [attLoading, setAttLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allAssignmets = useMemo(() => {
    const list =
      classs?.subjects.flatMap((s) =>
        s.assignments.map((a) => ({
          ...a,
          subjectName: s.subjectName,
          teacherName: s.teacherName,
        }))
      ) ?? [];
    return list.sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
  }, [classs]);

  useEffect(() => {
    if (!idClass) return;
    setLoading(true);
    setError(null);

    getClass(idClass)
      .then(setClases)
      .catch(() => setError("Gagal memuat kelas"))
      .finally(() => setLoading(false));
  }, [idClass]);

  useEffect(() => {
    if (tab !== "attendance" || !idClass) return;
    setAttLoading(true);

    Promise.all([
      getActiveAttendanceByClass(idClass),
      getAttendanceHistoryByClass(idClass),
    ])
      .then(([active, hist]) => {
        setActiveSessions(active);
        setHistory(hist);
      })
      .finally(() => setAttLoading(false));
  }, [tab, idClass]);

  async function handleSelfAttend(
    attendanceSessionId: number,
    status: "HADIR" | "IZIN" | "SAKIT" | "ALPHA"
  ) {
    try {
      await selfAttend({ attendanceSessionId, status });
      const [active, hist] = await Promise.all([
        getActiveAttendanceByClass(idClass),
        getAttendanceHistoryByClass(idClass),
      ]);
      setActiveSessions(active);
      setHistory(hist);
    } catch (e: any) {
      alert(e?.message ?? "Gagal absen");
    }
  }
  return (
    <div>
      <StudentNavbar />

      <div className="max-w-6xl mx-auto p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Class Hub</h1>
            <p className="text-sm text-gray-600">Class ID: {idClass}</p>
          </div>
          <Link className="text-sm underline" href="/student/classes">
            Back to Classes
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab("assignments")}
            className={`px-3 py-2 rounded-lg border text-sm ${
              tab === "assignments" ? "bg-black text-white" : ""
            }`}
          >
            Assignments
          </button>
          <button
            onClick={() => setTab("attendance")}
            className={`px-3 py-2 rounded-lg border text-sm ${
              tab === "attendance" ? "bg-black text-white" : ""
            }`}
          >
            Attendance
          </button>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="border rounded-xl p-4 text-red-600">{error}</div>
        ) : !classs ? (
          <div className="border rounded-xl p-4">Class tidak ditemukan.</div>
        ) : tab === "assignments" ? (
          <div className="border rounded-xl p-4 space-y-3">
            <div className="font-semibold">Assignments</div>

            {allAssignmets.length === 0 ? (
              <div className="text-sm text-gray-600">Belum ada tugas.</div>
            ) : (
              <div className="divide-y">
                {allAssignmets.map((a) => {
                  const late = new Date(a.dueDate) < new Date();
                  return (
                    <div
                      key={a.id}
                      className="py-3 flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="font-medium">{a.title}</div>
                        <div className="text-sm text-gray-600">
                          {a.subjectName} • {a.teacherName}
                        </div>
                        <div className="text-xs text-gray-500">
                          Due: {new Date(a.dueDate).toLocaleString()}{" "}
                          {late ? "• Late" : ""}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm">
                          {a.status === "SUBMITTED"
                            ? "Submitted"
                            : "Not submitted"}
                        </div>
                        <div className="text-xs text-gray-500">
                          Score: {a.score ?? "-"}
                        </div>
                        <Link
                          href={`/student/assignments/${a.id}`}
                          className="inline-block mt-2 text-sm underline"
                        >
                          Open
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border rounded-xl p-4 space-y-2">
              <div className="font-semibold">Active Sessions</div>

              {attLoading ? (
                <div>Loading...</div>
              ) : activeSessions.length === 0 ? (
                <div className="text-sm text-gray-600">
                  Tidak ada sesi aktif.
                </div>
              ) : (
                <div className="divide-y">
                  {activeSessions.map((s) => (
                    <div
                      key={s.id}
                      className="py-3 flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-sm text-gray-600">
                          {s.subjectName} • {s.teacherName}
                        </div>
                        <div className="text-xs text-gray-500">
                          Open: {new Date(s.openAt).toLocaleString()}
                          {s.closeAt
                            ? ` • Close: ${new Date(
                                s.closeAt
                              ).toLocaleString()}`
                            : ""}
                        </div>
                      </div>

                      <div className="text-right space-y-2">
                        {s.isAttended ? (
                          <div className="text-sm">
                            Done ({s.status ?? "-"})
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              className="px-3 py-2 rounded-lg border text-sm"
                              onClick={() => handleSelfAttend(s.id, "HADIR")}
                            >
                              HADIR
                            </button>
                            <button
                              className="px-3 py-2 rounded-lg border text-sm"
                              onClick={() => handleSelfAttend(s.id, "IZIN")}
                            >
                              IZIN
                            </button>
                            <button
                              className="px-3 py-2 rounded-lg border text-sm"
                              onClick={() => handleSelfAttend(s.id, "SAKIT")}
                            >
                              SAKIT
                            </button>
                          </div>
                        )}

                        <Link
                          className="text-sm underline"
                          href={`/student/attendance/session/${s.id}`}
                        >
                          Detail
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border rounded-xl p-4 space-y-2">
              <div className="font-semibold">History</div>

              {attLoading ? (
                <div>Loading...</div>
              ) : history.length === 0 ? (
                <div className="text-sm text-gray-600">
                  Belum ada riwayat sesi.
                </div>
              ) : (
                <div className="divide-y">
                  {history.map((s) => (
                    <div
                      key={s.id}
                      className="py-3 flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-sm text-gray-600">
                          {s.subjectName} • {s.teacherName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(s.openAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        {s.attendance ? (
                          <div>
                            {s.attendance.status}
                            <div className="text-xs text-gray-500">
                              {new Date(
                                s.attendance.attendedAt
                              ).toLocaleString()}
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-500">No record</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default page;
