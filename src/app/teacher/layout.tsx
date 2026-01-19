import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import TeacherNavbar from "@/components/layout/teacher-navbar";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell navbar={<TeacherNavbar />}>{children}</AppShell>;
}
