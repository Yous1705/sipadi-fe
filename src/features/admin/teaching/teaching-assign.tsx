"use client";

import React from "react";
import type { ClassRow, SubjectRow, UserRow } from "@/types/admin";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function TeachingAssign({
  teachers,
  classes,
  subjects,
  cTeacherId,
  setCTeacherId,
  cClassId,
  setCClassId,
  cSubjectId,
  setCSubjectId,
  onSubmit,
}: {
  teachers: UserRow[];
  classes: ClassRow[];
  subjects: SubjectRow[];
  cTeacherId: number;
  setCTeacherId: (v: number) => void;
  cClassId: number;
  setCClassId: (v: number) => void;
  cSubjectId: number;
  setCSubjectId: (v: number) => void;
  onSubmit: () => Promise<void>;
}) {
  return (
    <Card
      title="Assign Teacher"
      description="Bind Teacher + Class + Subject into a teaching assignment."
    >
      <form
        className="grid gap-3 sm:grid-cols-3"
        onSubmit={async (e) => {
          e.preventDefault();
          await onSubmit();
        }}
      >
        <Field label="Teacher">
          <Select
            value={cTeacherId}
            onChange={(e) => setCTeacherId(Number(e.target.value))}
          >
            <option value={0}>Select teacher</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Class">
          <Select
            value={cClassId}
            onChange={(e) => setCClassId(Number(e.target.value))}
          >
            <option value={0}>Select class</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.year})
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Subject">
          <Select
            value={cSubjectId}
            onChange={(e) => setCSubjectId(Number(e.target.value))}
          >
            <option value={0}>Select subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </Field>

        <div className="sm:col-span-3 flex justify-end">
          <Button type="submit" variant="primary">
            Assign
          </Button>
        </div>
      </form>
    </Card>
  );
}
