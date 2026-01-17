"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CreateAssignmentDto, SubmissionPolicy } from "@/types/teacher";
import { createAssignment } from "@/services/teacher/teacher.service";
import TeacherNavbar from "@/components/teacher-navbar";

function toLocalDateTimeInputValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const HH = pad(date.getHours());
  const mm = pad(date.getMinutes());
  return `${yyyy}-${MM}-${dd}T${HH}:${mm}`;
}

function localInputToIso(value: string) {
  const d = new Date(value);
  return d.toISOString();
}

export default function CreateAssignmentPage() {
  const params = useParams();
  const router = useRouter();
  const teachingAssigmentId = Number(params.teachingAssigmentId);

  const defaultDue = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    d.setHours(23, 59, 0, 0);
    return toLocalDateTimeInputValue(d);
  }, []);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDateLocal, setDueDateLocal] = useState(defaultDue);

  const [submissionPolicy, setSubmissionPolicy] =
    useState<SubmissionPolicy>("URL_ONLY");
  const [maxFileSizeMb, setMaxFileSizeMb] = useState<number>(2);
  const [allowedMime, setAllowedMime] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!teachingAssigmentId) {
    return <div className="p-6">Invalid teachingAssigmentId</div>;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Judul wajib diisi");
      return;
    }
    if (!dueDateLocal) {
      setError("Due date wajib diisi");
      return;
    }
    if (
      (submissionPolicy === "FILE_ONLY" ||
        submissionPolicy === "URL_OR_FILE") &&
      maxFileSizeMb <= 0
    ) {
      setError("Max file size harus lebih dari 0");
      return;
    }

    const payload: CreateAssignmentDto = {
      teachingAssigmentId,
      title: title.trim(),
      description: description.trim() ? description.trim() : undefined,
      dueDate: localInputToIso(dueDateLocal),
      submissionPolicy,
      maxFileSizeMb: maxFileSizeMb || 2,
      allowedMime: allowedMime.trim() ? allowedMime.trim() : undefined,
    };

    try {
      setLoading(true);
      await createAssignment(payload);

      // balik ke list assignments
      router.push(`/teacher/teaching/${teachingAssigmentId}/assignments`);
      router.refresh();
    } catch (e: any) {
      const msg = e?.message ?? e?.error ?? "Gagal membuat assignment";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <TeacherNavbar />
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Create Assignment</h1>
          <p className="text-sm text-gray-500">
            Teaching ID: {teachingAssigmentId}
          </p>
        </div>

        <Link
          href={`/teacher/teaching/${teachingAssigmentId}/assignments`}
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back
        </Link>
      </div>

      {error && (
        <div className="border border-red-200 bg-red-50 text-red-700 rounded p-4">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="border rounded-lg p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Contoh: Tugas 1 - Essay"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2 min-h-[100px]"
              placeholder="Instruksi tugas..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Due date</label>
            <input
              type="datetime-local"
              value={dueDateLocal}
              onChange={(e) => setDueDateLocal(e.target.value)}
              className="border rounded px-3 py-2"
            />
            <div className="text-xs text-gray-500 mt-1">
              Disimpan ke server dalam format ISO (UTC).
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">
              Submission policy
            </label>
            <select
              value={submissionPolicy}
              onChange={(e) =>
                setSubmissionPolicy(e.target.value as SubmissionPolicy)
              }
              className="border rounded px-3 py-2"
            >
              <option value="URL_ONLY">URL only</option>
              <option value="FILE_ONLY">File only</option>
              <option value="URL_OR_FILE">URL or File</option>
            </select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">
                Max file size (MB)
              </label>
              <input
                type="number"
                min={1}
                value={maxFileSizeMb}
                onChange={(e) => setMaxFileSizeMb(Number(e.target.value))}
                className="w-full border rounded px-3 py-2"
                disabled={submissionPolicy === "URL_ONLY"}
              />
              {submissionPolicy === "URL_ONLY" && (
                <div className="text-xs text-gray-500 mt-1">
                  Tidak dipakai karena policy URL only.
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Allowed MIME (optional)
              </label>
              <input
                value={allowedMime}
                onChange={(e) => setAllowedMime(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder='Contoh: "application/pdf,image/png"'
                disabled={submissionPolicy === "URL_ONLY"}
              />
              {submissionPolicy === "URL_ONLY" && (
                <div className="text-xs text-gray-500 mt-1">
                  Tidak dipakai karena policy URL only.
                </div>
              )}
            </div>
          </div>

          <div className="text-xs text-gray-500">
            Tips: kalau kamu belum enforce allowedMime di BE, field ini boleh
            dikosongkan.
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="border rounded px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Create"}
          </button>

          <Link
            href={`/teacher/teaching/${teachingAssigmentId}/assignments`}
            className="border rounded px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
