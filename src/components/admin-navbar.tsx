"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/classes", label: "Classes" },
  { href: "/admin/subjects", label: "Subjects" },
  { href: "/admin/teaching-assignments", label: "Teaching" },
  { href: "/admin/attendances", label: "Attendances" },
];

export default function AdminNavbar() {
  const pathname = usePathname();

  return (
    <div className="border-b bg-white">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-3">
        <Link href="/admin/dashboard" className="font-semibold">
          SIPADI Admin
        </Link>

        <div className="flex gap-2 flex-wrap">
          {links.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={[
                  "px-3 py-1 rounded-md border text-sm",
                  active ? "bg-black text-white" : "hover:bg-gray-50",
                ].join(" ")}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
