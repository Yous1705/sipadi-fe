"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ClassRow } from "@/types/admin";

export function CreateStudent({
  activeClasses,
  sName,
  setSName,
  sEmail,
  setSEmail,
  sPassword,
  setSPassword,
  sClassId,
  setSClassId,
  onSubmit,
}: {
  activeClasses: ClassRow[];
  sName: string;
  setSName: (v: string) => void;
  sEmail: string;
  setSEmail: (v: string) => void;
  sPassword: string;
  setSPassword: (v: string) => void;
  sClassId: number;
  setSClassId: (v: number) => void;
  onSubmit: () => Promise<void>;
}) {
  return (
    <Card
      title="Create Student"
      description="Student needs to be assigned to a class."
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await onSubmit();
        }}
        className="grid gap-3 sm:grid-cols-2"
      >
        <Field label="Name">
          <Input
            value={sName}
            onChange={(e) => setSName(e.target.value)}
            required
          />
        </Field>

        <Field label="Email">
          <Input
            type="email"
            value={sEmail}
            onChange={(e) => setSEmail(e.target.value)}
            required
          />
        </Field>

        <Field label="Password">
          <Input
            type="password"
            value={sPassword}
            onChange={(e) => setSPassword(e.target.value)}
            required
          />
        </Field>

        <Field label="Class">
          <Select
            value={sClassId}
            onChange={(e) => setSClassId(Number(e.target.value))}
            required
          >
            <option value={0}>Select class</option>
            {activeClasses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.year})
              </option>
            ))}
          </Select>
        </Field>

        <div className="flex items-end">
          <Button type="submit" variant="primary" className="w-full sm:w-auto">
            Create Student
          </Button>
        </div>
      </form>
    </Card>
  );
}
