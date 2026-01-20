"use client";

import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useAdminUsers } from "@/features/admin/users/use-admin-users";
import { CreateStudent } from "@/features/admin/users/create-student";
import { CreateTeacher } from "@/features/admin/users/create-teacher";
import { UsersFilters } from "@/features/admin/users/users-filters";
import { UsersTable } from "@/features/admin/users/ussers-table";
import { ResetPassword } from "@/features/admin/users/reset-password";

function AdminUsersPage() {
  const u = useAdminUsers();

  return (
    <div className="space-y-6">
      <PageHeader title="Users" subtitle="Create users and manage accounts." />

      {u.error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {u.error}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <CreateStudent
          activeClasses={u.activeClasses}
          sName={u.sName}
          setSName={u.setSName}
          sEmail={u.sEmail}
          setSEmail={u.setSEmail}
          sPassword={u.sPassword}
          setSPassword={u.setSPassword}
          sClassId={u.sClassId}
          setSClassId={u.setSClassId}
          onSubmit={u.createStudent}
        />

        <CreateTeacher
          tName={u.tName}
          setTName={u.setTName}
          tEmail={u.tEmail}
          setTEmail={u.setTEmail}
          tPassword={u.tPassword}
          setTPassword={u.setTPassword}
          onSubmit={u.createTeacher}
        />
      </div>

      <UsersFilters
        role={u.role}
        setRole={u.setRole}
        isActive={u.isActive}
        setIsActive={u.setIsActive}
        q={u.q}
        setQ={u.setQ}
        onRefresh={u.refresh}
        onClearSearch={() => u.setQ("")}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UsersTable
            loading={u.loading}
            rows={u.filteredRows}
            totalRows={u.rows.length}
            onPickReset={(id) => u.setResetUserId(id)}
          />
        </div>

        <ResetPassword
          selectedUser={u.selectedResetUser}
          resetPassword={u.resetPassword}
          setResetPassword={u.setResetPassword}
          onCancel={() => {
            u.setResetUserId(null);
            u.setResetPassword("");
          }}
          onSubmit={u.resetPasswordAction}
        />
      </div>
    </div>
  );
}

export default AdminUsersPage;
