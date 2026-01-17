"use client";

import React, { useEffect, useMemo, useState } from "react";

import { ClassRow, SubjectRow, TeacherRow, TeachingRow } from "@/types/admin";
import {
  adminAssignTeacher,
  adminListClasses,
  adminListSubjects,
  adminListTeachingAssignments,
  adminListUsers,
  adminUnassignTeacher,
} from "@/services/admin/admin.service";

export default function AdminTeachingAssignmentsPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [teachings, setTeachings] = useState<TeachingRow[]>([]);

  const [classId, setClassId] = useState<number>(0);
  const [subjectId, setSubjectId] = useState<number>(0);
  const [teacherId, setTeacherId] = useState<number>(0);

  const [q, setQ] = useState("");

  const classMap = useMemo(() => {
    const m = new Map<number, ClassRow>();
    classes.forEach((c) => m.set(c.id, c));
    return m;
  }, [classes]);

  const subjectMap = useMemo(() => {
    const m = new Map<number, SubjectRow>();
    subjects.forEach((s) => m.set(s.id, s));
    return m;
  }, [subjects]);

  const teacherMap = useMemo(() => {
    const m = new Map<number, TeacherRow>();
    teachers.forEach((t) => m.set(t.id, t));
    return m;
  }, [teachers]);

  function normalizeTeachingRow(t: TeachingRow) {
    const c = t.class ?? classMap.get(t.classId) ?? null;
    const s = t.subject ?? subjectMap.get(t.subjectId) ?? null;
    const te = t.teacher ?? teacherMap.get(t.teacherId) ?? null;

    return {
      ...t,
      class: c ? { id: c.id, name: c.name, year: c.year } : null,
      subject: s ? { id: s.id, name: s.name } : null,
      teacher: te ? { id: te.id, name: te.name } : null,
    };
  }

  async function refreshAll() {
    setLoading(true);
    setErr(null);
    try {
      const [c, s, t, ta] = await Promise.all([
        adminListClasses(),
        adminListSubjects(),
        adminListUsers({ role: "TEACHER", isActive: true }),
        adminListTeachingAssignments(),
      ]);

      setClasses(c as any);
      setSubjects(s as any);
      setTeachers(t as any);

      // normalize after we set maps (we'll normalize again in memo below)
      setTeachings(ta as any);

      // set default selections (if empty)
      const firstClass = (c as any[])[0]?.id ?? 0;
      const firstSub = (s as any[])[0]?.id ?? 0;
      const firstTeacher = (t as any[])[0]?.id ?? 0;

      setClassId((prev) => prev || firstClass);
      setSubjectId((prev) => prev || firstSub);
      setTeacherId((prev) => prev || firstTeacher);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredTeachings = useMemo(() => {
    const norm = teachings.map(normalizeTeachingRow);

    const needle = q.trim().toLowerCase();
    if (!needle) return norm;

    return norm.filter((x) => {
      const c = x.class ? `${x.class.name} ${x.class.year}` : "";
      const s = x.subject?.name ?? "";
      const t = x.teacher?.name ?? "";
      const all = `${x.id} ${c} ${s} ${t}`.toLowerCase();
      return all.includes(needle);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teachings, q, classMap, subjectMap, teacherMap]);

  async function onAssign(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!classId || !subjectId || !teacherId) {
      setErr("Class, Subject, and Teacher are required");
      return;
    }

    try {
      await adminAssignTeacher({
        classId: Number(classId),
        subjectId: Number(subjectId),
        teacherId: Number(teacherId),
      });
      await refreshAll();
    } catch (e: any) {
      setErr(e?.message ?? "Assign failed");
    }
  }

  async function onUnassign(id: number) {
    const ok = confirm("Unassign this teaching assignment?");
    if (!ok) return;

    setErr(null);
    try {
      await adminUnassignTeacher(id);
      await refreshAll();
    } catch (e: any) {
      setErr(e?.message ?? "Unassign failed");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Teaching Assignments</h1>
        <p className="text-sm text-gray-500">
          Assign a teacher to a class and subject.
        </p>
      </div>

      {err ? (
        <div className="border border-red-200 bg-red-50 text-red-700 rounded-lg p-3 text-sm">
          {err}
        </div>
      ) : null}

      {/* Assign Form */}
      <form
        onSubmit={onAssign}
        className="border rounded-lg p-4 bg-white space-y-3"
      >
        <div className="font-semibold">Assign Teacher</div>

        <div className="grid gap-3 sm:grid-cols-4">
          <Field label="Class">
            <select
              className="border rounded px-3 py-2 text-sm w-full"
              value={classId}
              onChange={(e) => setClassId(Number(e.target.value))}
            >
              <option value={0}>Select class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.year}) {c.isActive === false ? "• inactive" : ""}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Subject">
            <select
              className="border rounded px-3 py-2 text-sm w-full"
              value={subjectId}
              onChange={(e) => setSubjectId(Number(e.target.value))}
            >
              <option value={0}>Select subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Teacher">
            <select
              className="border rounded px-3 py-2 text-sm w-full"
              value={teacherId}
              onChange={(e) => setTeacherId(Number(e.target.value))}
            >
              <option value={0}>Select teacher</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (#{t.id})
                </option>
              ))}
            </select>
          </Field>

          <div className="flex items-end">
            <Btn type="submit" disabled={loading}>
              Assign
            </Btn>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          Tip: kalau BE kamu menolak duplikasi (class+subject already assigned),
          FE akan tampilkan error dari server.
        </div>
      </form>

      {/* Table */}
      <div className="border rounded-lg bg-white overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between gap-3 flex-wrap">
          <div className="font-semibold">All Teaching Assignments</div>
          <div className="flex gap-2 items-center">
            <input
              className="border rounded px-3 py-2 text-sm w-[260px]"
              placeholder="Search..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <Btn variant="ghost" onClick={refreshAll}>
              Refresh
            </Btn>
          </div>
        </div>

        {loading ? (
          <div className="p-4">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="p-3">ID</th>
                <th className="p-3">Class</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Teacher</th>
                <th className="p-3 w-[140px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachings.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="p-3">{t.id}</td>
                  <td className="p-3">
                    {t.class
                      ? `${t.class.name} (${t.class.year})`
                      : `#${t.classId}`}
                  </td>
                  <td className="p-3">
                    {t.subject?.name ?? `#${t.subjectId}`}
                  </td>
                  <td className="p-3">
                    {t.teacher?.name ?? `#${t.teacherId}`}
                  </td>
                  <td className="p-3">
                    <Btn variant="danger" onClick={() => onUnassign(t.id)}>
                      Unassign
                    </Btn>
                  </td>
                </tr>
              ))}

              {filteredTeachings.length === 0 ? (
                <tr>
                  <td className="p-3 text-gray-500" colSpan={5}>
                    No teaching assignments
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        )}
      </div>
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
