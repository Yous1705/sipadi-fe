"use client";

import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useAdminAttendances } from "@/features/admin/attendance/use-admin-attendance";
import { AttendancesTable } from "@/features/admin/attendance/attendance-table";
import { EditAttendance } from "@/features/admin/attendance/edit-attendance";

function AdminAttendancePage() {
  const attendance = useAdminAttendances();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        subtitle="Review and update student attendance records."
      />

      {attendance.err ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {attendance.err}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AttendancesTable
            loading={attendance.loading}
            rows={attendance.filteredRows}
            selectedId={attendance.selectedId}
            onSelect={attendance.setSelectedId}
            classes={attendance.classes}
            subjects={attendance.subjects}
            teachers={attendance.teachers}
            classId={attendance.classId}
            setClassId={attendance.setClassId}
            subjectId={attendance.subjectId}
            setSubjectId={attendance.setSubjectId}
            teacherId={attendance.teacherId}
            setTeacherId={attendance.setTeacherId}
            status={attendance.status}
            setStatus={attendance.setStatus}
            q={attendance.q}
            setQ={attendance.setQ}
            onRefresh={attendance.refresh}
          />
        </div>

        <EditAttendance
          row={attendance.selectedRow}
          editStatus={attendance.editStatus}
          setEditStatus={attendance.setEditStatus}
          onSave={attendance.save}
          onCancel={() => attendance.setSelectedId(null)}
        />
      </div>
    </div>
  );
}

export default AdminAttendancePage;
