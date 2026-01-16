"use client";
import { getStudentClassDetail } from "@/services/student/student.service";
import { StudentClassDetail } from "@/types/student";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import StudentNavbar from "@/components/student-navbar";

export default function StudentClassDetailPage() {
  const { classId } = useParams<{ classId: string }>();
  const router = useRouter();

  const [data, setData] = useState<StudentClassDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStudentClassDetail(Number(classId))
      .then(setData)
      .catch(() => setError("Gagal memuat kelas"))
      .finally(() => setLoading(false));
  }, [classId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!data) return <div>Data tidak tersedia</div>;

  return (
    <div>
      <StudentNavbar />
      <div className="p-6 space-y-8">
        <h1 className="text-2xl font-semibold">Class Detail</h1>

        {data.subjects.map((subject) => (
          <div
            key={subject.teachingAssignmentId}
            className="border rounded-xl p-5 space-y-4"
          >
            {/* SUBJECT HEADER */}
            <div>
              <h2 className="text-lg font-semibold">{subject.subjectName}</h2>
              <p className="text-sm text-gray-600">
                Teacher: {subject.teacherName}
              </p>
            </div>

            {/* ASSIGNMENTS */}
            <div className="space-y-2">
              <h3 className="font-medium">Assignments</h3>

              {subject.assignments.length === 0 && (
                <p className="text-sm text-gray-500">Tidak ada tugas</p>
              )}

              {subject.assignments.map((a) => (
                <div
                  key={a.id}
                  className="flex justify-between items-center border rounded p-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => router.push(`/student/assignments/${a.id}`)}
                >
                  <div>
                    <p className="font-medium">{a.title}</p>
                    <p className="text-sm text-gray-500">
                      Due: {new Date(a.dueDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right">
                    {a.status === "SUBMITTED" ? (
                      <div className="text-green-600">
                        Submitted
                        {a.score !== null && (
                          <p className="text-sm">Score: {a.score}</p>
                        )}
                      </div>
                    ) : (
                      <span className="text-yellow-600">Not Submitted</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ATTENDANCE */}
            <div className="space-y-2">
              <h3 className="font-medium">Attendance Sessions</h3>

              {subject.attendanceSessions.length === 0 && (
                <p className="text-sm text-gray-500">Tidak ada sesi aktif</p>
              )}

              {subject.attendanceSessions.map((s) => (
                <div
                  key={s.id}
                  className="flex justify-between items-center border rounded p-3"
                >
                  <div>
                    <p className="font-medium">
                      {s.name ?? "Attendance Session"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(s.openAt).toLocaleString()} –{" "}
                      {new Date(s.closeAt).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    {s.isAttended ? (
                      <span className="text-green-600 font-medium">
                        Sudah Absen
                      </span>
                    ) : s.isActive ? (
                      <button
                        onClick={() =>
                          router.push(`/student/attendance/${s.id}`)
                        }
                        className="px-3 py-1 bg-blue-600 text-white rounded"
                      >
                        Absen
                      </button>
                    ) : (
                      <span className="text-gray-500">Ditutup</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
