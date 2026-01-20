"use client";

import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useAdminClasses } from "@/features/admin/classes/use-admin-classes";
import { CreateClasses } from "@/features/admin/classes/create-classes";
import { ClassesTable } from "@/features/admin/classes/classes-table";
import { ClassesDetail } from "@/features/admin/classes/classes-detail";

function AdminClassesPage() {
  const classes = useAdminClasses();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Classes"
        subtitle="Manage classes, homeroom teacher, and students."
      />

      {classes.err ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {classes.err}
        </div>
      ) : null}

      <CreateClasses
        createName={classes.createName}
        setCreateName={classes.setCreateName}
        createYear={classes.createYear}
        setCreateYear={classes.setCreateYear}
        onSubmit={classes.createClass}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ClassesTable
            loading={classes.loading}
            rows={classes.filteredRows}
            selectedId={classes.selectedClassId}
            onSelect={classes.setSelectedClassId}
            onEdit={(row) => classes.startEdit(row)}
            onDelete={(id) => classes.deleteClass(id)}
            q={classes.q}
            setQ={classes.setQ}
            activeOnly={classes.activeOnly}
            setActiveOnly={classes.setActiveOnly}
            onRefresh={classes.refreshClassesOnly}
          />
        </div>

        <ClassesDetail
          selectedClass={classes.selectedClass}
          teachers={classes.teachers}
          selectedTeacherId={classes.selectedTeacherId}
          setSelectedTeacherId={classes.setSelectedTeacherId}
          onAssignHomeroom={classes.assignHomeroomTeacher}
          editingRow={classes.editingRow}
          editName={classes.editName}
          setEditName={classes.setEditName}
          editYear={classes.editYear}
          setEditYear={classes.setEditYear}
          editActive={classes.editActive}
          setEditActive={classes.setEditActive}
          onSaveEdit={classes.updateClass}
          onCancelEdit={classes.cancelEdit}
          studentsLoading={classes.studentsLoading}
          studentsErr={classes.studentsErr}
          students={classes.studentsOnly}
          activeClasses={classes.activeClasses}
          moveMap={classes.moveMap}
          setMoveMap={classes.setMoveMap}
          onMoveStudent={classes.moveStudent}
          onRemoveStudent={classes.removeStudent}
        />
      </div>
    </div>
  );
}

export default AdminClassesPage;
