"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  exportGradeReport,
  getGradeReport,
} from "@/services/teacher/teacher.service";
import type { GradeReportResponse } from "@/types/report";

import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

  if (!teachingId)
    return <div className="text-sm text-slate-500">Invalid teachingId</div>;
  if (loading) return <div className="text-sm text-slate-500">Loading...</div>;

  if (error) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
          {error}
        </div>
        <Link
          href={`/teacher/teaching/${teachingId}`}
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
          href={`/teacher/teaching/${teachingId}`}
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
        title="Grade Report"
        subtitle={`${data.className} (Teaching ID: ${data.teachingId})`}
        right={
          <Link href={`/teacher/teaching/${teachingId}`}>
            <Button>Back</Button>
          </Link>
        }
      />

      <Card
        title="Export"
        description="Download rekap nilai tugas."
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
        <div className="text-sm text-slate-600">
          Tip: gunakan XLSX untuk Excel, CSV untuk import cepat.
        </div>
      </Card>

      <Card
        title="Report table"
        description="Nilai per tugas + rata-rata siswa."
      >
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-50 text-slate-700">
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
                  <tr
                    key={s.studentId}
                    className="odd:bg-white even:bg-slate-50"
                  >
                    <td className="px-3 py-2 border-b">{s.studentName}</td>
                    <td className="px-3 py-2 border-b">{s.className}</td>

                    {assignments.map((a) => {
                      const asg = s.assignments.find(
                        (x) => x.assignmentId === a.id,
                      );
                      const value = asg
                        ? asg.submitted
                          ? asg.score
                          : "-"
                        : "-";
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
                      className="px-3 py-6 text-slate-600"
                      colSpan={2 + assignments.length + 1}
                    >
                      Tidak ada data siswa.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="p-3 text-xs text-slate-500">
            Rows: {students.length}
          </div>
        </div>
      </Card>
    </div>
  );
}
