"use client";
import {
  getHomeroomClass,
  getMyTeachings,
  Teaching,
} from "@/services/teacher/teacher-teaching.service";
import { HomeroomClass } from "@/types/report";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function TeacherDashboardPage() {
  const [teachings, setTeachings] = useState<Teaching[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [homeroom, setHomeroom] = useState<HomeroomClass | null>(null);

  useEffect(() => {
    Promise.all([getMyTeachings(), getHomeroomClass()])
      .then(([teachings, homeroom]) => {
        setTeachings(teachings);
        setHomeroom(homeroom);
      })
      .catch(() => setError("Gagal memuat dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Teacher Dashboard</h1>

      {/* ========== HOMEROOM SECTION ========== */}
      {homeroom && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Homeroom Class</h2>

          <div className="border rounded p-4 space-y-2 bg-blue-50">
            <p className="text-lg font-medium">{homeroom.className}</p>

            <div className="flex flex-wrap gap-2 text-sm text-gray-700">
              {homeroom.subjects.map((s) => (
                <span
                  key={s.subjectId}
                  className="px-2 py-1 bg-white border rounded"
                >
                  {s.subjectName}
                </span>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href={`/teacher/classes/${homeroom.classId}/report`}
                className="text-sm text-blue-600 hover:underline"
              >
                View Class Detail
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ========== TEACHING SECTION ========== */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">My Teachings</h2>

        <div className="grid grid-cols-2 gap-4">
          {teachings.map((t) => (
            <TeachingCard key={t.id} teaching={t} />
          ))}
        </div>
      </section>
    </div>
  );

  function TeachingCard({ teaching }: { teaching: Teaching }) {
    return (
      <div className="border rounded p-4 space-y-2">
        <div>
          <p className="text-lg font-medium">{teaching.class.name}</p>
          <p className="text-sm text-gray-600">{teaching.subject.name}</p>
        </div>

        <div className="flex gap-3 pt-2">
          <Link
            href={`/teacher/teaching/${teaching.id}/assignments`}
            className="text-sm text-blue-600 hover:underline"
          >
            Assignments
          </Link>

          <Link
            href={`/teacher/teaching/${teaching.id}/attendance`}
            className="text-sm text-blue-600 hover:underline"
          >
            Attendance
          </Link>
        </div>
      </div>
    );
  }
}

export default TeacherDashboardPage;
