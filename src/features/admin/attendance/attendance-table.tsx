"use client";

import React, { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { AttendanceRow } from "@/types/admin";
import { paginate, Pagination } from "@/components/ui/pagination";

function fmt(dt?: string) {
  if (!dt) return "-";
  try {
    return new Date(dt).toLocaleString();
  } catch {
    return dt;
  }
}

export function AttendancesTable({
  loading,
  rows,
  selectedId,
  onSelect,

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

  onRefresh,
}: {
  loading: boolean;
  rows: AttendanceRow[];
  selectedId: number | null;
  onSelect: (id: number) => void;

  classes: { id: number; name: string; year?: number }[];
  subjects: { id: number; name: string }[];
  teachers: { id: number; name: string }[];

  classId: number;
  setClassId: (v: number) => void;
  subjectId: number;
  setSubjectId: (v: number) => void;
  teacherId: number;
  setTeacherId: (v: number) => void;
  status: string;
  setStatus: (v: string) => void;

  q: string;
  setQ: (v: string) => void;

  onRefresh: () => void;
}) {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const paged = useMemo(() => paginate(rows, page, pageSize), [rows, page]);

  React.useEffect(() => {
    if (page > paged.totalPages) setPage(1);
  }, [paged.totalPages]);
  return (
    <Card
      title="Attendances"
      description={`Showing ${rows.length}`}
      action={
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onRefresh}>
            Refresh
          </Button>
          <Button variant="ghost" onClick={() => setQ("")} disabled={!q}>
            Clear
          </Button>
        </div>
      }
    >
      <div className="grid gap-3 sm:grid-cols-5 mb-4">
        <Field label="Search">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="student / session / class / subject / teacher..."
          />
        </Field>

        <Field label="Class">
          <Select
            value={classId}
            onChange={(e) => setClassId(Number(e.target.value))}
          >
            <option value={0}>All</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.year ? ` (${c.year})` : ""}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Subject">
          <Select
            value={subjectId}
            onChange={(e) => setSubjectId(Number(e.target.value))}
          >
            <option value={0}>All</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Teacher">
          <Select
            value={teacherId}
            onChange={(e) => setTeacherId(Number(e.target.value))}
          >
            <option value={0}>All</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Status">
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="HADIR">HADIR</option>
            <option value="IZIN">IZIN</option>
            <option value="SAKIT">SAKIT</option>
            <option value="ALPHA">ALPHA</option>
          </Select>
        </Field>
      </div>

      {loading ? (
        <div className="text-sm text-slate-500">Loading...</div>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr className="text-left">
                <th className="p-3 w-14">No</th>
                <th className="p-3">Student</th>
                <th className="p-3">Session</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created</th>
                <th className="p-3 w-[140px]">Action</th>
              </tr>
            </thead>

            <tbody>
              {paged.slice.map((r, index) => {
                const isSelected = selectedId === r.id;
                const ta = r.attendanceSession?.teachingAssigment;

                return (
                  <tr
                    key={r.id}
                    className={[
                      "border-t border-slate-200",
                      isSelected ? "bg-blue-50" : "hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <td className="p-3">{paged.startIndex + index + 1}</td>
                    <td className="p-3">{index + 1}</td>

                    <td className="p-3">
                      <div className="font-medium text-slate-900">
                        {r.student?.name ?? "-"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {r.student?.email ?? ""}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-medium text-slate-900">
                        {r.attendanceSession?.name ??
                          `Session #${r.attendanceSessionId ?? "-"}`}
                      </div>
                      <div className="text-xs text-slate-500">
                        {r.attendanceSession?.openAt
                          ? `Open: ${fmt(r.attendanceSession.openAt)}`
                          : ""}
                      </div>
                    </td>

                    <td className="p-3">{r.status}</td>
                    <td className="p-3">{fmt(r.createdAt)}</td>

                    <td className="p-3">
                      <Button
                        variant={isSelected ? "primary" : "outline"}
                        onClick={() => onSelect(r.id)}
                      >
                        {isSelected ? "Selected" : "Edit"}
                      </Button>
                    </td>
                  </tr>
                );
              })}

              {rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-3 text-slate-500">
                    No attendances found
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
          <div className="mt-4">
            <Pagination
              page={paged.page}
              totalPages={paged.totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
