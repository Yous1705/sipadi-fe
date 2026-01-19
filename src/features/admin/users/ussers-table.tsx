"use client";

import React, { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRow } from "@/types/admin";
import { paginate, Pagination } from "@/components/ui/pagination";

export function UsersTable({
  loading,
  rows,
  totalRows,
  onPickReset,
}: {
  loading: boolean;
  rows: UserRow[];
  totalRows: number;
  onPickReset: (id: number) => void;
}) {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const paged = useMemo(() => paginate(rows, page, pageSize), [rows, page]);

  React.useEffect(() => {
    if (page > paged.totalPages) setPage(1);
  }, [paged.totalPages]);
  return (
    <Card title="Users" description={`Showing ${rows.length} / ${totalRows}`}>
      {loading ? (
        <div className="text-sm text-slate-500">Loading...</div>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr className="text-left">
                <th className="p-3">No</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Active</th>
                <th className="p-3 w-[140px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {paged.slice.map((u, index) => (
                <tr key={u.id} className="border-t border-slate-200">
                  <td className="p-3">{paged.startIndex + index + 1}</td>
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3">{String(u.isActive)}</td>
                  <td className="p-3">
                    <Button variant="ghost" onClick={() => onPickReset(u.id)}>
                      Reset PW
                    </Button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td className="p-3 text-slate-500" colSpan={6}>
                    No users
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
