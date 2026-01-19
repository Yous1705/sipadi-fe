"use client";
import { getClass } from "@/services/student/student.service";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

type Filter = "ALL" | "NOT_SUBMITTED" | "SUBMITTED";
function page() {
  const { classId } = useParams<{ classId: string }>();
  const idClass = Number(classId);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [loading, setLoading] = useState(true);
  const [classs, setClases] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idClass) return;
    setLoading(true);
    setError(null);

    getClass(idClass)
      .then(setClases)
      .catch((e: any) =>
        setError(e?.message || e?.error || "Gagal memuat assignments"),
      )
      .finally(() => setLoading(false));
  }, [idClass]);

  const assignments = useMemo(() => {
    const list =
      classs?.subjects.flatMap((s: any) =>
        s.assignments.map((a: any) => ({
          ...a,
          subjectName: s.subjectName,
          teacherName: s.teacherName,
        })),
      ) ?? [];

    const filtered =
      filter === "ALL" ? list : list.filter((x: any) => x.status === filter);

    return filtered.sort(
      (a: any, b: any) =>
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    );
  }, [classs, filter]);

  return (
    <div>
      <div className="max-w-6xl mx-auto p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Assignments</h1>
            <p className="text-sm text-gray-600">Class ID: {idClass}</p>
          </div>
          <Link
            className="text-sm underline"
            href={`/student/classes/${idClass}`}
          >
            Back to Class Hub
          </Link>
        </div>

        <div className="flex gap-2">
          {(["ALL", "NOT_SUBMITTED", "SUBMITTED"] as Filter[]).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-3 py-2 rounded-lg border text-sm ${
                filter === k ? "bg-black text-white" : ""
              }`}
            >
              {k === "ALL"
                ? "All"
                : k === "NOT_SUBMITTED"
                  ? "Not submitted"
                  : "Submitted"}
            </button>
          ))}
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="border rounded-xl p-4 text-red-600">{error}</div>
        ) : assignments.length === 0 ? (
          <div className="border rounded-xl p-4">Belum ada assignment.</div>
        ) : (
          <div className="border rounded-xl divide-y">
            {assignments.map((a: any) => {
              const late = new Date(a.dueDate) < new Date();
              return (
                <div
                  key={a.id}
                  className="p-4 flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="font-medium">{a.title}</div>
                    <div className="text-sm text-gray-600">
                      {a.subjectName} • {a.teacherName}
                    </div>
                    <div className="text-xs text-gray-500">
                      Due: {new Date(a.dueDate).toLocaleString()}{" "}
                      {late ? "• Late" : ""}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm">
                      {a.status === "SUBMITTED" ? "Submitted" : "Not submitted"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Score: {a.score ?? "-"}
                    </div>

                    <Link
                      className="inline-block mt-2 text-sm underline"
                      href={`/student/assignments/${a.id}?classId=${idClass}`}
                    >
                      Open
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default page;
