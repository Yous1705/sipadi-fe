"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import TeacherNavbar from "@/components/teacher-navbar";

export default function TeachingHubPage() {
  const params = useParams();
  const teachingAssigmentId = Number(params.teachingAssigmentId);

  if (!teachingAssigmentId) return <div className="p-6">Invalid ID</div>;

  return (
    <div className="p-6 space-y-4">
      <TeacherNavbar />
      <div>
        <h1 className="text-xl font-semibold">Teaching</h1>
        <p className="text-sm text-gray-500">
          Teaching ID: {teachingAssigmentId}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href={`/teacher/teaching/${teachingAssigmentId}/assignments`}
          className="border rounded-lg p-4 hover:bg-gray-50 transition"
        >
          <div className="font-semibold">Assignments</div>
          <div className="text-sm text-gray-600">
            Buat, publish, close, dan lihat submission siswa.
          </div>
        </Link>

        <Link
          href={`/teacher/teaching/${teachingAssigmentId}/attendance`}
          className="border rounded-lg p-4 hover:bg-gray-50 transition"
        >
          <div className="font-semibold">Attendance</div>
          <div className="text-sm text-gray-600">
            Buka sesi absensi, lihat progress, dan input attendance.
          </div>
        </Link>

        <Link
          href={`/teacher/teaching/${teachingAssigmentId}/grade-report`}
          className="border rounded-lg p-4 hover:bg-gray-50 transition"
        >
          <div className="font-semibold">Grade Report</div>
          <div className="text-sm text-gray-600">
            Rekap nilai dari semua tugas yang kamu berikan di kelas ini.
          </div>
        </Link>
      </div>

      <div>
        <Link href="/teacher" className="text-sm text-gray-600 hover:underline">
          ← Kembali ke Teaching List
        </Link>
      </div>
    </div>
  );
}
