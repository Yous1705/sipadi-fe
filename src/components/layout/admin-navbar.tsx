"use client";

import React from "react";
import { Topbar } from "@/components/layout/topbar";
import { NavLink } from "@/components/layout/nav-link";

export default function AdminNavbar() {
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
