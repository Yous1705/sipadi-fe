import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import AdminNavbar from "@/components/layout/admin-navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell navbar={<AdminNavbar />}>{children}</AppShell>;
}
