"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function StudentNavbar() {
  const pathname = usePathname();

  const items = [
    { href: "/student", label: "Dashboard" },
    { href: "/student/classes", label: "Classes" },
  ];

  return (
    <div className="border-b bg-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="font-semibold">SIPADI • Student</div>

        <nav className="flex gap-2">
          {items.map((it) => {
            const active = pathname === it.href;
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`px-3 py-1.5 rounded-lg text-sm border ${
                  active ? "bg-black text-white" : "bg-white"
                }`}
              >
                {it.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
