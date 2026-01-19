"use client";

import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useAdminAttendances } from "@/features/admin/attendance/use-admin-attendance";
import { AttendancesTable } from "@/features/admin/attendance/attendance-table";
import { EditAttendance } from "@/features/admin/attendance/edit-attendance";

export default function AdminAttendancePage() {
  const a = useAdminAttendances();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        subtitle="Review and update student attendance records."
      />

      {a.err ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {a.err}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AttendancesTable
            loading={a.loading}
            rows={a.filteredRows}
            selectedId={a.selectedId}
            onSelect={a.setSelectedId}
            classes={a.classes}
            subjects={a.subjects}
            teachers={a.teachers}
            classId={a.classId}
            setClassId={a.setClassId}
            subjectId={a.subjectId}
            setSubjectId={a.setSubjectId}
            teacherId={a.teacherId}
            setTeacherId={a.setTeacherId}
            status={a.status}
            setStatus={a.setStatus}
            q={a.q}
            setQ={a.setQ}
            onRefresh={a.refresh}
          />
        </div>

        <EditAttendance
          row={a.selectedRow}
          editStatus={a.editStatus}
          setEditStatus={a.setEditStatus}
          onSave={a.save}
          onCancel={() => a.setSelectedId(null)}
        />
      </div>
    </div>
  );
}
