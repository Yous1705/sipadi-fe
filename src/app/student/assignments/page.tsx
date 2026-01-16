"use client";

import StudentNavbar from "@/components/student-navbar";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { getMySubjects, getSubject } from "@/services/student/student.service";

type Filter = "ALL" | "NOT_SUBMITTED" | "SUBMITTED";

function AllAssignmentsPage() {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    (async () => {
      const subjects = await getMySubjects(); // [{teachingAssigmentId, subjectName, teacherName, ...}]
      const hubs = await Promise.all(
        subjects.map((s: any) => getSubject(s.teachingAssigmentId))
      );

      const flat = hubs.flatMap((hub: any) =>
        hub.assignments.map((a: any) => ({
          ...a,
          teachingAssigmentId: hub.teachingAssigmentId,
          subjectName: hub.subjectName,
          teacherName: hub.teacherName,
          classId: hub.classId,
        }))
      );

      setItems(flat);
    })()
      .catch((e: any) =>
        setError(e?.message ?? e?.error ?? "Gagal memuat assignments")
      )
      .finally(() => setLoading(false));
  }, []);

  const assignments = useMemo(() => {
    const filtered =
      filter === "ALL" ? items : items.filter((x) => x.status === filter);

    return filtered.sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
  }, [items, filter]);

  return (
    <div>
      <StudentNavbar />
      <div className="max-w-6xl mx-auto p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">All Assignments</h1>
            <p className="text-sm text-gray-600">
              Semua tugas dari seluruh subject
            </p>
          </div>
          <Link className="text-sm underline" href="/student">
            Back to Dashboard
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
            {assignments.map((a) => {
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
                      href={`/student/assignments/${a.id}`}
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
export default AllAssignmentsPage;
