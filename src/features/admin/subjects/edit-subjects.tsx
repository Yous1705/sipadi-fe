"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SubjectRow } from "@/types/admin";

export function EditSubjects({
  editingRow,
  editName,
  setEditName,
  editActive,
  setEditActive,
  onSave,
  onCancel,
}: {
  editingRow: SubjectRow | null;
  editName: string;
  setEditName: (v: string) => void;
  editActive: boolean;
  setEditActive: (v: boolean) => void;
  onSave: () => Promise<void>;
  onCancel: () => void;
}) {
  return (
    <Card title="Edit Subject" description="Update name or active status.">
      {!editingRow ? (
        <div className="text-sm text-slate-500">
          Klik tombol Edit dari tabel.
        </div>
      ) : (
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            await onSave();
          }}
        >
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="text-sm">
              Subject: <b>{editingRow.name}</b>{" "}
              <span className="text-xs text-slate-500">#{editingRow.id}</span>
            </div>
          </div>

          <Field label="Name">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />
          </Field>

          <div className="flex gap-2">
            <Button type="submit" variant="primary">
              Save
            </Button>
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}
