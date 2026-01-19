"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CreateClasses({
  createName,
  setCreateName,
  createYear,
  setCreateYear,
  onSubmit,
}: {
  createName: string;
  setCreateName: (v: string) => void;
  createYear: number;
  setCreateYear: (v: number) => void;
  onSubmit: () => Promise<void>;
}) {
  return (
    <Card title="Create Class" description="Create a new class (name + year).">
      <form
        className="grid gap-3 sm:grid-cols-3"
        onSubmit={async (e) => {
          e.preventDefault();
          await onSubmit();
        }}
      >
        <Field label="Name">
          <Input
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            required
          />
        </Field>

        <Field label="Year">
          <Input
            type="number"
            value={createYear}
            onChange={(e) => setCreateYear(Number(e.target.value))}
            required
          />
        </Field>

        <div className="flex items-end justify-end sm:col-span-1">
          <Button type="submit" variant="primary">
            Create
          </Button>
        </div>
      </form>
    </Card>
  );
}
