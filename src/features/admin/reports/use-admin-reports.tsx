"use client";

import { useEffect, useMemo, useState } from "react";
import type { ClassReportResponse, GradeReportResponse } from "@/types/report";
import {
  adminGetClassReport,
  adminGetGradeReport,
  adminListClasses,
  adminListTeachingAssignments,
  adminExportClassReport,
} from "@/services/admin/admin.service";
import { download } from "@/lib/download";

type ClassOpt = { id: number; name: string; year: number; isActive?: boolean };
type TeachingOpt = {
  id: number;
  class?: { id: number; name: string; year: number };
  subject?: { id: number; name: string };
  teacher?: { id: number; name: string };
};

export function useAdminReports() {
  const [tab, setTab] = useState<"CLASS" | "GRADE">("CLASS");

  const [classes, setClasses] = useState<ClassOpt[]>([]);
  const [teachings, setTeachings] = useState<TeachingOpt[]>([]);

  const [classId, setClassId] = useState<number>(0);
  const [teachingId, setTeachingId] = useState<number>(0);

  const [classReport, setClassReport] = useState<ClassReportResponse | null>(
    null,
  );
  const [gradeReport, setGradeReport] = useState<GradeReportResponse | null>(
    null,
  );

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function loadOptions() {
    try {
      const [c, t] = await Promise.all([
        adminListClasses(),
        adminListTeachingAssignments(),
      ]);

      const cRows = (c ?? []) as any[];
      const tRows = (t ?? []) as any[];

      setClasses(cRows);
      setTeachings(tRows);

      setClassId((prev) => prev || cRows?.[0]?.id || 0);
      setTeachingId((prev) => prev || tRows?.[0]?.id || 0);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load options");
    }
  }

  useEffect(() => {
    loadOptions();
  }, []);

  const canGenerate = useMemo(() => {
    if (tab === "CLASS") return !!classId;
    return !!teachingId;
  }, [tab, classId, teachingId]);

  async function generate() {
    setErr(null);
    setLoading(true);
    try {
      if (tab === "CLASS") {
        const res = await adminGetClassReport(classId);
        setClassReport(res);
      } else {
        const res = await adminGetGradeReport(teachingId);
        setGradeReport(res);
      }
    } catch (e: any) {
      setErr(e?.message ?? "Failed to generate report");
    } finally {
      setLoading(false);
    }
  }

  async function exportClass(format: "csv" | "xlsx") {
    if (!classId) return;

    setErr(null);
    try {
      const blob = await adminExportClassReport(classId, format);
      const picked = classes.find((c) => c.id === classId);
      const name = picked
        ? `${picked.name}-${picked.year}`
        : `class-${classId}`;
      download(blob, `class-report-${name}.${format}`);
    } catch (e: any) {
      setErr(e?.message ?? "Export gagal");
    }
  }

  function reset() {
    setClassReport(null);
    setGradeReport(null);
  }

  return {
    tab,
    setTab,

    classes,
    teachings,

    classId,
    setClassId,
    teachingId,
    setTeachingId,

    classReport,
    gradeReport,

    loading,
    err,

    canGenerate,
    generate,
    exportClass,
    reset,
  };
}
