import { Attendance, AttendanceStatus } from "@/types/attendance";
import React from "react";

function AttendanceTable({
  attendances,
  onUpdate,
}: {
  attendances: Attendance[];
  onUpdate: (
    attendanceId: number,
    status: AttendanceStatus,
    note?: string
  ) => void;
}) {
  return (
    <table className="w-full border rounded">
      <thead>
        <tr>
          <th className="border p-2 text-left">Student</th>
          <th className="border p-2">Status</th>
          <th className="border p-2">Note</th>
        </tr>
      </thead>
      <tbody>
        {attendances.map((a) => (
          <tr key={a.id}>
            <td className="border p-2">{a.student.name}</td>
            <td className="border p-2">
              <select
                defaultValue={a.status}
                onChange={(e) =>
                  onUpdate(a.id, e.target.value as AttendanceStatus)
                }
              >
                <option value="HADIR">Hadir</option>
                <option value="IZIN">Izin</option>
                <option value="SAKIT">Sakit</option>
              </select>
            </td>
            <td className="border p-2">
              <input
                className="border px-2 py-1 w-full"
                defaultValue={a.note ?? ""}
                onBlur={(e) => onUpdate(a.id, a.status, e.target.value)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AttendanceTable;
