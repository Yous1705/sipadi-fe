"use client";

import { useEffect, useMemo, useState } from "react";
import type { ClassRow, SubjectRow, TeachingRow, UserRow } from "@/types/admin";
import {
  adminAssignTeacher,
  adminListClasses,
  adminListSubjects,
  adminListTeachingAssignments,
  adminListUsers,
  adminUnassignTeacher,
} from "@/services/admin/admin.service";

export function useAdminTeaching() {
  const [rows, setRows] = useState<TeachingRow[]>([]);
  const [teachers, setTeachers] = useState<UserRow[]>([]);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [teacherId, setTeacherId] = useState<number>(0);
  const [classId, setClassId] = useState<number>(0);
  const [subjectId, setSubjectId] = useState<number>(0);

  const [cTeacherId, setCTeacherId] = useState<number>(0);
  const [cClassId, setCClassId] = useState<number>(0);
  const [cSubjectId, setCSubjectId] = useState<number>(0);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectedRow = useMemo(
    () => rows.find((r) => r.id === selectedId) ?? null,
    [rows, selectedId],
  );

  async function refreshTeaching() {
    setLoading(true);
    setErr(null);
    try {
      const data = await adminListTeachingAssignments();
      setRows((data ?? []) as TeachingRow[]);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load teaching assignments");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  async function refreshOptionsSoft() {
    try {
      const [t, c, s] = await Promise.all([
        adminListUsers({ role: "TEACHER", isActive: true }),
        adminListClasses(),
        adminListSubjects(),
      ]);

      const tRows = (t ?? []) as UserRow[];
      const cRows = (c ?? []) as ClassRow[];
      const sRows = (s ?? []) as SubjectRow[];

      setTeachers(tRows);
      setClasses(cRows);
      setSubjects(sRows);

      setCTeacherId((prev) => prev || tRows?.[0]?.id || 0);
      setCClassId((prev) => prev || cRows?.[0]?.id || 0);
      setCSubjectId((prev) => prev || sRows?.[0]?.id || 0);
    } catch {}
  }

  useEffect(() => {
    refreshTeaching();
    refreshOptionsSoft();
  }, []);

  const filteredRows = useMemo(() => {
    const needle = q.trim().toLowerCase();

    return rows
      .filter((r) => (teacherId ? r.teacherId === teacherId : true))
      .filter((r) => (classId ? r.classId === classId : true))
      .filter((r) => (subjectId ? r.subjectId === subjectId : true))
      .filter((r) => {
        if (!needle) return true;
        const text = [
          r.id,
          r.teacher?.name ?? `teacher#${r.teacherId}`,
          r.class ? `${r.class.name} ${r.class.year}` : `class#${r.classId}`,
          r.subject?.name ?? `subject#${r.subjectId}`,
        ]
          .join(" ")
          .toLowerCase();
        return text.includes(needle);
      });
  }, [rows, q, teacherId, classId, subjectId]);

  async function assignTeaching() {
    setErr(null);
    if (!cTeacherId || !cClassId || !cSubjectId) {
      setErr("Please select teacher, class, and subject");
      return;
    }

    try {
      await adminAssignTeacher({
        teacherId: cTeacherId,
        classId: cClassId,
        subjectId: cSubjectId,
      });
      await refreshTeaching();
    } catch (e: any) {
      setErr(e?.message ?? "Assign teacher failed");
    }
  }

  async function unassignTeaching(id: number) {
    setErr(null);
    try {
      await adminUnassignTeacher(id);
      setSelectedId((prev) => (prev === id ? null : prev));
      await refreshTeaching();
    } catch (e: any) {
      setErr(e?.message ?? "Unassign teacher failed");
    }
  }

  return {
    rows,
    filteredRows,
    loading,
    err,

    teachers,
    classes,
    subjects,

    q,
    setQ,
    teacherId,
    setTeacherId,
    classId,
    setClassId,
    subjectId,
    setSubjectId,

    cTeacherId,
    setCTeacherId,
    cClassId,
    setCClassId,
    cSubjectId,
    setCSubjectId,
    assignTeaching,

    selectedId,
    setSelectedId,
    selectedRow,

    refreshTeaching,
    unassignTeaching,
  };
}
