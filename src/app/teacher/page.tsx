"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  getHomeroomClass,
  getMyTeachings,
} from "@/services/teacher/teacher.service";
import type { HomeroomClassResponse, TeachingItem } from "@/types/teacher";
import TeacherNavbar from "@/components/teacher-navbar";

function pickErr(e: any) {
  return e?.message ?? e?.error ?? "Terjadi kesalahan";
}

export default function TeacherHomePage() {
  const [teachings, setTeachings] = useState<TeachingItem[]>([]);
  const [loadingTeachings, setLoadingTeachings] = useState(true);
  const [teachingsError, setTeachingsError] = useState<string | null>(null);

  const [homeroom, setHomeroom] = useState<HomeroomClassResponse | null>(null);
  const [loadingHomeroom, setLoadingHomeroom] = useState(true);

  useEffect(() => {
    setLoadingTeachings(true);
    setTeachingsError(null);

    getMyTeachings()
      .then(setTeachings)
      .catch((e) => setTeachingsError(pickErr(e)))
      .finally(() => setLoadingTeachings(false));
  }, []);

  useEffect(() => {
    setLoadingHomeroom(true);

    getHomeroomClass()
      .then((data) => setHomeroom(data))
      .catch(() => setHomeroom(null))
      .finally(() => setLoadingHomeroom(false));
  }, []);

  if (loadingTeachings) return <div className="p-6">Loading...</div>;

  if (teachingsError) {
    return (
      <div className="p-6 space-y-4">
        <div className="border border-red-200 bg-red-50 text-red-700 rounded p-4">
          {teachingsError}
        </div>
        <Link href="/" className="text-sm text-gray-600 hover:underline">
          ← Back
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <TeacherNavbar />
      <div>
        <h1 className="text-xl font-semibold">Teacher</h1>
        <p className="text-sm text-gray-500">
          Pilih teaching assignment untuk mengelola tugas & absensi.
        </p>
      </div>

      {!loadingHomeroom && homeroom ? (
        <div className="border rounded-lg p-4 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold">Homeroom Class</div>
              <div className="text-sm text-gray-600">
                {homeroom.className} (ID: {homeroom.classId})
              </div>
            </div>

            <Link
              href={`/teacher/homeroom/${homeroom.classId}`}
              className="border rounded px-3 py-2 text-sm hover:bg-gray-50"
            >
              View report
            </Link>
          </div>

          {!!homeroom.subjects?.length ? (
            <div className="text-xs text-gray-500">
              Subjects: {homeroom.subjects.map((s) => s.name).join(", ")}
            </div>
          ) : null}
        </div>
      ) : null}

      {!teachings.length ? (
        <div className="border rounded p-6 text-gray-600">
          Belum ada teaching assignment untuk akun teacher ini.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {teachings.map((t) => {
            const subjectName = t.subject?.name ?? `Subject #${t.subjectId}`;
            const className = t.class
              ? `${t.class.name} (${t.class.year})`
              : `Class #${t.classId}`;

            return (
              <Link
                key={t.id}
                href={`/teacher/teaching/${t.id}`}
                className="block border rounded-lg p-4 hover:bg-gray-50 transition"
              >
                <div className="font-semibold truncate">{subjectName}</div>
                <div className="text-sm text-gray-600">{className}</div>
                <div className="text-xs text-gray-400 mt-1">
                  Teaching ID: {t.id}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
