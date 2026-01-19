"use client";

import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useAdminClasses } from "@/features/admin/classes/use-admin-classes";
import { CreateClasses } from "@/features/admin/classes/create-classes";
import { ClassesTable } from "@/features/admin/classes/classes-table";
import { ClassesDetail } from "@/features/admin/classes/classes-detail";

export default function AdminClassesPage() {
  const c = useAdminClasses();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Classes"
        subtitle="Manage classes, homeroom teacher, and students."
      />

      {c.err ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {c.err}
        </div>
      ) : null}

      <CreateClasses
        createName={c.createName}
        setCreateName={c.setCreateName}
        createYear={c.createYear}
        setCreateYear={c.setCreateYear}
        onSubmit={c.createClass}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ClassesTable
            loading={c.loading}
            rows={c.filteredRows}
            selectedId={c.selectedClassId}
            onSelect={c.setSelectedClassId}
            onEdit={(row) => c.startEdit(row)}
            onDelete={(id) => c.deleteClass(id)}
            q={c.q}
            setQ={c.setQ}
            activeOnly={c.activeOnly}
            setActiveOnly={c.setActiveOnly}
            onRefresh={c.refreshClassesOnly}
          />
        </div>

        <ClassesDetail
          selectedClass={c.selectedClass}
          teachers={c.teachers}
          selectedTeacherId={c.selectedTeacherId}
          setSelectedTeacherId={c.setSelectedTeacherId}
          onAssignHomeroom={c.assignHomeroomTeacher}
          editingRow={c.editingRow}
          editName={c.editName}
          setEditName={c.setEditName}
          editYear={c.editYear}
          setEditYear={c.setEditYear}
          editActive={c.editActive}
          setEditActive={c.setEditActive}
          onSaveEdit={c.updateClass}
          onCancelEdit={c.cancelEdit}
          studentsLoading={c.studentsLoading}
          studentsErr={c.studentsErr}
          students={c.studentsOnly}
          activeClasses={c.activeClasses}
          moveMap={c.moveMap}
          setMoveMap={c.setMoveMap}
          onMoveStudent={c.moveStudent}
          onRemoveStudent={c.removeStudent}
        />
      </div>
    </div>
  );
}
