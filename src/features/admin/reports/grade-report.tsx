"use client";

import React, { useMemo, useState } from "react";
import type { GradeReportResponse } from "@/types/report";
import { Card } from "@/components/ui/card";
import { paginate, Pagination } from "@/components/ui/pagination";

export function GradeReport({ report }: { report: GradeReportResponse }) {
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
    <Card
      title={`Grade Report: ${report.className}`}
      description={`Teaching #${report.teachingId} • Students: ${report.students.length} • Assignments: ${report.assignments.length}`}
    >
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr className="text-left">
              <th className="p-3 w-14">No</th>
              <th className="p-3">Student</th>
              {report.assignments.map((a) => (
                <th key={a.id} className="p-3">
                  {a.title}
                </th>
              ))}
              <th className="p-3">Average</th>
            </tr>
          </thead>

          <tbody>
            {paged.slice.map((st, idx) => (
              <tr
                key={st.studentId}
                className="border-t border-slate-200 hover:bg-slate-50"
              >
                <td className="p-3">{paged.startIndex + idx + 1}</td>
                <td className="p-3 font-medium text-slate-900">
                  {st.studentName}
                </td>

                {report.assignments.map((a) => {
                  const item = st.assignments.find(
                    (x) => x.assignmentId === a.id,
                  );
                  return (
                    <td key={a.id} className="p-3">
                      {item ? item.score : "-"}
                    </td>
                  );
                })}

                <td className="p-3">{st.average ?? "-"}</td>
              </tr>
            ))}

            {paged.slice.length === 0 ? (
              <tr>
                <td
                  colSpan={3 + report.assignments.length}
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
  );
}
