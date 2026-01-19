"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CreateTeacher({
  tName,
  setTName,
  tEmail,
  setTEmail,
  tPassword,
  setTPassword,
  onSubmit,
}: {
  tName: string;
  setTName: (v: string) => void;
  tEmail: string;
  setTEmail: (v: string) => void;
  tPassword: string;
  setTPassword: (v: string) => void;
  onSubmit: () => Promise<void>;
}) {
  return (
    <Card title="Create Teacher" description="Create a teacher account.">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await onSubmit();
        }}
        className="grid gap-3 sm:grid-cols-2"
      >
        <Field label="Name">
          <Input
            value={tName}
            onChange={(e) => setTName(e.target.value)}
            required
          />
        </Field>

        <Field label="Email">
          <Input
            type="email"
            value={tEmail}
            onChange={(e) => setTEmail(e.target.value)}
            required
          />
        </Field>

        <Field label="Password">
          <Input
            type="password"
            value={tPassword}
            onChange={(e) => setTPassword(e.target.value)}
            required
          />
        </Field>

        <div className="flex items-end">
          <Button type="submit" variant="primary" className="w-full sm:w-auto">
            Create Teacher
          </Button>
        </div>
      </form>
    </Card>
  );
}
