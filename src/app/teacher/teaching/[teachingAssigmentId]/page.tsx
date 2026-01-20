"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function HubCard({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-slate-200 bg-white p-4 hover:bg-slate-50 transition"
    >
      <div className="font-semibold text-slate-900">{title}</div>
      <div className="text-sm text-slate-600 mt-1">{desc}</div>
      <div className="text-xs text-slate-400 mt-3">Open →</div>
    </Link>
  );
}

function TeachingPage() {
  const params = useParams();
  const teachingAssigmentId = Number(params.teachingAssigmentId);

  if (!teachingAssigmentId)
    return <div className="text-sm text-slate-500">Invalid ID</div>;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Teaching"
        subtitle={`Teaching ID: ${teachingAssigmentId}`}
        right={
          <Link href="/teacher">
            <Button>Back</Button>
          </Link>
        }
      />

      <Card title="Quick actions" description="Choose what you want to manage.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <HubCard
            title="Assignments"
            desc="Buat, publish, close, dan lihat submission siswa."
            href={`/teacher/teaching/${teachingAssigmentId}/assignments`}
          />
          <HubCard
            title="Attendance"
            desc="Buka sesi absensi, lihat progress, dan input attendance."
            href={`/teacher/teaching/${teachingAssigmentId}/attendance`}
          />
          <HubCard
            title="Grade Report"
            desc="Rekap nilai dari semua tugas di kelas ini."
            href={`/teacher/teaching/${teachingAssigmentId}/grade-report`}
          />
        </div>
      </Card>
    </div>
  );
}

export default TeachingPage;
