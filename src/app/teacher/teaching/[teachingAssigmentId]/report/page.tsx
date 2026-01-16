"use client";
import {
  exportGradeReport,
  getGradeReport,
} from "@/services/teacher/teacher-teaching.service";
import { Assignment, StudentReport } from "@/types/assignment";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function GradeReportPage() {
  const params = useParams();
  const teachingAssigmentId = Number(params.teachingAssigmentId);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGradeReport(teachingAssigmentId)
      .then(setData)
      .finally(() => setLoading(false));
  }, [teachingAssigmentId]);

  if (loading) return <div>Loading report...</div>;
  if (!data) return <div>Report not found</div>;

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">
            Grade Report - {data.className}
          </h1>
          <p className="text-sm text-gray-500">
            Total assignments: {data.assignments.length}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => exportGradeReport(teachingAssigmentId, "csv")}
            className="px-3 py-1 bg-gray-700 text-white rounded text-sm"
          >
            Export CSV
          </button>
          <button
            onClick={() => exportGradeReport(teachingAssigmentId, "xlsx")}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm"
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Student</th>
              {data.assignments.map((a: Assignment) => (
                <th key={a.id} className="px-3 py-2 text-center">
                  {a.title}
                </th>
              ))}
              <th className="px-3 py-2 text-center">Average</th>
            </tr>
          </thead>
          <tbody>
            {data.students.map((s: StudentReport) => (
              <tr key={s.studentId} className="border-t">
                <td className="px-3 py-2">{s.studentName}</td>

                {s.assignments.map((a) => (
                  <td key={a.assignmentId} className="px-3 py-2 text-center">
                    {a.score ?? "-"}
                  </td>
                ))}

                <td className="px-3 py-2 text-center font-semibold">
                  {s.average ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GradeReportPage;
