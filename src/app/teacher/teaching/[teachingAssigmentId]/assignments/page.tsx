"use client";
import AssignmentStatusAction from "@/components/assignment-status-actionn";
import {
  deleteAssignment,
  getAssignmetsByTeaching,
} from "@/services/teacher/teacher-teaching.service";
import { Assignment } from "@/types/assignment";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function AssignmentPage() {
  const param = useParams();
  const teachingAssigmentId = Number(param.teachingAssigmentId);

  const [assignment, setAssignment] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAssignmetsByTeaching(teachingAssigmentId)
      .then(setAssignment)
      .catch(() => setError("Gagal memuat tugas"))
      .finally(() => setLoading(false));
  });

  const handleDelete = async (id: number) => {
    const ok = confirm("Yakin ingin menghapus assignment ini?");
    if (!ok) return;

    await deleteAssignment(id);
    setAssignment((prev) => prev.filter((a) => a.id !== id));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Assignments</h1>
        <Link
          href={`/teacher/teaching/${teachingAssigmentId}/report`}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
        >
          Report
        </Link>
        <Link
          href={`/teacher/teaching/${teachingAssigmentId}/assignments/create`}
          className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          + Tambah
        </Link>
      </header>

      {assignment.length === 0 && <EmptyState />}

      <div className="space-y-3">
        {assignment.map((a) => (
          <div
            key={a.id}
            className="relative flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm hover:shadow transition"
          >
            <Link
              href={`/teacher/assignments/${a.id}`}
              className="flex-1 space-y-1"
            >
              <p className="font-medium text-gray-900">{a.title}</p>
              <p className="text-sm text-gray-500">
                Due {new Date(a.dueDate).toLocaleDateString()}
              </p>
            </Link>

            <div className="relative">
              <AssignmentStatusAction
                assignmentId={a.id}
                status={a.status}
                onUpdated={() =>
                  getAssignmetsByTeaching(teachingAssigmentId).then(
                    setAssignment
                  )
                }
              />
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleDelete(a.id);
              }}
              className="ml-4 text-sm text-red-600 hover:underline"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border rounded p-8 text-center text-gray-500">
      Belum ada assignment untuk kelas ini
    </div>
  );
}

export default AssignmentPage;
