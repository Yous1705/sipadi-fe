"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAttendanceSession } from "@/features/teacher/attendance/use-Attendance-session";
import { AttendanceTools } from "@/features/teacher/attendance/attendance-tools";
import { AttendanceTable } from "@/features/teacher/attendance/attendance-table";
import { SessionHeader } from "@/features/teacher/attendance/session-header";

export default function AttendanceSessionDetailPage() {
  const params = useParams();
  const router = useRouter();

  const teachingAssigmentId = Number(params.teachingAssigmentId);
  const sessionId = Number(params.sessionId);

  const session = useAttendanceSession(sessionId);

  useEffect(() => {
    if (!sessionId) return;
    session.load();
  }, [sessionId]);

  if (!teachingAssigmentId || !sessionId) {
    return <div className="text-sm text-slate-500">Invalid params</div>;
  }

  if (session.loading)
    return <div className="text-sm text-slate-500">Loading...</div>;

  if (session.pageError) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
          {session.pageError}
        </div>
        <Link
          href={`/teacher/teaching/${teachingAssigmentId}/attendance`}
          className="text-sm text-slate-600 hover:underline"
        >
          ← Back
        </Link>
      </div>
    );
  }

  if (!session.detail) {
    return (
      <Card title="Not found" description="Session tidak ditemukan.">
        <Link
          href={`/teacher/teaching/${teachingAssigmentId}/attendance`}
          className="text-sm text-slate-600 hover:underline"
        >
          ← Back
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <SessionHeader
        title={session.headerTitle}
        detail={session.detail}
        teachingAssigmentId={teachingAssigmentId}
        bulkLoading={session.bulkLoading}
        onBulkSave={session.onBulkSave}
        onCloseSession={session.onCloseSession}
        onDeleteSession={async () => {
          await session.onDeleteSession();
          router.push(`/teacher/teaching/${teachingAssigmentId}/attendance`);
          router.refresh();
        }}
        onBack={() =>
          router.push(`/teacher/teaching/${teachingAssigmentId}/attendance`)
        }
      />

      <Card
        title="Overview"
        description={`Active: ${String(session.detail.isActive)} • Attended: ${session.detail.stats.attended}/${session.detail.stats.totalStudents}`}
        action={<Button onClick={session.load}>Refresh</Button>}
      >
        <div className="text-sm text-slate-600">
          Tips: gunakan <b>Bulk set</b> untuk mempercepat, lalu klik{" "}
          <b>Bulk Save</b>.
        </div>
      </Card>

      {session.bulkError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
          {session.bulkError}
        </div>
      ) : null}

      <AttendanceTools
        q={session.q}
        onQ={session.setQ}
        filter={session.filter}
        onFilter={session.setFilter}
        bulkSet={session.bulkSet}
        onBulkSet={session.setBulkSet}
        onApply={session.applyBulkSet}
        shown={session.filteredStudents.length}
        total={session.detail.students.length}
      />

      <AttendanceTable
        rows={session.filteredStudents}
        drafts={session.drafts}
        bulkLoading={session.bulkLoading}
        onDraft={session.updateDraft}
        onSaveRow={session.onSaveRow}
      />
    </div>
  );
}
