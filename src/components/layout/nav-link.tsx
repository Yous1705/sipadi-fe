"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export function NavLink({
  href,
  label,
  exact = false,
}: {
  href: string;
  label: string;
  exact?: boolean;
}) {
  const pathname = usePathname();

  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={[
        "px-3 py-2 rounded-lg text-sm font-medium transition border",
        isActive
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}
