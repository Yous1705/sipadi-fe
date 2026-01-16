"use client";

import StudentNavbar from "@/components/student-navbar";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getSubject } from "@/services/student/student.service";
import { SubjectResponse } from "@/types/student";

type Tab = "assignments" | "attendance";

function SubjectPage() {
  const { teachingAssigmentId } = useParams<{ teachingAssigmentId: string }>();
  const tid = Number(teachingAssigmentId);

  const [tab, setTab] = useState<Tab>("assignments");
  const [data, setData] = useState<SubjectResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tid) return;
    setLoading(true);
    setError(null);

    getSubject(tid)
      .then(setData)
      .catch((e: any) =>
        setError(e?.message ?? e?.error ?? "Gagal memuat subject")
      )
      .finally(() => setLoading(false));
  }, [tid]);

  return (
    <div>
      <StudentNavbar />
      <div className="max-w-6xl mx-auto p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">
              {data?.subjectName ?? "Subject"}
            </h1>
            <p className="text-sm text-gray-600">
              {data?.teacherName ? `Teacher: ${data.teacherName}` : ""}
            </p>
          </div>

          <Link className="text-sm underline" href="/student">
            Back to Dashboard
          </Link>
        </div>

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
        ) : !data ? (
          <div className="border rounded-xl p-4">Subject tidak ditemukan.</div>
        ) : tab === "assignments" ? (
          <div className="border rounded-xl p-4 space-y-3">
            <div className="font-semibold">Assignments</div>

            {data.assignments.length === 0 ? (
              <div className="text-sm text-gray-600">Belum ada tugas.</div>
            ) : (
              <div className="divide-y">
                {data.assignments.map((a) => {
                  const late = new Date(a.dueDate) < new Date();
                  return (
                    <div
                      key={a.id}
                      className="py-3 flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="font-medium">{a.title}</div>
                        <div className="text-xs text-gray-500">
                          Due: {new Date(a.dueDate).toLocaleString()}{" "}
                          {late ? "• Late" : ""}
                        </div>
                        <div className="text-sm text-gray-600">
                          Status:{" "}
                          {a.status === "SUBMITTED"
                            ? "Submitted"
                            : "Not submitted"}
                        </div>
                      </div>

                      <div className="text-right">
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
          <div className="border rounded-xl p-4 space-y-3">
            <div className="font-semibold">Active Attendance Sessions</div>

            {data.activeAttendanceSessions.length === 0 ? (
              <div className="text-sm text-gray-600">Tidak ada sesi aktif.</div>
            ) : (
              <div className="divide-y">
                {data.activeAttendanceSessions.map((s) => (
                  <div
                    key={s.id}
                    className="py-3 flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-gray-500">
                        Open: {new Date(s.openAt).toLocaleString()}
                        {s.closeAt
                          ? ` • Close: ${new Date(s.closeAt).toLocaleString()}`
                          : ""}
                      </div>
                    </div>

                    <div className="text-right text-sm">
                      {s.isAttended ? "Done" : "Not yet"}
                      <div>
                        <Link
                          href={`/student/attendance/session/${s.id}`}
                          className="inline-block mt-1 text-sm underline"
                        >
                          Detail
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SubjectPage;
