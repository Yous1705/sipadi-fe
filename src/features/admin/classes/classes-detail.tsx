"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ClassRow, UserRow } from "@/types/admin";

export function ClassesDetail({
  selectedClass,
  teachers,
  selectedTeacherId,
  setSelectedTeacherId,
  onAssignHomeroom,

  editingRow,
  editName,
  setEditName,
  editYear,
  setEditYear,
  editActive,
  setEditActive,
  onSaveEdit,
  onCancelEdit,

  studentsLoading,
  studentsErr,
  students,
  activeClasses,
  moveMap,
  setMoveMap,
  onMoveStudent,
  onRemoveStudent,
}: {
  selectedClass: ClassRow | null;

  teachers: UserRow[];
  selectedTeacherId: number;
  setSelectedTeacherId: (v: number) => void;
  onAssignHomeroom: () => Promise<void>;

  editingRow: ClassRow | null;
  editName: string;
  setEditName: (v: string) => void;
  editYear: number;
  setEditYear: (v: number) => void;
  editActive: boolean;
  setEditActive: (v: boolean) => void;
  onSaveEdit: () => Promise<void>;
  onCancelEdit: () => void;

  studentsLoading: boolean;
  studentsErr: string | null;
  students: UserRow[];
  activeClasses: ClassRow[];
  moveMap: Record<number, number>;
  setMoveMap: (v: Record<number, number>) => void;
  onMoveStudent: (studentId: number) => Promise<void>;
  onRemoveStudent: (studentId: number) => Promise<void>;
}) {
  return (
    <div className="space-y-4">
      <Card
        title="Selected Class"
        description={
          selectedClass
            ? `Class #${selectedClass.id}`
            : "Select a class from table."
        }
      >
        {!selectedClass ? (
          <div className="text-sm text-slate-500">No class selected.</div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="font-semibold text-slate-900">
                {selectedClass.name}
              </div>
              <div className="text-sm text-slate-600">
                Year: {selectedClass.year} • Active:{" "}
                {String(selectedClass.isActive !== false)}
              </div>
              <div className="text-sm text-slate-600">
                Homeroom: {selectedClass.homeroomTeacher?.name ?? "-"}
              </div>
            </div>

            <div className="grid gap-2">
              <Field label="Assign homeroom teacher">
                <div className="flex gap-2">
                  <Select
                    value={selectedTeacherId}
                    onChange={(e) =>
                      setSelectedTeacherId(Number(e.target.value))
                    }
                  >
                    <option value={0}>Select teacher</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </Select>
                  <Button variant="primary" onClick={() => onAssignHomeroom()}>
                    Assign
                  </Button>
                </div>
              </Field>
            </div>
          </div>
        )}
      </Card>

      <Card
        title="Edit Class"
        description="Update name, year, and active status."
      >
        {!editingRow ? (
          <div className="text-sm text-slate-500">
            Klik tombol <b>Edit</b> dari tabel.
          </div>
        ) : (
          <form
            className="grid gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              await onSaveEdit();
            }}
          >
            <Field label="Name">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </Field>

            <Field label="Year">
              <Input
                type="number"
                value={editYear}
                onChange={(e) => setEditYear(Number(e.target.value))}
                required
              />
            </Field>

            <Field label="Active">
              <Select
                value={String(editActive)}
                onChange={(e) => setEditActive(e.target.value === "true")}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </Select>
            </Field>

            <div className="flex gap-2">
              <Button type="submit" variant="primary">
                Save
              </Button>
              <Button type="button" variant="ghost" onClick={onCancelEdit}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Card>

      <Card
        title="Students"
        description="Move or remove students from this class."
      >
        {!selectedClass ? (
          <div className="text-sm text-slate-500">
            Select a class to see students.
          </div>
        ) : studentsLoading ? (
          <div className="text-sm text-slate-500">Loading students...</div>
        ) : (
          <div className="space-y-3">
            {studentsErr ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {studentsErr}
              </div>
            ) : null}

            <div className="text-sm text-slate-600">
              Total students: <b>{students.length}</b>
            </div>

            <div className="space-y-2">
              {students.map((s) => (
                <div
                  key={s.id}
                  className="rounded-lg border border-slate-200 bg-white p-3 flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="font-medium text-slate-900">{s.name}</div>
                    <div className="text-xs text-slate-500">{s.email}</div>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center justify-end">
                    <Select
                      value={moveMap[s.id] ?? 0}
                      onChange={(e) =>
                        setMoveMap({
                          ...moveMap,
                          [s.id]: Number(e.target.value),
                        })
                      }
                    >
                      <option value={0}>Move to...</option>
                      {activeClasses
                        .filter((c) => c.id !== selectedClass.id)
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.year})
                          </option>
                        ))}
                    </Select>

                    <Button
                      variant="outline"
                      onClick={() => onMoveStudent(s.id)}
                    >
                      Move
                    </Button>

                    <Button
                      variant="danger"
                      onClick={() => onRemoveStudent(s.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}

              {students.length === 0 ? (
                <div className="text-sm text-slate-500">
                  No students in this class.
                </div>
              ) : null}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
