"use client";
import { getMyClasses } from "@/services/student/student.service";
import { MyClassItem } from "@/types/student";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

function page() {
  const [classes, setClasses] = useState<MyClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  const grouped = useMemo(() => {
    const map = new Map<
      number,
      { classId: number; className: string; subjects: MyClassItem[] }
    >();
    classes.forEach((c) => {
      if (!map.has(c.classId))
        map.set(c.classId, {
          classId: c.classId,
          className: c.className,
          subjects: [],
        });
      map.get(c.classId)!.subjects.push(c);
    });
    return Array.from(map.values());
  }, [classes]);

  useEffect(() => {
    setLoading(true);
    getMyClasses()
      .then(setClasses)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="max-w-6xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Classes</h1>

        {loading ? (
          <div>Loading...</div>
        ) : grouped.length === 0 ? (
          <div className="border rounded-xl p-4">Belum ada kelas.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grouped.map((c) => (
              <div key={c.classId} className="border rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{c.className}</div>
                  <Link
                    className="text-sm underline"
                    href={`/student/classes/${c.classId}`}
                  >
                    Open
                  </Link>
                </div>

                <div className="text-sm text-gray-700 space-y-1">
                  {c.subjects.map((s) => (
                    <div
                      key={s.teachingAssignmentId}
                      className="flex justify-between"
                    >
                      <span>{s.subjectName}</span>
                      <span className="text-gray-500">{s.teacherName}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default page;
