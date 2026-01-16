"use client";
import React from "react";
import { AttendanceStudentList } from "@/types/attendance";

export default function StudentRow({
  student,
  sessionActive,
  onChangeStatus,
  onChangeNote,
  onSave,
}: {
  student: AttendanceStudentList;
  sessionActive: boolean;
  onChangeStatus: (
    id: number,
    status: AttendanceStudentList["status"] | ""
  ) => void;
  onChangeNote: (id: number, note?: string | null) => void;
  onSave: () => void;
}) {
  return (
    <tr className="border-t">
      <td className="p-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div
            className={`px-2 py-1 rounded-full text-xs ${
              student.status === "HADIR"
                ? "bg-green-100 text-green-800"
                : student.status === "IZIN"
                ? "bg-yellow-100 text-yellow-800"
                : student.status === "SAKIT"
                ? "bg-orange-100 text-orange-800"
                : student.status === "ALPHA"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {student.status || "-"}
          </div>
          <div>
            <div className="font-medium">{student.studentName}</div>
            <div className="text-xs text-gray-400">ID: {student.studentId}</div>
          </div>
        </div>
      </td>
      <td className="p-2 text-center">
        <select
          value={student.status ?? ""}
          disabled={!sessionActive}
          onChange={(e) =>
            onChangeStatus(
              student.studentId,
              e.target.value as AttendanceStudentList["status"]
            )
          }
          className={`border rounded px-2 py-1 ${
            !student.attendanceId &&
            (student.status === "" || student.status === undefined)
              ? "text-gray-500 italic"
              : ""
          }`}
        >
          <option value="">Belum absen</option>
          <option value="HADIR">Hadir</option>
          <option value="IZIN">Izin</option>
          <option value="SAKIT">Sakit</option>
          <option value="ALPHA">Alpha</option>
        </select>
      </td>
      <td className="p-2">
        <div className="space-y-1">
          <input
            type="text"
            value={student.note ?? ""}
            disabled={!sessionActive}
            onChange={(e) => onChangeNote(student.studentId, e.target.value)}
            className="border rounded px-2 py-1 w-full"
            placeholder="Catatan (opsional)"
          />
          {!student.attendanceId &&
            (student.status === "" || student.status === undefined) && (
              <p className="text-xs text-gray-400 italic">
                Belum melakukan absen — status tidak akan tersimpan sampai
                dipilih
              </p>
            )}
        </div>
      </td>
      <td className="p-2 text-center">
        {sessionActive ? (
          <button
            onClick={onSave}
            className="px-3 py-1 bg-indigo-600 text-white rounded"
          >
            {student.attendanceId ? "Update" : "Simpan"}
          </button>
        ) : (
          <span className="text-xs text-gray-400">Tidak aktif</span>
        )}
      </td>
    </tr>
  );
}
