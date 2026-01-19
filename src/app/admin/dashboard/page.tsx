"use client";

import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { useAdminDashboard } from "@/features/admin/dashboard/use-admin-dashboard";
import { Grid } from "@/features/admin/dashboard/grid";
import { Highlights } from "@/features/admin/dashboard/highlights";

export default function AdminDashboardPage() {
  const d = useAdminDashboard();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of SIPADI system status."
        right={
          <Button variant="ghost" onClick={d.refresh}>
            Refresh
          </Button>
        }
      />

      {d.err ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {d.err}
        </div>
      ) : null}

      {d.loading ? (
        <div className="text-sm text-slate-500">Loading dashboard...</div>
      ) : d.data ? (
        <>
          <Grid data={d.data} />
          <Highlights data={d.data} />
        </>
      ) : (
        <div className="text-sm text-slate-500">No data.</div>
      )}
    </div>
  );
}
