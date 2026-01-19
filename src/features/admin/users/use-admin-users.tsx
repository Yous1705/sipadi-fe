"use client";

import { useEffect, useMemo, useState } from "react";
import {
  adminCreateStudent,
  adminCreateTeacher,
  adminListClasses,
  adminListUsers,
  adminResetUserPassword,
} from "@/services/admin/admin.service";
import { ClassRow, UserRow } from "@/types/admin";

export function useAdminUsers() {
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const activeClasses = useMemo(
    () => classes.filter((c) => c.isActive !== false),
    [classes],
  );

  const [role, setRole] = useState<string>("");
  const [isActive, setIsActive] = useState<string>(""); // "", "true", "false"
  const [q, setQ] = useState<string>("");

  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sName, setSName] = useState("");
  const [sEmail, setSEmail] = useState("");
  const [sPassword, setSPassword] = useState("");
  const [sClassId, setSClassId] = useState<number>(0);

  const [tName, setTName] = useState("");
  const [tEmail, setTEmail] = useState("");
  const [tPassword, setTPassword] = useState("");

  const [resetUserId, setResetUserId] = useState<number | null>(null);
  const [resetPassword, setResetPassword] = useState("");

  const params = useMemo(() => {
    return {
      role: role || undefined,
      isActive: isActive === "" ? undefined : isActive === "true",
    };
  }, [role, isActive]);

  function refresh() {
    setLoading(true);
    setError(null);
    adminListUsers(params as any)
      .then(setRows as any)
      .catch((e) => setError(e?.message ?? "Failed to load users"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    adminListClasses()
      .then((c: any) => {
        const list = (c ?? []) as ClassRow[];
        setClasses(list);
        const firstActive = list.find((x) => x.isActive !== false)?.id ?? 0;
        setSClassId((prev) => prev || firstActive);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    refresh();
  }, [params]);

  const filteredRows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;

    return rows.filter((u) => {
      const text = `${u.id} ${u.name} ${u.email} ${u.role}`.toLowerCase();
      return text.includes(needle);
    });
  }, [rows, q]);

  const selectedResetUser = useMemo(() => {
    if (!resetUserId) return null;
    return rows.find((u) => u.id === resetUserId) ?? null;
  }, [resetUserId, rows]);

  async function createStudent() {
    setError(null);
    if (!sClassId) {
      setError("Class is required for student");
      return;
    }
    await adminCreateStudent({
      name: sName.trim(),
      email: sEmail.trim(),
      password: sPassword,
      classId: Number(sClassId),
    });
    setSName("");
    setSEmail("");
    setSPassword("");
    refresh();
  }

  async function createTeacher() {
    setError(null);
    await adminCreateTeacher({
      name: tName.trim(),
      email: tEmail.trim(),
      password: tPassword,
    });
    setTName("");
    setTEmail("");
    setTPassword("");
    refresh();
  }

  async function resetPasswordAction() {
    if (!resetUserId) return;
    setError(null);
    await adminResetUserPassword(resetUserId, resetPassword);
    setResetUserId(null);
    setResetPassword("");
    refresh();
  }

  return {
    classes,
    activeClasses,
    rows,
    filteredRows,
    loading,
    error,

    role,
    setRole,
    isActive,
    setIsActive,
    q,
    setQ,

    sName,
    setSName,
    sEmail,
    setSEmail,
    sPassword,
    setSPassword,
    sClassId,
    setSClassId,
    createStudent,

    tName,
    setTName,
    tEmail,
    setTEmail,
    tPassword,
    setTPassword,
    createTeacher,

    resetUserId,
    setResetUserId,
    resetPassword,
    setResetPassword,
    selectedResetUser,
    resetPasswordAction,

    refresh,
  };
}
