"use client";

import React from "react";
import type { AttendanceStatus } from "@/types/teacher";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RowDraft } from "./use-Attendance-session";
import { ReportTable } from "../report/report-table";

export function AttendanceTable({
  rows,
  drafts,
  bulkLoading,
  onDraft,
  onSaveRow,
}: {
  rows: Array<{
    studentId: number;
    name: string;
    attendanceId?: number | null;
    status?: AttendanceStatus | null;
    note?: string | null;
  }>;
  drafts: Record<number, RowDraft>;
  bulkLoading: boolean;
  onDraft: (studentId: number, patch: Partial<RowDraft>) => void;
  onSaveRow: (studentId: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="font-semibold text-slate-900">Attendance list</div>
      <div className="text-sm text-slate-600">
        Edit status/note lalu simpan per baris atau bulk.
      </div>

      <ReportTable footer={`Rows: ${rows.length}`}>
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-slate-50 text-slate-700">
            <tr>
              <th className="text-left font-semibold px-3 py-2 border-b w-[280px]">
                Student
              </th>
              <th className="text-left font-semibold px-3 py-2 border-b w-[160px]">
                Status
              </th>
              <th className="text-left font-semibold px-3 py-2 border-b">
                Note
              </th>
              <th className="text-right font-semibold px-3 py-2 border-b w-[120px]">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((s) => {
              const d = drafts[s.studentId] ?? { status: "", note: "" };
              const disabled = !!d.saving || bulkLoading;

              return (
                <tr
                  key={s.studentId}
                  className="odd:bg-white even:bg-slate-50 align-top"
                >
                  <td className="px-3 py-2 border-b">
                    <div className="font-medium text-slate-900">{s.name}</div>
                    <div className="text-xs text-slate-500">
                      attendanceId: {s.attendanceId ?? "-"}
                    </div>
                    {d.error ? (
                      <div className="text-xs text-red-700 mt-1">{d.error}</div>
                    ) : null}
                  </td>

                  <td className="px-3 py-2 border-b">
                    <Select
                      value={d.status}
                      onChange={(e) =>
                        onDraft(s.studentId, {
                          status: e.target.value as any,
                          error: null,
                        })
                      }
                      disabled={disabled}
                    >
                      <option value="">Pilih...</option>
                      <option value="HADIR">HADIR</option>
                      <option value="IZIN">IZIN</option>
                      <option value="SAKIT">SAKIT</option>
                      <option value="ALPHA">ALPHA</option>
                    </Select>
                  </td>

                  <td className="px-3 py-2 border-b">
                    <Input
                      value={d.note}
                      onChange={(e) =>
                        onDraft(s.studentId, {
                          note: e.target.value,
                          error: null,
                        })
                      }
                      placeholder="Catatan (optional)"
                      disabled={disabled}
                    />
                  </td>

                  <td className="px-3 py-2 border-b text-right">
                    <Button
                      variant="primary"
                      onClick={() => onSaveRow(s.studentId)}
                      disabled={disabled}
                    >
                      {d.saving ? "Saving..." : "Save"}
                    </Button>
                  </td>
                </tr>
              );
            })}

            {!rows.length ? (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-slate-600">
                  Tidak ada siswa yang cocok dengan filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </ReportTable>
    </div>
  );
}
