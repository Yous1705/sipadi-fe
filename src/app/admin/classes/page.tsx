"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  adminListClasses,
  adminCreateClass,
  adminUpdateClass,
  adminDeleteClass,
  adminGetUsersByClass,
  adminAssignHomeroomTeacher,
  adminMoveStudent,
  adminRemoveStudentFromClass,
  adminListUsers,
} from "@/services/admin/admin.service";

type ClassRow = {
  id: number;
  name: string;
  year: number;
  isActive?: boolean;
  homeroomTeacherId?: number | null;
  homeroomTeacher?: { id: number; name: string } | null;
};

type UserRow = {
  id: number;
  name: string;
  email: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
  isActive: boolean;
  classId?: number | null;
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-gray-500">{label}</div>
      {children}
    </div>
  );
}

function Btn({
  children,
  onClick,
  variant = "default",
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "danger" | "ghost";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const base =
    "px-3 py-2 rounded-md text-sm border inline-flex items-center justify-center";
  const styles =
    variant === "danger"
      ? "border-red-200 hover:bg-red-50 text-red-700"
      : variant === "ghost"
        ? "border-transparent hover:bg-gray-50"
        : "hover:bg-gray-50";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        base,
        styles,
        disabled ? "opacity-50 cursor-not-allowed" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function AdminClassesPage() {
  const [rows, setRows] = useState<ClassRow[]>([]);
  const [teachers, setTeachers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // create form
  const [createName, setCreateName] = useState("");
  const [createYear, setCreateYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [createActive, setCreateActive] = useState(true);

  // selection
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  // students in selected class
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsErr, setStudentsErr] = useState<string | null>(null);
  const [students, setStudents] = useState<UserRow[]>([]);

  // edit
  const [editingId, setEditingId] = useState<number | null>(null);
  const editingRow = useMemo(
    () => rows.find((x) => x.id === editingId) ?? null,
    [rows, editingId],
  );
  const [editName, setEditName] = useState("");
  const [editYear, setEditYear] = useState<number>(new Date().getFullYear());
  const [editActive, setEditActive] = useState(true);

  // homeroom teacher dropdown
  const [selectedTeacherId, setSelectedTeacherId] = useState<number>(0);

  // per-student move dropdown: studentId -> toClassId
  const [moveMap, setMoveMap] = useState<Record<number, number>>({});

  const activeClassesForMove = useMemo(() => {
    return rows.filter((c) => c.isActive !== false);
  }, [rows]);

  async function refreshAll() {
    setLoading(true);
    setErr(null);
    try {
      const [cls, tch] = await Promise.all([
        adminListClasses(),
        adminListUsers({ role: "TEACHER", isActive: true }),
      ]);

      setRows((cls as any) ?? []);
      setTeachers((tch as any) ?? []);

      // set default selected class if not set
      const firstClassId = (cls as any[])?.[0]?.id ?? null;
      setSelectedClassId((prev) => prev ?? firstClassId);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load classes/teachers");
    } finally {
      setLoading(false);
    }
  }

  async function refreshStudents(classId: number) {
    setStudentsLoading(true);
    setStudentsErr(null);
    try {
      const data = await adminGetUsersByClass(classId);
      const onlyStudents = (data as any[]).filter(
        (u: UserRow) => u.role === "STUDENT",
      );
      setStudents(onlyStudents);

      // init moveMap defaults to 0 (no selection) to avoid state weirdness
      setMoveMap((prev) => {
        const next = { ...prev };
        for (const s of onlyStudents) {
          if (next[s.id] === undefined) next[s.id] = 0;
        }
        return next;
      });
    } catch (e: any) {
      setStudentsErr(e?.message ?? "Failed to load class users");
      setStudents([]);
    } finally {
      setStudentsLoading(false);
    }
  }

  useEffect(() => {
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // IMPORTANT FIX: only depend on selectedClassId
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

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      await adminCreateClass({
        name: createName,
        year: Number(createYear),
        isActive: Boolean(createActive),
      });
      setCreateName("");
      await refreshAll();
    } catch (e: any) {
      setErr(e?.message ?? "Create failed");
    }
  }

  async function onUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setErr(null);
    try {
      await adminUpdateClass(editingId, {
        name: editName,
        year: Number(editYear),
        isActive: Boolean(editActive),
      });
      setEditingId(null);
      await refreshAll();
    } catch (e: any) {
      setErr(e?.message ?? "Update failed");
    }
  }

  async function onDelete(id: number) {
    const ok = confirm("Delete this class?");
    if (!ok) return;
    setErr(null);
    try {
      await adminDeleteClass(id);
      if (selectedClassId === id) setSelectedClassId(null);
      await refreshAll();
    } catch (e: any) {
      setErr(e?.message ?? "Delete failed");
    }
  }

  async function onAssignHomeroom() {
    if (!selectedClassId) return;
    if (!selectedTeacherId) {
      alert("Select a teacher");
      return;
    }
    setErr(null);
    try {
      await adminAssignHomeroomTeacher({
        classId: selectedClassId,
        teacherId: Number(selectedTeacherId),
      });
      await refreshAll();
    } catch (e: any) {
      setErr(e?.message ?? "Assign homeroom failed");
    }
  }

  async function onMoveStudent(studentId: number) {
    if (!selectedClassId) return;
    const toClassId = moveMap[studentId] ?? 0;
    if (!toClassId) {
      alert("Select target class");
      return;
    }

    setErr(null);
    try {
      await adminMoveStudent({ studentId, classId: toClassId });
      await refreshAll();
      await refreshStudents(selectedClassId);
    } catch (e: any) {
      setErr(e?.message ?? "Move student failed");
    }
  }

  async function onRemoveStudent(studentId: number) {
    const ok = confirm("Remove this student from class?");
    if (!ok) return;

    setErr(null);
    try {
      await adminRemoveStudentFromClass(studentId);
      if (selectedClassId) await refreshStudents(selectedClassId);
    } catch (e: any) {
      setErr(e?.message ?? "Remove student failed");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Classes</h1>
        <p className="text-sm text-gray-500">
          Create, update, assign homeroom, and manage class students.
        </p>
      </div>

      {err ? (
        <div className="border border-red-200 bg-red-50 text-red-700 rounded-lg p-3 text-sm">
          {err}
        </div>
      ) : null}

      {/* Create Class */}
      <form
        onSubmit={onCreate}
        className="border rounded-lg p-4 bg-white space-y-3"
      >
        <div className="font-semibold">Create Class</div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Field label="Name">
            <input
              className="border rounded px-3 py-2 text-sm w-full"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              placeholder="e.g. X IPA 1"
              required
            />
          </Field>

          <Field label="Year">
            <input
              className="border rounded px-3 py-2 text-sm w-full"
              type="number"
              value={createYear}
              onChange={(e) => setCreateYear(Number(e.target.value))}
              required
            />
          </Field>

          <Field label="Active">
            <select
              className="border rounded px-3 py-2 text-sm w-full"
              value={createActive ? "true" : "false"}
              onChange={(e) => setCreateActive(e.target.value === "true")}
            >
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </Field>

          <div className="flex items-end">
            <Btn type="submit">Create</Btn>
          </div>
        </div>
      </form>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left: classes list */}
        <div className="border rounded-lg bg-white overflow-hidden lg:col-span-2">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="font-semibold">All Classes</div>
            <Btn variant="ghost" onClick={refreshAll} type="button">
              Refresh
            </Btn>
          </div>

          {loading ? (
            <div className="p-4">Loading...</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Year</th>
                  <th className="p-3">Active</th>
                  <th className="p-3">Homeroom</th>
                  <th className="p-3 w-[220px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="p-3">{c.id}</td>
                    <td className="p-3">
                      <button
                        type="button"
                        className={[
                          "text-left underline-offset-2",
                          selectedClassId === c.id
                            ? "font-semibold underline"
                            : "hover:underline",
                        ].join(" ")}
                        onClick={() => setSelectedClassId(c.id)}
                      >
                        {c.name}
                      </button>
                    </td>
                    <td className="p-3">{c.year}</td>
                    <td className="p-3">{String(c.isActive ?? true)}</td>
                    <td className="p-3">
                      {c.homeroomTeacher?.name
                        ? `${c.homeroomTeacher.name} (#${c.homeroomTeacher.id})`
                        : c.homeroomTeacherId
                          ? `#${c.homeroomTeacherId}`
                          : "-"}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2 flex-wrap">
                        <Btn
                          variant="ghost"
                          onClick={() => startEdit(c)}
                          type="button"
                        >
                          Edit
                        </Btn>
                        <Btn
                          variant="ghost"
                          onClick={() => setSelectedClassId(c.id)}
                          type="button"
                        >
                          Students
                        </Btn>
                        <Btn
                          variant="danger"
                          onClick={() => onDelete(c.id)}
                          type="button"
                        >
                          Delete
                        </Btn>
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 ? (
                  <tr>
                    <td className="p-3 text-gray-500" colSpan={6}>
                      No classes
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          )}
        </div>

        {/* Right: edit + selected class tools */}
        <div className="space-y-4">
          {/* Edit */}
          <div className="border rounded-lg p-4 bg-white space-y-3">
            <div className="font-semibold">Edit Class</div>

            {!editingRow ? (
              <div className="text-sm text-gray-500">
                Click <b>Edit</b> on a class.
              </div>
            ) : (
              <form onSubmit={onUpdate} className="space-y-3">
                <Field label="Name">
                  <input
                    className="border rounded px-3 py-2 text-sm w-full"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                </Field>

                <Field label="Year">
                  <input
                    className="border rounded px-3 py-2 text-sm w-full"
                    type="number"
                    value={editYear}
                    onChange={(e) => setEditYear(Number(e.target.value))}
                    required
                  />
                </Field>

                <Field label="Active">
                  <select
                    className="border rounded px-3 py-2 text-sm w-full"
                    value={editActive ? "true" : "false"}
                    onChange={(e) => setEditActive(e.target.value === "true")}
                  >
                    <option value="true">true</option>
                    <option value="false">false</option>
                  </select>
                </Field>

                <div className="flex gap-2">
                  <Btn type="submit">Save</Btn>
                  <Btn
                    variant="ghost"
                    onClick={() => setEditingId(null)}
                    type="button"
                  >
                    Cancel
                  </Btn>
                </div>
              </form>
            )}
          </div>

          {/* Selected class actions */}
          <div className="border rounded-lg p-4 bg-white space-y-3">
            <div className="font-semibold">Selected Class</div>
            {!selectedClassId ? (
              <div className="text-sm text-gray-500">
                Select a class to manage students & homeroom.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-sm">
                  Selected: <b>#{selectedClassId}</b>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">
                    Assign Homeroom Teacher
                  </div>
                  <div className="flex gap-2">
                    <select
                      className="border rounded px-3 py-2 text-sm w-full"
                      value={selectedTeacherId}
                      onChange={(e) =>
                        setSelectedTeacherId(Number(e.target.value))
                      }
                    >
                      <option value={0}>Select teacher</option>
                      {teachers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.email})
                        </option>
                      ))}
                    </select>
                    <Btn onClick={onAssignHomeroom} type="button">
                      Assign
                    </Btn>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Students list */}
          <div className="border rounded-lg p-4 bg-white space-y-3">
            <div className="font-semibold">Students in Class</div>
            {!selectedClassId ? (
              <div className="text-sm text-gray-500">Select a class first.</div>
            ) : studentsLoading ? (
              <div className="text-sm">Loading students...</div>
            ) : studentsErr ? (
              <div className="text-sm text-red-600">{studentsErr}</div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Total: {students.length}
                  </div>
                  <Btn
                    variant="ghost"
                    onClick={() => refreshStudents(selectedClassId)}
                    type="button"
                  >
                    Refresh
                  </Btn>
                </div>

                {students.length === 0 ? (
                  <div className="text-sm text-gray-500">
                    No students in this class.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {students.map((s) => (
                      <div
                        key={s.id}
                        className="border rounded p-2 flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <div className="text-sm font-medium truncate">
                              {s.name}{" "}
                              <span className="text-xs text-gray-500">
                                #{s.id}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {s.email}
                            </div>
                          </div>

                          <Btn
                            variant="danger"
                            onClick={() => onRemoveStudent(s.id)}
                            type="button"
                          >
                            Remove
                          </Btn>
                        </div>

                        <div className="flex gap-2 items-center">
                          <select
                            className="border rounded px-3 py-2 text-sm w-full"
                            value={moveMap[s.id] ?? 0}
                            onChange={(e) =>
                              setMoveMap((prev) => ({
                                ...prev,
                                [s.id]: Number(e.target.value),
                              }))
                            }
                          >
                            <option value={0}>Move to...</option>
                            {activeClassesForMove
                              .filter((c) => c.id !== selectedClassId)
                              .map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name} ({c.year})
                                </option>
                              ))}
                          </select>
                          <Btn
                            onClick={() => onMoveStudent(s.id)}
                            type="button"
                          >
                            Move
                          </Btn>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
