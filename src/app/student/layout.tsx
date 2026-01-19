import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import StudentNavbar from "@/components/layout/student-navbar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell navbar={<StudentNavbar />}>{children}</AppShell>;
}
