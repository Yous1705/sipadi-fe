"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { ClassReportResponse } from "@/types/report";
import {
  exportClassReport,
  getClassReport,
} from "@/services/teacher/teacher.service";
import TeacherNavbar from "@/components/teacher-navbar";

function pickErr(e: any) {
  const msg = e?.message ?? e?.error ?? "Terjadi kesalahan";
  return Array.isArray(msg) ? msg.join(", ") : msg;
}

export default function HomeroomReportPage() {
  const params = useParams();
  const classId = Number(params.classId);

  const [data, setData] = useState<ClassReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [exporting, setExporting] = useState<"csv" | "xlsx" | null>(null);

  useEffect(() => {
    if (!classId) return;

    setLoading(true);
    setError(null);

    getClassReport(classId)
      .then(setData)
      .catch((e) => setError(pickErr(e)))
      .finally(() => setLoading(false));
  }, [classId]);

  async function onExport(format: "csv" | "xlsx") {
    try {
      setExporting(format);
      const blob = await exportClassReport(classId, format);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `class-summary-${classId}.${format}`;
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

  const subjects = useMemo(() => data?.subjects ?? [], [data]);
  const students = useMemo(() => data?.students ?? [], [data]);

  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => {
      const ar = a.rank ?? 999999;
      const br = b.rank ?? 999999;
      return ar - br;
    });
  }, [students]);

  if (!classId) return <div className="p-6">Invalid classId</div>;
  if (loading) return <div className="p-6">Loading...</div>;

  if (error) {
    return (
      <div className="p-6 space-y-4">
        <div className="border border-red-200 bg-red-50 text-red-700 rounded p-4">
          {error}
        </div>
        <Link href="/teacher" className="text-sm text-gray-600 hover:underline">
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
        <Link href="/teacher" className="text-sm text-gray-600 hover:underline">
          ← Back
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <TeacherNavbar />
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Homeroom Summary Report</h1>
          <p className="text-sm text-gray-500">
            {data.className} (ID: {data.classId})
          </p>
        </div>

        <Link href="/teacher" className="text-sm text-gray-600 hover:underline">
          ← Back
        </Link>
      </div>

      {/* Export */}
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

      {/* Table */}
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

                {subjects.map((s) => (
                  <th
                    key={s.id}
                    className="text-left font-semibold px-3 py-2 border-b"
                  >
                    {s.name}
                  </th>
                ))}

                <th className="text-left font-semibold px-3 py-2 border-b">
                  Rata-rata
                </th>
                <th className="text-left font-semibold px-3 py-2 border-b">
                  Rank
                </th>
                <th className="text-left font-semibold px-3 py-2 border-b">
                  Hadir
                </th>
                <th className="text-left font-semibold px-3 py-2 border-b">
                  Izin
                </th>
                <th className="text-left font-semibold px-3 py-2 border-b">
                  Sakit
                </th>
                <th className="text-left font-semibold px-3 py-2 border-b">
                  Alpha
                </th>
              </tr>

              {/* Class average row */}
              <tr className="bg-white text-gray-600">
                <th className="text-left font-semibold px-3 py-2 border-b">
                  Rata-rata kelas
                </th>
                <th className="px-3 py-2 border-b">{data.className}</th>

                {subjects.map((s) => (
                  <th key={s.id} className="px-3 py-2 border-b">
                    {typeof s.classAverage === "number" ? s.classAverage : "-"}
                  </th>
                ))}

                <th className="px-3 py-2 border-b">-</th>
                <th className="px-3 py-2 border-b">-</th>
                <th className="px-3 py-2 border-b">-</th>
                <th className="px-3 py-2 border-b">-</th>
                <th className="px-3 py-2 border-b">-</th>
                <th className="px-3 py-2 border-b">-</th>
              </tr>
            </thead>

            <tbody>
              {sortedStudents.map((st) => (
                <tr key={st.studentId} className="odd:bg-white even:bg-gray-50">
                  <td className="px-3 py-2 border-b">{st.name}</td>
                  <td className="px-3 py-2 border-b">{data.className}</td>

                  {subjects.map((sub) => (
                    <td key={sub.id} className="px-3 py-2 border-b">
                      {st.grades.find((g) => g.subjectId === sub.id)?.average ??
                        "-"}
                    </td>
                  ))}

                  <td className="px-3 py-2 border-b">
                    {st.overallAverage ?? "-"}
                  </td>
                  <td className="px-3 py-2 border-b">{st.rank ?? "-"}</td>

                  <td className="px-3 py-2 border-b">{st.attendance.HADIR}</td>
                  <td className="px-3 py-2 border-b">{st.attendance.IZIN}</td>
                  <td className="px-3 py-2 border-b">{st.attendance.SAKIT}</td>
                  <td className="px-3 py-2 border-b">{st.attendance.ALPHA}</td>
                </tr>
              ))}

              {!sortedStudents.length ? (
                <tr>
                  <td
                    className="px-3 py-6 text-gray-600"
                    colSpan={2 + subjects.length + 6}
                  >
                    Tidak ada data siswa.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="p-3 text-xs text-gray-500">
          Rows: {sortedStudents.length}
        </div>
      </div>
    </div>
  );
}
