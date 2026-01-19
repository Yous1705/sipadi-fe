"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AttendanceRow } from "@/types/admin";

export function EditAttendance({
  row,
  editStatus,
  setEditStatus,
  onSave,
  onCancel,
}: {
  row: AttendanceRow | null;
  editStatus: "HADIR" | "IZIN" | "SAKIT" | "ALPHA";
  setEditStatus: (v: "HADIR" | "IZIN" | "SAKIT" | "ALPHA") => void;
  onSave: () => Promise<void>;
  onCancel: () => void;
}) {
  const ta = row?.attendanceSession?.teachingAssigment;
  const cls = ta?.class;
  const subj = ta?.subject;
  const tch = ta?.teacher;

  return (
    <Card title="Edit Attendance" description="Update attendance status.">
      {!row ? (
        <div className="text-sm text-slate-500">
          Klik Edit pada row di tabel.
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
              Student: <b>{row.student?.name ?? "-"}</b>
            </div>
            <div className="text-xs text-slate-500">
              {row.attendanceSession?.name ?? "-"} •{" "}
              {cls ? `${cls.name} (${cls.year})` : "-"} • {subj?.name ?? "-"} •{" "}
              {tch?.name ?? "-"}
            </div>
          </div>

          <Field label="Status">
            <Select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as any)}
            >
              <option value="HADIR">HADIR</option>
              <option value="IZIN">IZIN</option>
              <option value="SAKIT">SAKIT</option>
              <option value="ALPHA">ALPHA</option>
            </Select>
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
