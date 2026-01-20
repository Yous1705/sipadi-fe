"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { ClassReportResponse } from "@/types/report";
import {
  exportClassReport,
  getClassReport,
} from "@/services/teacher/teacher.service";

import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReportTable } from "@/features/teacher/report/report-table";

function pickErr(e: any) {
  const msg = e?.message ?? e?.error ?? "Terjadi kesalahan";
  return Array.isArray(msg) ? msg.join(", ") : msg;
}

function HomeroomReportPage() {
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
    return [...students].sort(
      (a, b) => (a.rank ?? 999999) - (b.rank ?? 999999),
    );
  }, [students]);

  if (!classId)
    return <div className="text-sm text-slate-500">Invalid classId</div>;
  if (loading) return <div className="text-sm text-slate-500">Loading...</div>;

  if (error) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
          {error}
        </div>
        <Link
          href="/teacher"
          className="text-sm text-slate-600 hover:underline"
        >
          ← Back
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <Card title="Not found" description="Report tidak ditemukan.">
        <Link
          href="/teacher"
          className="text-sm text-slate-600 hover:underline"
        >
          ← Back
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Homeroom Summary Report"
        subtitle={`${data.className} (ID: ${data.classId})`}
        right={
          <Link href="/teacher">
            <Button>Back</Button>
          </Link>
        }
      />

      <Card
        title="Export"
        description="Download rekap dalam format CSV/XLSX."
        action={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="primary"
              onClick={() => onExport("xlsx")}
              disabled={!!exporting}
            >
              {exporting === "xlsx" ? "Exporting..." : "Export XLSX"}
            </Button>
            <Button onClick={() => onExport("csv")} disabled={!!exporting}>
              {exporting === "csv" ? "Exporting..." : "Export CSV"}
            </Button>
          </div>
        }
      >
        {!!data.subjects?.length ? (
          <div className="text-sm text-slate-600">
            <span className="text-slate-500">Subjects: </span>
            {data.subjects.map((s) => s.name).join(", ")}
          </div>
        ) : (
          <div className="text-sm text-slate-500">No subjects.</div>
        )}
      </Card>

      <Card
        title="Class report"
        description="Ringkasan nilai & kehadiran siswa."
      >
        <ReportTable footer={`Rows: ${sortedStudents.length}`}>
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-50 text-slate-700">
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

              <tr className="bg-white text-slate-600">
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
                <tr
                  key={st.studentId}
                  className="odd:bg-white even:bg-slate-50"
                >
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
                    className="px-3 py-6 text-slate-600"
                    colSpan={2 + subjects.length + 6}
                  >
                    Tidak ada data siswa.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </ReportTable>
      </Card>
    </div>
  );
}

export default HomeroomReportPage;
