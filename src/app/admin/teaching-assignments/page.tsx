"use client";

import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useAdminTeaching } from "@/features/admin/teaching/use-admin-teaching";
import { TeachingAssign } from "@/features/admin/teaching/teaching-assign";
import { TeachingTable } from "@/features/admin/teaching/teaching-table";
import { TeachingDetailPanel } from "@/features/admin/teaching/teaching-detail-panel";

export default function AdminTeachingPage() {
  const t = useAdminTeaching();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teaching"
        subtitle="Assign and unassign teacher-class-subject mappings."
      />

      {t.err ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {t.err}
        </div>
      ) : null}

      <TeachingAssign
        teachers={t.teachers}
        classes={t.classes}
        subjects={t.subjects}
        cTeacherId={t.cTeacherId}
        setCTeacherId={t.setCTeacherId}
        cClassId={t.cClassId}
        setCClassId={t.setCClassId}
        cSubjectId={t.cSubjectId}
        setCSubjectId={t.setCSubjectId}
        onSubmit={t.assignTeaching}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TeachingTable
            loading={t.loading}
            rows={t.filteredRows}
            selectedId={t.selectedId}
            onSelect={t.setSelectedId}
            onUnassign={t.unassignTeaching}
            teachers={t.teachers}
            classes={t.classes}
            subjects={t.subjects}
            q={t.q}
            setQ={t.setQ}
            teacherId={t.teacherId}
            setTeacherId={t.setTeacherId}
            classId={t.classId}
            setClassId={t.setClassId}
            subjectId={t.subjectId}
            setSubjectId={t.setSubjectId}
            onRefresh={t.refreshTeaching}
          />
        </div>

        <TeachingDetailPanel row={t.selectedRow} />
      </div>
    </div>
  );
}
