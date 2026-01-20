"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  getHomeroomClass,
  getMyTeachings,
} from "@/services/teacher/teacher.service";
import type { HomeroomClassResponse, TeachingItem } from "@/types/teacher";

import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function pickErr(e: any) {
  return e?.message ?? e?.error ?? "Terjadi kesalahan";
}

function TeachingCard({ t }: { t: TeachingItem }) {
  const subjectName = t.subject?.name ?? `Subject #${t.subjectId}`;
  const className = t.class
    ? `${t.class.name} (${t.class.year})`
    : `Class #${t.classId}`;

  return (
    <Link
      href={`/teacher/teaching/${t.id}`}
      className="block rounded-xl border border-slate-200 bg-white p-4 hover:bg-slate-50 transition"
    >
      <div className="font-semibold text-slate-900 truncate">{subjectName}</div>
      <div className="text-sm text-slate-600">{className}</div>
      <div className="text-xs text-slate-400 mt-1">Teaching ID: {t.id}</div>
    </Link>
  );
}

function TeacherHomePage() {
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

  if (loadingTeachings) {
    return <div className="text-sm text-slate-500">Loading...</div>;
  }

  if (teachingsError) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
          {teachingsError}
        </div>
        <Link href="/" className="text-sm text-slate-600 hover:underline">
          ← Back
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teacher Dashboard"
        subtitle="Pilih teaching assignment untuk mengelola tugas & absensi."
        right={
          <Link href="/">
            <Button>Back</Button>
          </Link>
        }
      />

      {/* Homeroom */}
      {!loadingHomeroom && homeroom ? (
        <Card
          title="Homeroom Class"
          description={`${homeroom.className} (ID: ${homeroom.classId})`}
          action={
            <Link href={`/teacher/homeroom/${homeroom.classId}`}>
              <Button variant="primary">View report</Button>
            </Link>
          }
        >
          {!!homeroom.subjects?.length ? (
            <div className="text-sm text-slate-600">
              <span className="text-slate-500">Subjects: </span>
              {homeroom.subjects.map((s) => s.name).join(", ")}
            </div>
          ) : (
            <div className="text-sm text-slate-500">No subjects.</div>
          )}
        </Card>
      ) : null}

      {/* Teachings */}
      <Card
        title="My Teachings"
        description={
          teachings.length
            ? "Select one to continue."
            : "No teaching assignment found."
        }
      >
        {!teachings.length ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
            Belum ada teaching assignment untuk akun teacher ini.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {teachings.map((t) => (
              <TeachingCard key={t.id} t={t} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export default TeacherHomePage;
