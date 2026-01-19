"use client";

import React, { useMemo, useState } from "react";
import type { ClassReportResponse } from "@/types/report";
import { Card } from "@/components/ui/card";
import { paginate, Pagination } from "@/components/ui/pagination";

export function ClassReport({ report }: { report: ClassReportResponse }) {
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const paged = useMemo(
    () => paginate(report.students, page, pageSize),
    [report.students, page],
  );

  React.useEffect(() => {
    if (page > paged.totalPages) setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paged.totalPages]);

  return (
    <div className="space-y-4">
      <Card
        title={`Class Report: ${report.className}`}
        description={`Students: ${report.students.length} • Subjects: ${report.subjects.length}`}
      >
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr className="text-left">
                <th className="p-3 w-14">No</th>
                <th className="p-3">Student</th>
                {report.subjects.map((s) => (
                  <th key={s.id} className="p-3">
                    {s.name}
                  </th>
                ))}
                <th className="p-3">Overall</th>
                <th className="p-3">Grade</th>
                <th className="p-3">Rank</th>
                <th className="p-3">H</th>
                <th className="p-3">I</th>
                <th className="p-3">S</th>
                <th className="p-3">A</th>
              </tr>
            </thead>

            <tbody>
              {paged.slice.map((st, idx) => (
                <tr
                  key={st.studentId}
                  className="border-t border-slate-200 hover:bg-slate-50"
                >
                  <td className="p-3">{paged.startIndex + idx + 1}</td>
                  <td className="p-3 font-medium text-slate-900">{st.name}</td>

                  {report.subjects.map((sub) => {
                    const g = st.grades.find((x) => x.subjectId === sub.id);
                    return (
                      <td key={sub.id} className="p-3">
                        {g?.average ?? "-"}
                      </td>
                    );
                  })}

                  <td className="p-3">{st.overallAverage ?? "-"}</td>
                  <td className="p-3">{st.overallGrade ?? "-"}</td>
                  <td className="p-3">{st.rank ?? "-"}</td>

                  <td className="p-3">{st.attendance.HADIR}</td>
                  <td className="p-3">{st.attendance.IZIN}</td>
                  <td className="p-3">{st.attendance.SAKIT}</td>
                  <td className="p-3">{st.attendance.ALPHA}</td>
                </tr>
              ))}

              {paged.slice.length === 0 ? (
                <tr>
                  <td
                    colSpan={10 + report.subjects.length}
                    className="p-3 text-slate-500"
                  >
                    No students
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <Pagination
            page={paged.page}
            totalPages={paged.totalPages}
            onPageChange={setPage}
          />
        </div>
      </Card>

      <Card title="Subject Summary" description="Class average per subject.">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr className="text-left">
                <th className="p-3 w-14">No</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Class Average</th>
                <th className="p-3">Grade</th>
              </tr>
            </thead>
            <tbody>
              {report.subjects.map((s, idx) => (
                <tr
                  key={s.id}
                  className="border-t border-slate-200 hover:bg-slate-50"
                >
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3 font-medium text-slate-900">{s.name}</td>
                  <td className="p-3">{s.classAverage ?? "-"}</td>
                  <td className="p-3">{s.grade ?? "-"}</td>
                </tr>
              ))}
              {report.subjects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-3 text-slate-500">
                    No subjects
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
