"use client";

import React from "react";
import type { AttendanceStatus } from "@/types/teacher";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function AttendanceTools({
  q,
  onQ,
  filter,
  onFilter,
  bulkSet,
  onBulkSet,
  onApply,
  shown,
  total,
}: {
  q: string;
  onQ: (v: string) => void;

  filter: "ALL" | AttendanceStatus;
  onFilter: (v: "ALL" | AttendanceStatus) => void;

  bulkSet: "" | AttendanceStatus;
  onBulkSet: (v: "" | AttendanceStatus) => void;

  onApply: () => void;

  shown: number;
  total: number;
}) {
  return (
    <Card
      title="Tools"
      description="Cari siswa, filter status, dan bulk set status."
    >
      <div className="grid gap-3 sm:grid-cols-3 items-end">
        <div>
          <Input
            value={q}
            onChange={(e) => onQ(e.target.value)}
            placeholder="Search student..."
          />
        </div>

        <div>
          <Select
            value={filter as any}
            onChange={(e) => onFilter(e.target.value as any)}
          >
            <option value="ALL">All status</option>
            <option value="HADIR">HADIR</option>
            <option value="IZIN">IZIN</option>
            <option value="SAKIT">SAKIT</option>
            <option value="ALPHA">ALPHA</option>
          </Select>
        </div>

        <div className="flex gap-2">
          <Select
            value={bulkSet}
            onChange={(e) => onBulkSet(e.target.value as any)}
          >
            <option value="">Bulk set…</option>
            <option value="HADIR">HADIR</option>
            <option value="IZIN">IZIN</option>
            <option value="SAKIT">SAKIT</option>
            <option value="ALPHA">ALPHA</option>
          </Select>
          <Button onClick={onApply}>Apply</Button>
        </div>

        <div className="sm:col-span-3 text-sm text-slate-600">
          Showing <b>{shown}</b> of <b>{total}</b> students
        </div>
      </div>
    </Card>
  );
}
