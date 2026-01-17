"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  adminGetAttendances,
  adminUpdateAttendance,
  adminListClasses,
  adminListUsers,
} from "@/services/admin/admin.service";
import { AttendanceRow } from "@/types/admin";

type ClassRow = { id: number; name: string; year: number; isActive?: boolean };
type StudentRow = {
  id: number;
  name: string;
  email: string;
  role: "STUDENT";
  isActive: boolean;
};

function Btn({
  children,
  onClick,
  variant = "default",
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "ghost";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const base =
    "px-3 py-2 rounded-md text-sm border inline-flex items-center justify-center";
  const styles =
    variant === "ghost"
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

function sessionLabel(a: AttendanceRow) {
  const s = a.attendanceSession;
  const sid = a.attendanceSessionId ?? s?.id;

  // pakai name kalau ada & tidak kosong
  const name = s?.name && s.name.trim().length > 0 ? s.name.trim() : undefined;

  return name ?? (sid ? `Session ${sid}` : "-");
}

function sessionMeta(a: AttendanceRow) {
  const s = a.attendanceSession;
  const cls = s?.teachingAssigment?.class;
  const subj = s?.teachingAssigment?.subject;
  const teacher = s?.teachingAssigment?.teacher;

  const meta = [
    cls ? `${cls.name} (${cls.year})` : null,
    subj ? subj.name : null,
    teacher ? teacher.name : null,
  ]
    .filter(Boolean)
    .join(" • ");

  return meta;
}

export default function AdminAttendancesPage() {
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // lookup data
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [students, setStudents] = useState<StudentRow[]>([]);

  // filters (friendly)
  const [classId, setClassId] = useState<number>(0);
  const [status, setStatus] = useState<string>("");

  // student search filter
  const [studentSearch, setStudentSearch] = useState<string>("");
  const [studentId, setStudentId] = useState<number>(0);

  // session search (optional)
  const [sessionSearch, setSessionSearch] = useState<string>("");

  // edit panel
  const [editingId, setEditingId] = useState<number | null>(null);
  const editingRow = useMemo(
    () => rows.find((x) => x.id === editingId) ?? null,
    [rows, editingId],
  );
  const [editStatus, setEditStatus] =
    useState<AttendanceRow["status"]>("HADIR");
  const [editNote, setEditNote] = useState<string>("");

  const activeClasses = useMemo(
    () => classes.filter((c) => c.isActive !== false),
    [classes],
  );

  const selectedStudent = useMemo(() => {
    if (!studentId) return null;
    return students.find((s) => s.id === studentId) ?? null;
  }, [studentId, students]);

  function buildQuery() {
    // optional: kalau BE support, bagus. kalau tidak, aman.
    const q: Record<string, unknown> = {};
    if (classId) q.classId = classId;
    if (studentId) q.studentId = studentId;
    if (status) q.status = status;
    return q;
  }

  async function refresh() {
    setLoading(true);
    setErr(null);
    try {
      const data = await adminGetAttendances(buildQuery());
      setRows((data as AttendanceRow[]) ?? []);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load attendances");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // load lookups once
    Promise.all([
      adminListClasses(),
      adminListUsers({ role: "STUDENT", isActive: true }),
    ])
      .then(([cls, users]: any) => {
        setClasses((cls ?? []) as ClassRow[]);
        setStudents((users ?? []) as StudentRow[]);
      })
      .catch(() => {
        // ignore
      });

    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startEdit(r: AttendanceRow) {
    setEditingId(r.id);
    setEditStatus(r.status);
    setEditNote(r.note ?? "");
  }

  async function onSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;

    setErr(null);
    try {
      await adminUpdateAttendance(editingId, {
        status: editStatus,
        note: editNote ? editNote : null,
      });
      setEditingId(null);
      setEditNote("");
      await refresh();
    } catch (e: any) {
      setErr(e?.message ?? "Update failed");
    }
  }

  const studentSuggestions = useMemo(() => {
    const q = studentSearch.trim().toLowerCase();
    if (!q) return [];

    // simple contains search: name/email/id
    const found = students.filter((s) => {
      const text = `${s.name} ${s.email} ${s.id}`.toLowerCase();
      return text.includes(q);
    });

    return found.slice(0, 10);
  }, [studentSearch, students]);

  const tableRows = useMemo(() => {
    let list = [...rows];

    // client-side filters
    if (studentId) {
      list = list.filter(
        (x) => x.studentId === studentId || x.student?.id === studentId,
      );
    }

    if (status) {
      list = list.filter((x) => x.status === status);
    }

    if (classId) {
      list = list.filter(
        (x) => x.attendanceSession?.teachingAssigment?.class?.id === classId,
      );
    }

    if (sessionSearch.trim()) {
      const needle = sessionSearch.trim().toLowerCase();
      list = list.filter((x) => {
        const label = sessionLabel(x);
        const meta = sessionMeta(x);
        const text = `${label} ${meta ?? ""}`.toLowerCase();
        return text.includes(needle);
      });
    }

    return list;
  }, [rows, studentId, status, classId, sessionSearch]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Attendances</h1>
        <p className="text-sm text-gray-500">
          Review and update attendance status.
        </p>
      </div>

      {err ? (
        <div className="border border-red-200 bg-red-50 text-red-700 rounded-lg p-3 text-sm">
          {err}
        </div>
      ) : null}

      {/* Filters */}
      <div className="border rounded-lg p-4 bg-white space-y-3">
        <div className="font-semibold">Filters</div>

        <div className="grid gap-3 sm:grid-cols-4">
          <Field label="Class">
            <select
              className="border rounded px-3 py-2 text-sm w-full"
              value={classId}
              onChange={(e) => setClassId(Number(e.target.value))}
            >
              <option value={0}>All classes</option>
              {activeClasses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.year})
                </option>
              ))}
            </select>
          </Field>

          <Field label="Student (search)">
            <div className="relative">
              <input
                className="border rounded px-3 py-2 text-sm w-full"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Type name / email / id..."
              />

              {/* suggestions */}
              {studentSuggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full border rounded bg-white shadow-sm max-h-64 overflow-auto">
                  {studentSuggestions.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-gray-50"
                      onClick={() => {
                        setStudentId(s.id);
                        setStudentSearch("");
                      }}
                    >
                      <div className="text-sm font-medium">{s.name}</div>
                      <div className="text-xs text-gray-500">
                        {s.email} • #{s.id}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedStudent ? (
              <div className="mt-2 flex items-center justify-between border rounded p-2">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">
                    {selectedStudent.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {selectedStudent.email} • #{selectedStudent.id}
                  </div>
                </div>
                <Btn
                  variant="ghost"
                  onClick={() => setStudentId(0)}
                  type="button"
                >
                  Clear
                </Btn>
              </div>
            ) : (
              <div className="mt-2 text-xs text-gray-500">
                No student selected
              </div>
            )}
          </Field>

          <Field label="Session (search)">
            <input
              className="border rounded px-3 py-2 text-sm w-full"
              value={sessionSearch}
              onChange={(e) => setSessionSearch(e.target.value)}
              placeholder="Type session name / class / subject..."
            />
          </Field>

          <Field label="Status">
            <select
              className="border rounded px-3 py-2 text-sm w-full"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All</option>
              <option value="HADIR">HADIR</option>
              <option value="IZIN">IZIN</option>
              <option value="SAKIT">SAKIT</option>
              <option value="ALPHA">ALPHA</option>
            </select>
          </Field>
        </div>

        <div className="flex gap-2">
          <Btn onClick={refresh}>Apply / Refresh</Btn>
          <Btn
            variant="ghost"
            onClick={() => {
              setClassId(0);
              setStudentId(0);
              setStudentSearch("");
              setSessionSearch("");
              setStatus("");
            }}
          >
            Reset
          </Btn>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Table */}
        <div className="border rounded-lg bg-white overflow-hidden lg:col-span-2">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="font-semibold">Attendance List</div>
            <Btn variant="ghost" onClick={refresh}>
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
                  <th className="p-3">Student</th>
                  <th className="p-3">Session</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 w-[120px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((a) => {
                  const sName = a.student?.name?.trim();
                  const studentText =
                    sName && sName.length > 0
                      ? sName
                      : a.studentId
                        ? `Student ${a.studentId}`
                        : "-";

                  const sessTitle = sessionLabel(a);
                  const sessMeta = sessionMeta(a);

                  return (
                    <tr key={a.id} className="border-t">
                      <td className="p-3">{a.id}</td>
                      <td className="p-3">
                        <div className="font-medium">{studentText}</div>
                        <div className="text-xs text-gray-500">
                          {a.student?.email ?? ""}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium">{sessTitle}</div>
                        {sessMeta ? (
                          <div className="text-xs text-gray-500">
                            {sessMeta}
                          </div>
                        ) : null}
                      </td>
                      <td className="p-3">{a.status}</td>
                      <td className="p-3">
                        <Btn variant="ghost" onClick={() => startEdit(a)}>
                          Edit
                        </Btn>
                      </td>
                    </tr>
                  );
                })}

                {tableRows.length === 0 ? (
                  <tr>
                    <td className="p-3 text-gray-500" colSpan={5}>
                      No attendances
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          )}
        </div>

        {/* Edit Panel */}
        <div className="border rounded-lg p-4 bg-white space-y-3">
          <div className="font-semibold">Edit Attendance</div>

          {!editingRow ? (
            <div className="text-sm text-gray-500">
              Click <b>Edit</b> on a row.
            </div>
          ) : (
            <form onSubmit={onSaveEdit} className="space-y-3">
              <div className="text-sm">
                Editing: <b>#{editingRow.id}</b>
              </div>

              <Field label="Status">
                <select
                  className="border rounded px-3 py-2 text-sm w-full"
                  value={editStatus}
                  onChange={(e) =>
                    setEditStatus(e.target.value as AttendanceRow["status"])
                  }
                >
                  <option value="HADIR">HADIR</option>
                  <option value="IZIN">IZIN</option>
                  <option value="SAKIT">SAKIT</option>
                  <option value="ALPHA">ALPHA</option>
                </select>
              </Field>

              <Field label="Note (optional)">
                <textarea
                  className="border rounded px-3 py-2 text-sm w-full min-h-[90px]"
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  placeholder="Reason / note..."
                />
              </Field>

              <div className="flex gap-2">
                <Btn type="submit">Save</Btn>
                <Btn
                  variant="ghost"
                  onClick={() => {
                    setEditingId(null);
                    setEditNote("");
                  }}
                >
                  Cancel
                </Btn>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
