"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  exportGradeReport,
  getGradeReport,
} from "@/services/teacher/teacher.service";
import type { GradeReportResponse } from "@/types/report"; // sesuaikan
import TeacherNavbar from "@/components/teacher-navbar";

function pickErr(e: any) {
  const msg = e?.message ?? e?.error ?? "Terjadi kesalahan";
  return Array.isArray(msg) ? msg.join(", ") : msg;
}

export default function GradeReportPage() {
  const params = useParams();
  const teachingId = Number(params.teachingAssigmentId);

  const [data, setData] = useState<GradeReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState<"csv" | "xlsx" | null>(null);

  useEffect(() => {
    if (!teachingId) return;
    setLoading(true);
    setError(null);

    getGradeReport(teachingId)
      .then(setData)
      .catch((e) => setError(pickErr(e)))
      .finally(() => setLoading(false));
  }, [teachingId]);

  async function onExport(format: "csv" | "xlsx") {
    try {
      setExporting(format);
      const blob = await exportGradeReport(teachingId, format);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `grade-report-${teachingId}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert(pickErr(e));
    } finally {
      setExporting(null);
    }
  }

  const assignments = useMemo(() => data?.assignments ?? [], [data]);
  const students = useMemo(() => data?.students ?? [], [data]);

  if (!teachingId) return <div className="p-6">Invalid teachingId</div>;
  if (loading) return <div className="p-6">Loading...</div>;

  if (error) {
    return (
      <div className="p-6 space-y-4">
        <TeacherNavbar />
        <div className="border border-red-200 bg-red-50 text-red-700 rounded p-4">
          {error}
        </div>
        <Link
          href={`/teacher/teaching/${teachingId}`}
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 space-y-4">
        <div className="border rounded p-6 text-gray-600">
          Report tidak ditemukan.
        </div>
        <Link
          href={`/teacher/teaching/${teachingId}`}
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Grade Report</h1>
          <p className="text-sm text-gray-500">
            {data.className} (Teaching ID: {data.teachingId})
          </p>
        </div>

        <Link
          href={`/teacher/teaching/${teachingId}`}
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onExport("xlsx")}
          disabled={!!exporting}
          className="border rounded px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
        >
          {exporting === "xlsx" ? "Exporting..." : "Export XLSX"}
        </button>
        <button
          onClick={() => onExport("csv")}
          disabled={!!exporting}
          className="border rounded px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
        >
          {exporting === "csv" ? "Exporting..." : "Export CSV"}
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="text-left font-semibold px-3 py-2 border-b">
                  Nama
                </th>
                <th className="text-left font-semibold px-3 py-2 border-b">
                  Kelas
                </th>

                {assignments.map((a) => (
                  <th
                    key={a.id}
                    className="text-left font-semibold px-3 py-2 border-b"
                  >
                    {a.title}
                  </th>
                ))}

                <th className="text-left font-semibold px-3 py-2 border-b">
                  Rata-rata
                </th>
              </tr>
            </thead>

            <tbody>
              {students.map((s) => (
                <tr key={s.studentId} className="odd:bg-white even:bg-gray-50">
                  <td className="px-3 py-2 border-b">{s.studentName}</td>
                  <td className="px-3 py-2 border-b">{s.className}</td>

                  {assignments.map((a) => {
                    const asg = s.assignments.find(
                      (x) => x.assignmentId === a.id
                    );
                    const value = asg ? (asg.submitted ? asg.score : "-") : "-";
                    return (
                      <td key={a.id} className="px-3 py-2 border-b">
                        {value}
                      </td>
                    );
                  })}

                  <td className="px-3 py-2 border-b">{s.average ?? "-"}</td>
                </tr>
              ))}

              {!students.length ? (
                <tr>
                  <td
                    className="px-3 py-6 text-gray-600"
                    colSpan={2 + assignments.length + 1}
                  >
                    Tidak ada data siswa.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="p-3 text-xs text-gray-500">Rows: {students.length}</div>
      </div>
    </div>
  );
}
