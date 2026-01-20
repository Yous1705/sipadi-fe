"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { token } from "@/lib/token";

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

function NavItem({
  href,
  label,
  activeWhen,
}: {
  href: string;
  label: string;
  activeWhen: (p: string) => boolean;
}) {
  const pathname = usePathname();
  const active = activeWhen(pathname);

  return (
    <Link
      href={href}
      className={cx(
        "px-3 py-2 rounded-md text-sm font-medium transition",
        active
          ? "bg-blue-50 text-blue-700"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
      )}
    >
      {label}
    </Link>
  );
}

export default function StudentNavbar() {
  const router = useRouter();

  function handleLogout() {
    token.clear();
    router.push("auth/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 border-b bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/student/dashboard"
              className="font-semibold text-slate-900"
            >
              SIPADI
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <NavItem
                href="/student/dashboard"
                label="Dashboard"
                activeWhen={(p) => p === "/student/dashboard"}
              />
              <NavItem
                href="/student/assignments"
                label="Assignments"
                activeWhen={(p) => p.startsWith("/student/assignments")}
              />
              <NavItem
                href="/student/attendance"
                label="Attendance"
                activeWhen={(p) => p.startsWith("/student/attendance")}
              />
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-500 hidden sm:block">
              Student
            </div>

            <button
              onClick={handleLogout}
              className="text-sm font-medium text-slate-600 hover:text-red-600
                         px-3 py-1.5 rounded-md hover:bg-red-50 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
