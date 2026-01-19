"use client";

import React, { useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useAdminSubjects } from "@/features/admin/subjects/use-admin-subjects";
import { CreateSubjects } from "@/features/admin/subjects/create-subjects";
import { SubjectsTable } from "@/features/admin/subjects/subjects-table";
import { EditSubjects } from "@/features/admin/subjects/edit-subjects";

export default function AdminSubjectsPage() {
  const s = useAdminSubjects();

  useEffect(() => {
    if (!s.editingRow) return;
    s.setEditName(s.editingRow.name ?? "");
  }, [s.editingRow?.id]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subjects"
        subtitle="Manage subjects for teaching assignments."
      />

      {s.err ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {s.err}
        </div>
      ) : null}

      <CreateSubjects
        createName={s.createName}
        setCreateName={s.setCreateName}
        onSubmit={s.createSubject}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SubjectsTable
            loading={s.loading}
            rows={s.filteredRows}
            q={s.q}
            setQ={s.setQ}
            activeOnly={s.activeOnly}
            setActiveOnly={s.setActiveOnly}
            onEdit={(row) => s.startEdit(row)}
            onDelete={(id) => s.deleteSubject(id)}
            onRefresh={s.refresh}
          />
        </div>

        <EditSubjects
          editingRow={s.editingRow}
          editName={s.editName}
          setEditName={s.setEditName}
          editActive={s.editActive}
          setEditActive={s.setEditActive}
          onSave={s.updateSubject}
          onCancel={s.cancelEdit}
        />
      </div>
    </div>
  );
}
