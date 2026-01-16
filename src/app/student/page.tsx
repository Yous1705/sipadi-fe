"use client";

import StudentNavbar from "@/components/student-navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getMySubjects,
  getStudentDashboard,
} from "@/services/student/student.service";
import { Subject } from "@/types/student";

function StudentDashboardPage() {
  const [stats, setStats] = useState<{
    assignments: number;
    attendanceSession: number;
  } | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getStudentDashboard(), getMySubjects()])
      .then(([d, s]) => {
        setStats(d);
        setSubjects(s);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <StudentNavbar />
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-sm text-gray-600">
              Pilih subject untuk lihat tugas & absensi.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              className="px-3 py-2 rounded-lg border text-sm"
              href="/student/assignments"
            >
              All Assignments
            </Link>
            <Link
              className="px-3 py-2 rounded-lg border text-sm"
              href="/student/attendance"
            >
              All Attendance
            </Link>
          </div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DashboardCard
                  title="Total Assignments"
                  value={stats.assignments}
                />
                <DashboardCard
                  title="Active Attendance Sessions"
                  value={stats.attendanceSession}
                />
              </div>
            )}

            <section className="space-y-3">
              <h2 className="text-lg font-semibold">My Subjects</h2>

              {subjects.length === 0 ? (
                <div className="border rounded-xl p-4">Belum ada subject.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subjects.map((s) => (
                    <div
                      key={s.teachingAssigmentId}
                      className="border rounded-xl p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold">{s.subjectName}</div>
                          <div className="text-sm text-gray-600">
                            {s.teacherName}
                          </div>
                        </div>

                        <Link
                          href={`/student/subjects/${s.teachingAssigmentId}`}
                          className="px-3 py-2 rounded-lg bg-black text-white text-sm"
                        >
                          Open
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function DashboardCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-xl border p-6 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

export default StudentDashboardPage;
