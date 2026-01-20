"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getHomeroomClass } from "@/services/teacher/teacher.service";
import type { HomeroomClassResponse } from "@/types/teacher";
import { token } from "@/lib/token";

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

function NavLink({
  href,
  label,
  activeWhen,
}: {
  href: string;
  label: string;
  activeWhen: (pathname: string) => boolean;
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

export default function TeacherNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [homeroom, setHomeroom] = useState<HomeroomClassResponse | null>(null);

  useEffect(() => {
    getHomeroomClass()
      .then((d) => setHomeroom(d))
      .catch(() => setHomeroom(null));
  }, []);

  function handleLogout() {
    token.clear();
    router.push("../auth/login");
    router.refresh();
  }

  const DASHBOARD_HREF = "/teacher/dashboard";

  const homeroomHref = homeroom
    ? `/teacher/homeroom/${homeroom.classId}`
    : null;

  return (
    <header className="sticky top-0 z-30 border-b bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={DASHBOARD_HREF}
              className="font-semibold text-slate-900"
            >
              SIPADI
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <NavLink
                href={DASHBOARD_HREF}
                label="Dashboard"
                activeWhen={(p) =>
                  p === "/teacher" || p.startsWith("/teacher/dashboard")
                }
              />

              <NavLink
                href={DASHBOARD_HREF}
                label="Teachings"
                activeWhen={(p) => p.startsWith("/teacher/teaching")}
              />

              {homeroomHref ? (
                <NavLink
                  href={homeroomHref}
                  label="Homeroom"
                  activeWhen={(p) => p.startsWith("/teacher/homeroom")}
                />
              ) : null}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-500 hidden sm:block">
              {pathname.startsWith("/teacher/teaching")
                ? "Teaching"
                : "Teacher"}
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
