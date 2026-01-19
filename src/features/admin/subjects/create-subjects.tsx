"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CreateSubjects({
  createName,
  setCreateName,
  onSubmit,
}: {
  createName: string;
  setCreateName: (v: string) => void;
  onSubmit: () => Promise<void>;
}) {
  return (
    <Card
      title="Create Subject"
      description="Add a new subject (e.g., Math, English)."
    >
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
            placeholder="e.g. Mathematics"
            required
          />
        </Field>

        <div className="sm:col-span-2 flex items-end justify-end">
          <Button type="submit" variant="primary">
            Create
          </Button>
        </div>
      </form>
    </Card>
  );
}
