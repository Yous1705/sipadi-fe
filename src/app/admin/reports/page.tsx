"use client";

import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { useAdminReports } from "@/features/admin/reports/use-admin-reports";
import { ClassReport } from "@/features/admin/reports/class-report";
import { GradeReport } from "@/features/admin/reports/grade-report";

function AdminReportsPage() {
  const reports = useAdminReports();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Generate class reports and grade reports."
        right={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={reports.reset}>
              Reset
            </Button>
            <Button
              variant="primary"
              disabled={!reports.canGenerate || reports.loading}
              onClick={reports.generate}
            >
              {reports.loading ? "Generating..." : "Generate"}
            </Button>
          </div>
        }
      />

      {reports.err ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {reports.err}
        </div>
      ) : null}

      <Card title="Controls" description="Pick report type and target.">
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Report type">
            <Select
              value={reports.tab}
              onChange={(e) => reports.setTab(e.target.value as any)}
            >
              <option value="CLASS">Class Report</option>
              <option value="GRADE">Grade Report</option>
            </Select>
          </Field>

          {reports.tab === "CLASS" ? (
            <Field label="Class">
              <Select
                value={reports.classId}
                onChange={(e) => reports.setClassId(Number(e.target.value))}
              >
                <option value={0}>Select class</option>
                {reports.classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.year})
                  </option>
                ))}
              </Select>
            </Field>
          ) : (
            <Field label="Teaching Assignment">
              <Select
                value={reports.teachingId}
                onChange={(e) => reports.setTeachingId(Number(e.target.value))}
              >
                <option value={0}>Select teaching</option>
                {reports.teachings.map((t) => (
                  <option key={t.id} value={t.id}>
                    #{t.id} • {t.class?.name} ({t.class?.year}) •{" "}
                    {t.subject?.name} • {t.teacher?.name}
                  </option>
                ))}
              </Select>
            </Field>
          )}

          <div className="flex items-end justify-end gap-2">
            {reports.tab === "CLASS" ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => reports.exportClass("csv")}
                  disabled={!reports.classId}
                >
                  Export CSV
                </Button>
                <Button
                  variant="outline"
                  onClick={() => reports.exportClass("xlsx")}
                  disabled={!reports.classId}
                >
                  Export XLSX
                </Button>
              </>
            ) : (
              <div className="text-xs text-slate-500">
                Export grade report belum dibuat untuk admin (kalau kamu mau,
                kita tambah endpoint-nya).
              </div>
            )}
          </div>
        </div>
      </Card>

      {reports.tab === "CLASS" ? (
        reports.classReport ? (
          <ClassReport report={reports.classReport} />
        ) : (
          <div className="text-sm text-slate-500">
            Generate class report to view results.
          </div>
        )
      ) : reports.gradeReport ? (
        <GradeReport report={reports.gradeReport} />
      ) : (
        <div className="text-sm text-slate-500">
          Generate grade report to view results.
        </div>
      )}
    </div>
  );
}

export default AdminReportsPage;
