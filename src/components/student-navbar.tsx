"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function StudentNavbar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `px-3 py-2 rounded text-sm ${
      pathname.startsWith(path)
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <nav className="flex gap-2 border-b px-6 py-3">
      <Link href="/student" className={linkClass("/student")}>
        Dashboard
      </Link>

      <Link
        href="/student/assignments"
        className={linkClass("/student/assignments")}
      >
        Assignments
      </Link>

      <Link
        href="/student/attendance"
        className={linkClass("/student/attendance")}
      >
        Attendance
      </Link>
    </nav>
  );
}
