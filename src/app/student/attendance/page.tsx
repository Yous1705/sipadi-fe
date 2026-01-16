"use client";

import StudentNavbar from "@/components/student-navbar";
import { getMySubjects, getSubject } from "@/services/student/student.service";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

function AllAttendancePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    (async () => {
      const subjects = await getMySubjects();
      const hubs = await Promise.all(
        subjects.map((s: any) => getSubject(s.teachingAssigmentId))
      );

      const flat = hubs.flatMap((hub: any) =>
        hub.activeAttendanceSessions.map((sess: any) => ({
          ...sess,
          subjectName: hub.subjectName,
          teacherName: hub.teacherName,
          classId: hub.classId,
        }))
      );

      setItems(flat);
    })()
      .catch((e: any) =>
        setError(e?.message ?? e?.error ?? "Gagal memuat attendance")
      )
      .finally(() => setLoading(false));
  }, []);

  const sessions = useMemo(() => {
    return items.sort(
      (a, b) => new Date(b.openAt).getTime() - new Date(a.openAt).getTime()
    );
  }, [items]);

  return (
    <div>
      <StudentNavbar />
      <div className="max-w-6xl mx-auto p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">All Attendance</h1>
            <p className="text-sm text-gray-600">
              Sesi absensi aktif dari seluruh subject
            </p>
          </div>
          <Link className="text-sm underline" href="/student">
            Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="border rounded-xl p-4 text-red-600">{error}</div>
        ) : sessions.length === 0 ? (
          <div className="border rounded-xl p-4">
            Tidak ada sesi absensi aktif.
          </div>
        ) : (
          <div className="border rounded-xl divide-y">
            {sessions.map((s: any) => (
              <div
                key={s.id}
                className="p-4 flex items-start justify-between gap-4"
              >
                <div>
                  <div className="font-medium">
                    {s.name ?? `Session #${s.id}`}
                  </div>
                  <div className="text-sm text-gray-600">
                    {s.subjectName} • {s.teacherName}
                  </div>
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
                      className="inline-block mt-2 text-sm underline"
                    >
                      Open
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllAttendancePage;
