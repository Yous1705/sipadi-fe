import AdminNavbar from "@/components/admin-navbar";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <AdminNavbar />
      <main className="p-6 max-w-6xl mx-auto">{children}</main>
    </div>
  );
}
