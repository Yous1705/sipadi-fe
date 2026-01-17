"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AttendanceSessionProgress } from "@/types/teacher";
import { getAttendanceSessionsProgress } from "@/services/teacher/teacher.service";
import TeacherNavbar from "@/components/teacher-navbar";

export default function TeacherAttendanceSessionsPage() {
  const params = useParams();
  const teachingAssigmentId = Number(params.teachingAssigmentId);

  const [items, setItems] = useState<AttendanceSessionProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teachingAssigmentId) return;

    setLoading(true);
    setError(null);

    getAttendanceSessionsProgress(teachingAssigmentId)
      .then(setItems)
      .catch((e) => {
        const msg =
          e?.message ?? e?.error ?? "Gagal memuat attendance sessions";
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [teachingAssigmentId]);

  if (loading) return <div className="p-6">Loading...</div>;

  if (error) {
    return (
      <div className="p-6 space-y-4">
        <TeacherNavbar />
        <div className="border border-red-200 bg-red-50 text-red-700 rounded p-4">
          {error}
        </div>
        <Link
          href={`/teacher/teaching/${teachingAssigmentId}`}
          className="text-sm text-gray-600 hover:underline"
        >
          ← Kembali
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Attendance Sessions</h1>
          <p className="text-sm text-gray-500">
            Teaching ID: {teachingAssigmentId}
          </p>
        </div>

        <Link
          href={`/teacher/teaching/${teachingAssigmentId}/attendance/open`}
          className="border rounded px-3 py-2 text-sm hover:bg-gray-50"
        >
          + Open Session
        </Link>
      </div>

      {!items.length ? (
        <div className="border rounded p-6 text-gray-600">
          Belum ada attendance session untuk teaching ini.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((s) => (
            <Link
              key={s.id}
              href={`/teacher/teaching/${teachingAssigmentId}/attendance/${s.id}`}
              className="block border rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <div className="flex justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold truncate">
                    {s.name ?? `Session ${s.id}`}
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(s.openAt).toLocaleString()} -{" "}
                    {new Date(s.closeAt).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    Progress: {s.progress}
                  </div>
                </div>

                <div
                  className={`text-xs px-2 py-1 rounded h-fit ${
                    s.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {s.isActive ? "ACTIVE" : "CLOSED"}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div>
        <Link
          href={`/teacher/teaching/${teachingAssigmentId}`}
          className="text-sm text-gray-600 hover:underline"
        >
          ← Kembali ke Teaching
        </Link>
      </div>
    </div>
  );
}
