"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import StudentNavbar from "@/components/student-navbar";
import { StudentAssignmentDetail } from "@/types/student";
import {
  getAssignmentDetail,
  submitAssignment,
} from "@/services/student/student.service";

export default function AssignmentDetailPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const router = useRouter();

  const [data, setData] = useState<StudentAssignmentDetail | null>(null);
  const [fileUrl, setFileUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAssignmentDetail(Number(assignmentId))
      .then(setData)
      .catch(() => setError("Gagal memuat assignment"));
  }, [assignmentId]);

  async function handleSubmit() {
    if (!fileUrl) {
      return setError("File URL wajib diisi");
    }

    try {
      setSubmitting(true);
      await submitAssignment(Number(assignmentId), fileUrl);
      router.refresh();
    } catch (e: any) {
      setError(e.message ?? "Gagal submit assignment");
    } finally {
      setSubmitting(false);
    }
  }

  if (!data) return <div>Loading...</div>;

  const isLate = new Date(data.dueDate) < new Date();

  return (
    <div>
      <StudentNavbar />

      <div className="p-6 max-w-2xl space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold">{data.title}</h1>
          <p className="text-gray-600">
            {data.subjectName} • {data.teacherName}
          </p>
          <p className="text-sm mt-1">
            Due: {new Date(data.dueDate).toLocaleString()}
          </p>

          {isLate && (
            <p className="text-red-600 text-sm mt-1">Deadline sudah lewat</p>
          )}
        </div>

        {/* DESCRIPTION */}
        <div className="prose max-w-none">
          <p>{data.description}</p>
        </div>

        {/* SUBMISSION STATUS */}
        {data.submission ? (
          <div className="border rounded p-4 space-y-2">
            <p className="font-medium text-green-700">
              Assignment sudah dikumpulkan
            </p>

            <p className="text-sm">
              Submitted at:{" "}
              {new Date(data.submission.submittedAt).toLocaleString()}
            </p>

            <a
              href={data.submission.fileUrl}
              target="_blank"
              className="text-blue-600 underline text-sm"
            >
              Lihat File
            </a>

            {data.submission.score !== null && (
              <p className="font-medium">Score: {data.submission.score}</p>
            )}
          </div>
        ) : (
          <div className="border rounded p-4 space-y-4">
            <h3 className="font-medium">Submit Assignment</h3>

            <input
              type="text"
              placeholder="File URL (Google Drive / S3)"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              className="border p-2 w-full"
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={submitting || isLate}
              className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
