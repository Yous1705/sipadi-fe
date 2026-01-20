"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { NavLink } from "@/components/layout/nav-link";
import { token } from "@/lib/token";

export default function AdminNavbar() {
  const router = useRouter();

  function handleLogout() {
    token.clear();
    router.push("../auth/login");
    router.refresh();
  }

  return (
    <div className="bg-slate-50">
      <Topbar
        title="SIPADI Admin"
        left={
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-slate-500">
              Manage users, classes, subjects, and reports
            </span>
          </div>
        }
        right={
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-slate-600 hover:text-red-600
                       px-3 py-1.5 rounded-xl hover:bg-red-50 transition"
          >
            Logout
          </button>
        }
      />

      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-2">
          <NavLink href="/admin/dashboard" label="Dashboard" exact />
          <NavLink href="/admin/users" label="Users" />
          <NavLink href="/admin/classes" label="Classes" />
          <NavLink href="/admin/subjects" label="Subjects" />
          <NavLink href="/admin/teaching-assignments" label="Teaching" />
          <NavLink href="/admin/attendances" label="Attendance" />
          <NavLink href="/admin/reports" label="Reports" />
        </div>
      </div>
    </div>
  );
}
