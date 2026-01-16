"use client";
import {
  exportClassReport,
  getClassReport,
} from "@/services/teacher/teacher-teaching.service";
import {
  ClassReportResponse,
  ClassReportStudent,
  ClassReportSubject,
} from "@/types/report";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function page() {
  const params = useParams();
  const classId = Number(params.classId);

  const [data, setData] = useState<ClassReportResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classId) return;
    getClassReport(classId)
      .then(setData)
      .finally(() => setLoading(false));
  }, [classId]);

  const handleExport = async (format: "csv" | "xlsx") => {
    const blob = await exportClassReport(classId, format);
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `class-report.${format}`;
    a.click();

    window.URL.revokeObjectURL(url);
  };
  if (loading) return <p>Loading...</p>;
  if (!data) return <p>Data not found</p>;
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          Class Report – {data.className}
        </h1>

        <div className="space-x-2">
          <button
            onClick={() => handleExport("xlsx")}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Export Excel
          </button>
          <button
            onClick={() => handleExport("csv")}
            className="px-4 py-2 bg-gray-600 text-white rounded"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-auto border rounded">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Nama</th>
              {data.subjects.map((s: ClassReportSubject) => (
                <th key={s.id} className="p-2 border">
                  {s.name}
                </th>
              ))}
              <th className="p-2 border">Average</th>
              <th className="p-2 border">Rank</th>
              <th className="p-2 border">Hadir</th>
              <th className="p-2 border">Izin</th>
              <th className="p-2 border">Sakit</th>
              <th className="p-2 border">Alpha</th>
            </tr>
          </thead>

          <tbody>
            {data.students.map((s: ClassReportStudent) => (
              <tr key={s.studentId} className="text-center">
                <td className="p-2 border text-left">{s.name}</td>

                {data.subjects.map((sub) => {
                  const grade = s.grades.find((g) => g.subjectId === sub.id);
                  return (
                    <td key={sub.id} className="p-2 border">
                      {grade?.average ?? "-"}
                    </td>
                  );
                })}

                <td className="p-2 border">{s.overallAverage ?? "-"}</td>
                <td className="p-2 border">{s.rank ?? "-"}</td>
                <td className="p-2 border">{s.attendance.HADIR}</td>
                <td className="p-2 border">{s.attendance.IZIN}</td>
                <td className="p-2 border">{s.attendance.SAKIT}</td>
                <td className="p-2 border">{s.attendance.ALPHA}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border rounded p-4 bg-gray-50">
        <h2 className="font-semibold mb-2">Class Subject Rating</h2>
        <ul className="list-disc pl-5">
          {data.subjects.map((s) => (
            <li key={s.id}>
              {s.name}: {s.classAverage ?? "-"} ({s.grade ?? "-"})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default page;
