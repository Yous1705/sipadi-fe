"use client";

import { useEffect, useMemo, useState } from "react";
import {
  adminAssignHomeroomTeacher,
  adminCreateClass,
  adminDeleteClass,
  adminGetUsersByClass,
  adminListClasses,
  adminListUsers,
  adminMoveStudent,
  adminRemoveStudentFromClass,
  adminUpdateClass,
} from "@/services/admin/admin.service";
import { ClassRow, UserRow } from "@/types/admin";

export function useAdminClasses() {
  const [rows, setRows] = useState<ClassRow[]>([]);
  const [teachers, setTeachers] = useState<UserRow[]>([]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // filters
  const [q, setQ] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);

  // create
  const [createName, setCreateName] = useState("");
  const [createYear, setCreateYear] = useState<number>(
    new Date().getFullYear(),
  );

  // selection
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const selectedClass = useMemo(
    () => rows.find((c) => c.id === selectedClassId) ?? null,
    [rows, selectedClassId],
  );

  // students
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsErr, setStudentsErr] = useState<string | null>(null);
  const [students, setStudents] = useState<UserRow[]>([]);
  const studentsOnly = useMemo(
    () => students.filter((u) => u.role === "STUDENT"),
    [students],
  );

  // edit
  const [editingId, setEditingId] = useState<number | null>(null);
  const editingRow = useMemo(
    () => rows.find((c) => c.id === editingId) ?? null,
    [rows, editingId],
  );

  const [editName, setEditName] = useState("");
  const [editYear, setEditYear] = useState<number>(new Date().getFullYear());
  const [editActive, setEditActive] = useState(true);

  // homeroom
  const [selectedTeacherId, setSelectedTeacherId] = useState<number>(0);

  // move student
  const [moveMap, setMoveMap] = useState<Record<number, number>>({});

  const activeClasses = useMemo(
    () => rows.filter((c) => c.isActive !== false),
    [rows],
  );

  const filteredRows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows
      .filter((c) => (activeOnly ? c.isActive !== false : true))
      .filter((c) => {
        if (!needle) return true;
        return `${c.id} ${c.name} ${c.year}`.toLowerCase().includes(needle);
      });
  }, [rows, q, activeOnly]);

  async function refreshClassesOnly() {
    setLoading(true);
    setErr(null);

    try {
      const cls = await adminListClasses();
      const list = (cls ?? []) as unknown as ClassRow[];
      setRows(list);

      // auto-select
      setSelectedClassId((prev) => prev ?? list?.[0]?.id ?? null);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load classes");
      setRows([]);
    } finally {
      // ✅ loading ALWAYS ends even if teachers request later ngadat
      setLoading(false);
    }
  }

  async function refreshTeachersSoft() {
    // Tidak mempengaruhi loading classes
    try {
      const tch = await adminListUsers({ role: "TEACHER", isActive: true });
      setTeachers((tch ?? []) as unknown as UserRow[]);
    } catch {
      // boleh gagal tanpa ganggu classes
      setTeachers([]);
    }
  }

  async function refreshStudents(classId: number) {
    setStudentsLoading(true);
    setStudentsErr(null);

    try {
      const data = await adminGetUsersByClass(classId);
      const list = (data ?? []) as unknown as UserRow[];
      setStudents(list);

      setMoveMap((prev) => {
        const next = { ...prev };
        for (const u of list) {
          if (u.role === "STUDENT" && next[u.id] === undefined) next[u.id] = 0;
        }
        return next;
      });
    } catch (e: any) {
      setStudentsErr(e?.message ?? "Failed to load users in class");
      setStudents([]);
    } finally {
      setStudentsLoading(false);
    }
  }

  useEffect(() => {
    refreshClassesOnly();
    refreshTeachersSoft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedClassId) {
      setStudents([]);
      setStudentsErr(null);
      return;
    }
    refreshStudents(selectedClassId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClassId]);

  function startEdit(row: ClassRow) {
    setEditingId(row.id);
    setEditName(row.name ?? "");
    setEditYear(row.year ?? new Date().getFullYear());
    setEditActive(row.isActive ?? true);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function createClass() {
    setErr(null);
    try {
      await adminCreateClass({
        name: createName.trim(),
        year: Number(createYear),
      });
      setCreateName("");
      await refreshClassesOnly();
    } catch (e: any) {
      setErr(e?.message ?? "Create class failed");
    }
  }

  async function updateClass() {
    if (!editingId) return;
    setErr(null);
    try {
      await adminUpdateClass(editingId, {
        name: editName.trim(),
        year: Number(editYear),
        isActive: Boolean(editActive),
      });
      setEditingId(null);
      await refreshClassesOnly();
    } catch (e: any) {
      setErr(e?.message ?? "Update class failed");
    }
  }

  async function deleteClass(id: number) {
    setErr(null);
    try {
      await adminDeleteClass(id);
      if (selectedClassId === id) setSelectedClassId(null);
      await refreshClassesOnly();
    } catch (e: any) {
      setErr(e?.message ?? "Delete class failed");
    }
  }

  async function assignHomeroomTeacher() {
    if (!selectedClassId) return;
    if (!selectedTeacherId) {
      setErr("Please select a teacher first");
      return;
    }
    setErr(null);
    try {
      // ✅ sesuai admin.service.ts terbaru: DTO
      await adminAssignHomeroomTeacher({
        classId: selectedClassId,
        teacherId: selectedTeacherId,
      });
      await refreshClassesOnly();
    } catch (e: any) {
      setErr(e?.message ?? "Assign homeroom teacher failed");
    }
  }

  async function moveStudent(studentId: number) {
    if (!selectedClassId) return;

    const toClassId = moveMap[studentId] ?? 0;
    if (!toClassId) {
      setStudentsErr("Select destination class first");
      return;
    }

    setStudentsErr(null);
    try {
      // ✅ sesuai admin.service.ts terbaru: DTO
      await adminMoveStudent({ studentId, classId: toClassId });
      await refreshStudents(selectedClassId);
      await refreshClassesOnly();
    } catch (e: any) {
      setStudentsErr(e?.message ?? "Move student failed");
    }
  }

  async function removeStudent(studentId: number) {
    if (!selectedClassId) return;

    setStudentsErr(null);
    try {
      await adminRemoveStudentFromClass(studentId);
      await refreshStudents(selectedClassId);
      await refreshClassesOnly();
    } catch (e: any) {
      setStudentsErr(e?.message ?? "Remove student failed");
    }
  }

  return {
    // data
    rows,
    teachers,
    loading,
    err,

    // filters
    q,
    setQ,
    activeOnly,
    setActiveOnly,
    filteredRows,

    // selection
    selectedClassId,
    setSelectedClassId,
    selectedClass,

    // create
    createName,
    setCreateName,
    createYear,
    setCreateYear,
    createClass,

    // edit
    editingRow,
    editName,
    setEditName,
    editYear,
    setEditYear,
    editActive,
    setEditActive,
    startEdit,
    cancelEdit,
    updateClass,
    deleteClass,

    // students
    studentsLoading,
    studentsErr,
    studentsOnly,

    // homeroom
    selectedTeacherId,
    setSelectedTeacherId,
    assignHomeroomTeacher,

    // move/remove
    moveMap,
    setMoveMap,
    activeClasses,
    moveStudent,
    removeStudent,

    // manual refresh
    refreshClassesOnly,
  };
}
