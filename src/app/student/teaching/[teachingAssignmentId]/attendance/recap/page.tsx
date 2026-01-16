"use client";
import { getMyAttendance } from "@/services/student/student.service";
import { StudentAttendance } from "@/types/student";
import React, { useEffect, useState } from "react";

function AttendancePage() {
  const [data, setData] = useState<StudentAttendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyAttendance()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <div>Loading...</div>;
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Attendance Summary</h1>

      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.subject} className="border rounded-lg p-4">
            <div className="mb-3">
              <p className="font-semibold">{item.subject}</p>
              <p className="text-sm text-gray-600">{item.teacher}</p>
            </div>

            <div className="grid grid-cols-5 gap-2 text-center text-sm">
              <Stat label="Hadir" value={item.attendance.HADIR} />
              <Stat label="Izin" value={item.attendance.IZIN} />
              <Stat label="Sakit" value={item.attendance.SAKIT} />
              <Stat label="Alpha" value={item.attendance.ALPHA} />
              <Stat label="Total" value={item.totalSession} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border p-2">
      <p className="font-medium">{value}</p>
      <p className="text-xs text-gray-600">{label}</p>
    </div>
  );
}
export default AttendancePage;
