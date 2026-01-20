"use client";

import { useEffect, useMemo, useState } from "react";
import {
  adminGetAttendances,
  adminUpdateAttendance,
} from "@/services/admin/admin.service";
import { AttendanceRow } from "@/types/admin";

type Opt = { id: number; name: string; year?: number };

export function useAdminAttendances() {
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [classes, setClasses] = useState<Opt[]>([]);
  const [subjects, setSubjects] = useState<Opt[]>([]);
  const [teachers, setTeachers] = useState<Opt[]>([]);

  const [classId, setClassId] = useState<number>(0);
  const [subjectId, setSubjectId] = useState<number>(0);
  const [teacherId, setTeacherId] = useState<number>(0);
  const [status, setStatus] = useState<string>("");

  const [q, setQ] = useState("");

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectedRow = useMemo(
    () => rows.find((r) => r.id === selectedId) ?? null,
    [rows, selectedId],
  );

  const [editStatus, setEditStatus] = useState<
    "HADIR" | "IZIN" | "SAKIT" | "ALPHA"
  >("HADIR");

  async function refresh() {
    setLoading(true);
    setErr(null);
    try {
      const data = await adminGetAttendances({
        classId: classId || undefined,
        subjectId: subjectId || undefined,
        teacherId: teacherId || undefined,
        status: status || undefined,
      });

      setRows((data ?? []) as AttendanceRow[]);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load attendances");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [classId, subjectId, teacherId, status]);

  useEffect(() => {
    if (!selectedRow) return;
    setEditStatus(selectedRow.status);
  }, [selectedRow?.id]);

  const filteredRows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;

    return rows.filter((r) => {
      const ta = r.attendanceSession?.teachingAssigment;
      const cls = ta?.class;
      const subj = ta?.subject;
      const tch = ta?.teacher;

      const text = [
        r.student?.name,
        r.student?.email,
        r.attendanceSession?.name,
        cls ? `${cls.name} ${cls.year}` : "",
        subj?.name,
        tch?.name,
        r.status,
        r.note,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(needle);
    });
  }, [rows, q]);

  async function save() {
    if (!selectedId) return;
    setErr(null);
    try {
      await adminUpdateAttendance(selectedId, { status: editStatus });
      await refresh();
    } catch (e: any) {
      setErr(e?.message ?? "Failed to update attendance");
    }
  }

  return {
    rows,
    filteredRows,
    loading,
    err,

    classes,
    subjects,
    teachers,

    classId,
    setClassId,
    subjectId,
    setSubjectId,
    teacherId,
    setTeacherId,
    status,
    setStatus,

    q,
    setQ,

    selectedId,
    setSelectedId,
    selectedRow,

    editStatus,
    setEditStatus,
    save,

    refresh,
  };
}
