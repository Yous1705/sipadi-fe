"use client";

import { getAssignmentsByTeaching } from "@/services/student/student.service";
import { StudentAssignment } from "@/types/student";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TeachingAssignmentsPage() {
  const { teachingAssignmentId } = useParams<{
    teachingAssignmentId: string;
  }>();

  const [data, setData] = useState<StudentAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teachingAssignmentId) return;

    setLoading(true);
    setError(null);

    getAssignmentsByTeaching(Number(teachingAssignmentId))
      .then(setData)
      .catch(() => setError("Gagal memuat assignments"))
      .finally(() => setLoading(false));
  }, [teachingAssignmentId]);

  if (loading) return <div className="p-6">Loading...</div>;

  if (error) return <div className="p-6 text-red-600">{error}</div>;

  if (data.length === 0) return <div className="p-6">Belum ada assignment</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Assignments</h1>

      <div className="space-y-3">
        {data.map((a) => {
          const submission = a.submissions?.[0];
          const isSubmitted = !!submission;

          return (
            <div
              key={a.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{a.title}</p>
                <p className="text-sm text-gray-600">
                  Due: {new Date(a.dueDate).toLocaleString()}
                </p>

                {isSubmitted && (
                  <p className="text-sm text-green-600">
                    Submitted
                    {submission.score !== null &&
                      ` • Score: ${submission.score}`}
                  </p>
                )}
              </div>

              <Link
                href={`/student/assignments/${a.id}`}
                className="text-blue-600 hover:underline text-sm"
              >
                Detail
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
