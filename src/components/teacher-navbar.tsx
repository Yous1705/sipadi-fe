"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getHomeroomClass } from "@/services/teacher/teacher.service";
import { HomeroomClassResponse } from "@/types/teacher";

function isActive(pathname: string, href: string) {
  if (href === "/teacher") return pathname === "/teacher";
  return pathname.startsWith(href);
}

export default function TeacherNavbar() {
  const pathname = usePathname();

  const [homeroom, setHomeroom] = useState<HomeroomClassResponse | null>(null);
  const [loadingHomeroom, setLoadingHomeroom] = useState(true);

  useEffect(() => {
    setLoadingHomeroom(true);
    getHomeroomClass()
      .then(setHomeroom)
      .catch(() => setHomeroom(null))
      .finally(() => setLoadingHomeroom(false));
  }, []);

  const currentTeachingId = useMemo(() => {
    const m = pathname.match(/^\/teacher\/teaching\/(\d+)/);
    return m ? Number(m[1]) : null;
  }, [pathname]);

  return (
    <div className="sticky top-0 z-20 bg-white border-b">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/teacher" className="font-semibold truncate">
            SIPADI • Teacher
          </Link>

          {currentTeachingId ? (
            <Link
              href={`/teacher/teaching/${currentTeachingId}`}
              className="text-sm text-gray-600 hover:underline"
            >
              / Teaching {currentTeachingId}
            </Link>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/teacher"
            className={`text-sm px-3 py-2 rounded border hover:bg-gray-50 ${
              isActive(pathname, "/teacher") ? "bg-gray-50" : ""
            }`}
          >
            Teaching
          </Link>

          {!loadingHomeroom && homeroom ? (
            <Link
              href={`/teacher/homeroom/${homeroom.classId}`}
              className={`text-sm px-3 py-2 rounded border hover:bg-gray-50 ${
                pathname.startsWith("/teacher/homeroom") ? "bg-gray-50" : ""
              }`}
              title={`Homeroom: ${homeroom.className}`}
            >
              Homeroom
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
