"use client";
import { createAssignment } from "@/services/teacher/teacher-teaching.service";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

function CreateAssignmentPage() {
  const param = useParams();
  const router = useRouter();
  const teachingAssigmentId = Number(param.teachingAssigmentId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !dueDate) {
      setError("Title dan due date wajib diisi");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await createAssignment({
        title,
        description,
        dueDate: new Date(dueDate).toISOString(),
        teachingAssigmentId: teachingAssigmentId,
      });
      router.push(`/teacher/teaching/${teachingAssigmentId}/assignments`);
    } catch {
      setError("Gagal membuat assignment");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="p-6 max-w-xl space-y-6">
      <h1 className="text-xl font-semibold">create Assignment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            className="border rounded w-full px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            className="border rounded w-full px-3 py-2"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Due Date</label>
          <input
            type="datetime-local"
            className="border rounded w-full px-3 py-2"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <button
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Savinng..." : "Save"}
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                `/teacher/teaching/${teachingAssigmentId}/assignments`
              )
            }
            className="border px-4 py-2 rounded"
          >
            {" "}
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateAssignmentPage;
