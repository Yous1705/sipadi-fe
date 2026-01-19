"use client";

import { useEffect, useMemo, useState } from "react";
import {
  adminCreateSubject,
  adminDeleteSubject,
  adminListSubjects,
  adminUpdateSubject,
} from "@/services/admin/admin.service";
import { SubjectRow } from "@/types/admin";

export function useAdminSubjects() {
  const [rows, setRows] = useState<SubjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // filters
  const [q, setQ] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);

  // create
  const [createName, setCreateName] = useState("");

  // edit
  const [editingId, setEditingId] = useState<number | null>(null);
  const editingRow = useMemo(
    () => rows.find((s) => s.id === editingId) ?? null,
    [rows, editingId],
  );

  const [editName, setEditName] = useState("");
  const [editActive, setEditActive] = useState(true);

  const filteredRows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((s) => {
      if (!needle) return true;
      return `${s.id} ${s.name}`.toLowerCase().includes(needle);
    });
  }, [rows, q, activeOnly]);

  async function refresh() {
    setLoading(true);
    setErr(null);
    try {
      const data = await adminListSubjects();
      setRows((data ?? []) as unknown as SubjectRow[]);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load subjects");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function startEdit(row: SubjectRow) {
    setEditingId(row.id);
    setEditName(row.name ?? "");
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function createSubject() {
    setErr(null);
    try {
      await adminCreateSubject({ name: createName.trim() });
      setCreateName("");
      await refresh();
    } catch (e: any) {
      setErr(e?.message ?? "Create subject failed");
    }
  }

  async function updateSubject() {
    if (!editingId) return;
    setErr(null);
    try {
      await adminUpdateSubject(editingId, {
        name: editName.trim(),
      });
      setEditingId(null);
      await refresh();
    } catch (e: any) {
      setErr(e?.message ?? "Update subject failed");
    }
  }

  async function deleteSubject(id: number) {
    setErr(null);
    try {
      await adminDeleteSubject(id);
      await refresh();
    } catch (e: any) {
      setErr(e?.message ?? "Delete subject failed");
    }
  }

  return {
    rows,
    filteredRows,
    loading,
    err,

    q,
    setQ,
    activeOnly,
    setActiveOnly,

    createName,
    setCreateName,
    createSubject,

    editingRow,
    editName,
    setEditName,
    editActive,
    setEditActive,
    startEdit,
    cancelEdit,
    updateSubject,

    deleteSubject,
    refresh,
  };
}
