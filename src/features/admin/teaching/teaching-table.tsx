"use client";

import React, { useMemo, useState } from "react";
import type { ClassRow, SubjectRow, TeachingRow, UserRow } from "@/types/admin";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { paginate, Pagination } from "@/components/ui/pagination";

export function TeachingTable({
  loading,
  rows,
  selectedId,
  onSelect,
  onUnassign,

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

  onRefresh,
}: {
  loading: boolean;
  rows: TeachingRow[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onUnassign: (id: number) => void;

  teachers: UserRow[];
  classes: ClassRow[];
  subjects: SubjectRow[];

  q: string;
  setQ: (v: string) => void;
  teacherId: number;
  setTeacherId: (v: number) => void;
  classId: number;
  setClassId: (v: number) => void;
  subjectId: number;
  setSubjectId: (v: number) => void;

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
      title="Teaching Assignments"
      description={`Total: ${rows.length}`}
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
      <div className="grid gap-3 sm:grid-cols-4 mb-4">
        <Field label="Search">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search teacher/class/subject..."
          />
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

        <Field label="Class">
          <Select
            value={classId}
            onChange={(e) => setClassId(Number(e.target.value))}
          >
            <option value={0}>All</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.year})
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
      </div>

      {loading ? (
        <div className="text-sm text-slate-500">Loading...</div>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr className="text-left">
                <th className="p-3">No</th>
                <th className="p-3">Teacher</th>
                <th className="p-3">Class</th>
                <th className="p-3">Subject</th>
                <th className="p-3 w-[240px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.slice.map((r, index) => {
                const isSelected = selectedId === r.id;
                const teacherName = r.teacher?.name ?? `#${r.teacherId}`;
                const classText = r.class
                  ? `${r.class.name} (${r.class.year})`
                  : `#${r.classId}`;
                const subjectName = r.subject?.name ?? `#${r.subjectId}`;

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
                    <td className="p-3">{teacherName}</td>
                    <td className="p-3">{classText}</td>
                    <td className="p-3">{subjectName}</td>
                    <td className="p-3">
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          variant={isSelected ? "primary" : "outline"}
                          onClick={() => onSelect(r.id)}
                        >
                          {isSelected ? "Selected" : "Select"}
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => onUnassign(r.id)}
                        >
                          Unassign
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-3 text-slate-500">
                    No teaching assignments found
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
