"use client";

import React, { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubjectRow } from "@/types/admin";
import { paginate, Pagination } from "@/components/ui/pagination";

export function SubjectsTable({
  loading,
  rows,
  q,
  setQ,
  activeOnly,
  setActiveOnly,
  onEdit,
  onDelete,
  onRefresh,
}: {
  loading: boolean;
  rows: SubjectRow[];
  q: string;
  setQ: (v: string) => void;
  activeOnly: boolean;
  setActiveOnly: (v: boolean) => void;
  onEdit: (row: SubjectRow) => void;
  onDelete: (id: number) => void;
  onRefresh: () => void;
}) {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const paged = useMemo(() => paginate(rows, page, pageSize), [rows, page]);

  React.useEffect(() => {
    if (page > paged.totalPages) setPage(1);
  }, [paged.totalPages]);

  return (
    <Card
      title="Subjects"
      description={`Total: ${rows.length}`}
      action={
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onRefresh}>
            Refresh
          </Button>
          <Button variant="ghost" onClick={() => setQ("")} disabled={!q}>
            Clear
          </Button>
        </div>
      }
    >
      <div className="grid gap-3 sm:grid-cols-3 mb-4">
        <Field label="Search">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name/id..."
          />
        </Field>

        <Field label="Active filter">
          <Select
            value={activeOnly ? "active" : "all"}
            onChange={(e) => setActiveOnly(e.target.value === "active")}
          >
            <option value="all">All</option>
            <option value="active">Active only</option>
          </Select>
        </Field>

        <div className="hidden sm:block" />
      </div>

      {loading ? (
        <div className="text-sm text-slate-500">Loading...</div>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr className="text-left">
                <th className="p-3">No</th>
                <th className="p-3">Name</th>
                <th className="p-3">Active</th>
                <th className="p-3 w-[220px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.slice.map((s, index) => (
                <tr
                  key={s.id}
                  className="border-t border-slate-200 hover:bg-slate-50"
                >
                  <td className="p-3">{paged.startIndex + index + 1}</td>
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-medium text-slate-900">{s.name}</td>
                  <td className="p-3">
                    <div className="flex gap-2 flex-wrap">
                      <Button variant="ghost" onClick={() => onEdit(s)}>
                        Edit
                      </Button>
                      <Button variant="danger" onClick={() => onDelete(s.id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-3 text-slate-500">
                    No subjects found
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
          <div className="mt-4">
            <Pagination
              page={paged.page}
              totalPages={paged.totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
