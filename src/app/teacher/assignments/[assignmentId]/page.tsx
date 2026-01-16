"use client";

import { SubmissionRow } from "@/components/grade-function";
import {
  getAssignmentDetail,
  updateAssignment,
} from "@/services/teacher/teacher-teaching.service";
import { AssignmentDetail } from "@/types/assignment";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function Page() {
  const params = useParams();
  const assignmentId = Number(params.assignmentId);

  const [assignment, setAssignment] = useState<AssignmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // edit state
  const [editing, setEditing] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDueDate, setFormDueDate] = useState("");

  useEffect(() => {
    if (!assignmentId) return;

    setLoading(true);
    getAssignmentDetail(assignmentId)
      .then((data) => {
        setAssignment(data);

        setFormTitle(data.title);
        setFormDescription(data.description ?? "");
        setFormDueDate(toLocalDatetime(data.dueDate));
      })
      .catch(() => setError("Gagal memuat tugas"))
      .finally(() => setLoading(false));
  }, [assignmentId]);

  function toLocalDatetime(value: string) {
    const d = new Date(value);
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().slice(0, 16);
  }

  async function handleUpdate() {
    if (!assignment) return;
    if (!formTitle.trim()) {
      alert("Judul wajib diisi");
      return;
    }

    try {
      await updateAssignment(assignment.id, {
        title: formTitle,
        description: formDescription,
        dueDate: formDueDate ? new Date(formDueDate).toISOString() : undefined,
      });

      const refreshed = await getAssignmentDetail(assignment.id);
      setAssignment(refreshed);
      setEditing(false);
      alert("Assignment berhasil diperbarui");
    } catch (e) {
      console.error(e);
      alert("Gagal memperbarui assignment");
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!assignment) return <div>Assignment not found</div>;

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* HEADER */}
      <header className="space-y-2">
        {!editing ? (
          <>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-semibold">{assignment.title}</h1>
                <p className="text-sm text-gray-500">
                  Due {new Date(assignment.dueDate).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="px-3 py-1 text-sm bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
            </div>

            <p className="text-gray-700">{assignment.description || "-"}</p>
          </>
        ) : (
          <div className="space-y-3 border rounded p-4 bg-gray-50">
            <div>
              <label className="text-sm font-medium">Judul</label>
              <input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Deskripsi</label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={4}
                className="w-full border rounded px-2 py-1"
                placeholder="Deskripsi tugas"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Due Date</label>
              <input
                type="datetime-local"
                value={formDueDate}
                onChange={(e) => setFormDueDate(e.target.value)}
                className="border rounded px-2 py-1"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Simpan
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </header>

      {/* SUBMISSIONS */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Submissions</h2>

        {assignment.submissions.length === 0 ? (
          <p className="text-gray-500">Belum ada submission</p>
        ) : (
          <div className="border rounded divide-y">
            {assignment.submissions.map((s) => (
              <SubmissionRow
                key={s.id}
                submission={s}
                refresh={() =>
                  getAssignmentDetail(assignmentId).then(setAssignment)
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Page;
