"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Assignment, Submission } from "@/types/teacher";
import {
  closeAssignment,
  deleteAssignment,
  getAssignmentById2,
  getSubmissionsByAssignment,
  gradeSubmission,
  publishAssignment,
  resetGrade,
} from "@/services/teacher/teacher.service";
import { toFileUrl } from "@/lib/fileUrl";
import TeacherNavbar from "@/components/teacher-navbar";

type EditGradeState = Record<
  number,
  { score: string; feedback: string; loading: boolean; error: string | null }
>;

function pickErr(e: any) {
  return e?.message ?? e?.error ?? "Terjadi kesalahan";
}

export default function TeacherAssignmentDetailPage() {
  const params = useParams();
  const teachingAssigmentId = Number(params.teachingAssigmentId);
  const assignmentId = Number(params.assignmentId);

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [gradeState, setGradeState] = useState<EditGradeState>({});

  const title = useMemo(() => assignment?.title ?? "Assignment", [assignment]);

  useEffect(() => {
    if (!assignmentId) return;

    setLoading(true);
    setError(null);

    Promise.all([
      getAssignmentById2(assignmentId),
      getSubmissionsByAssignment(assignmentId),
    ])
      .then(([a, subs]) => {
        setAssignment(a);
        setSubmissions(subs);
        const init: EditGradeState = {};
        subs.forEach((s) => {
          init[s.id] = {
            score: s.score?.toString() ?? "",
            feedback: s.feedback ?? "",
            loading: false,
            error: null,
          };
        });
        setGradeState(init);
      })
      .catch((e) => setError(pickErr(e)))
      .finally(() => setLoading(false));
  }, [assignmentId]);

  async function refreshSubmissions() {
    const subs = await getSubmissionsByAssignment(assignmentId);
    setSubmissions(subs);
    setGradeState((prev) => {
      const next: EditGradeState = { ...prev };
      subs.forEach((s) => {
        if (!next[s.id]) {
          next[s.id] = { score: "", feedback: "", loading: false, error: null };
        }
        next[s.id] = {
          ...next[s.id],
          score: s.score?.toString() ?? "",
          feedback: s.feedback ?? "",
          error: null,
          loading: false,
        };
      });
      return next;
    });
  }

  async function onPublish() {
    if (!assignment) return;
    try {
      const updated = await publishAssignment(assignment.id);
      setAssignment(updated);
    } catch (e) {
      alert(pickErr(e));
    }
  }

  async function onClose() {
    if (!assignment) return;
    try {
      const updated = await closeAssignment(assignment.id);
      setAssignment(updated);
    } catch (e) {
      alert(pickErr(e));
    }
  }

  async function onDelete() {
    if (!assignment) return;
    const ok = confirm("Hapus assignment ini? (soft delete)");
    if (!ok) return;
    try {
      await deleteAssignment(assignment.id);
      window.location.href = `/teacher/teaching/${teachingAssigmentId}/assignments`;
    } catch (e) {
      alert(pickErr(e));
    }
  }

  async function onGrade(submissionId: number) {
    const st = gradeState[submissionId];
    if (!st) return;

    const scoreNum = Number(st.score);
    if (!Number.isFinite(scoreNum)) {
      setGradeState((p) => ({
        ...p,
        [submissionId]: { ...p[submissionId], error: "Score harus angka" },
      }));
      return;
    }

    setGradeState((p) => ({
      ...p,
      [submissionId]: { ...p[submissionId], loading: true, error: null },
    }));

    try {
      await gradeSubmission(submissionId, {
        score: scoreNum,
        feedback: st.feedback?.trim() ? st.feedback.trim() : undefined,
      });
      await refreshSubmissions();
    } catch (e) {
      setGradeState((p) => ({
        ...p,
        [submissionId]: {
          ...p[submissionId],
          loading: false,
          error: pickErr(e),
        },
      }));
    }
  }

  async function onReset(submissionId: number) {
    const ok = confirm("Reset nilai submission ini?");
    if (!ok) return;

    setGradeState((p) => ({
      ...p,
      [submissionId]: { ...p[submissionId], loading: true, error: null },
    }));

    try {
      await resetGrade(submissionId);
      await refreshSubmissions();
    } catch (e) {
      setGradeState((p) => ({
        ...p,
        [submissionId]: {
          ...p[submissionId],
          loading: false,
          error: pickErr(e),
        },
      }));
    }
  }

  if (!teachingAssigmentId || !assignmentId) {
    return <div className="p-6">Invalid params</div>;
  }

  if (loading) return <div className="p-6">Loading...</div>;

  if (error) {
    return (
      <div className="p-6 space-y-4">
        <div className="border border-red-200 bg-red-50 text-red-700 rounded p-4">
          {error}
        </div>
        <Link
          href={`/teacher/teaching/${teachingAssigmentId}/assignments`}
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back
        </Link>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="p-6 space-y-4">
        <div className="border rounded p-6 text-gray-600">
          Assignment tidak ditemukan.
        </div>
        <Link
          href={`/teacher/teaching/${teachingAssigmentId}/assignments`}
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <TeacherNavbar />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold truncate">{title}</h1>
          <div className="text-sm text-gray-600">
            Due: {new Date(assignment.dueDate).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Status: {assignment.status} • Policy: {assignment.submissionPolicy}{" "}
            • Max: {assignment.maxFileSizeMb}MB{" "}
            {assignment.allowedMime ? `• Mime: ${assignment.allowedMime}` : ""}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onPublish}
            className="border rounded px-3 py-2 text-sm hover:bg-gray-50"
          >
            Publish
          </button>
          <button
            onClick={onClose}
            className="border rounded px-3 py-2 text-sm hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={onDelete}
            className="border rounded px-3 py-2 text-sm hover:bg-gray-50"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-2">
        <div className="font-semibold">Description</div>
        <div className="text-sm text-gray-700 whitespace-pre-wrap">
          {assignment.description ?? "-"}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Submissions</div>
          <button
            onClick={refreshSubmissions}
            className="border rounded px-3 py-2 text-sm hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        {!submissions.length ? (
          <div className="border rounded p-6 text-gray-600">
            Belum ada submission.
          </div>
        ) : (
          <div className="space-y-2">
            {submissions.map((s) => {
              const st = gradeState[s.id] ?? {
                score: "",
                feedback: "",
                loading: false,
                error: null,
              };

              const fileHref = toFileUrl(s.fileUrl);

              return (
                <div key={s.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold truncate">
                        {s.student?.name ?? `Student #${s.studentId}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        Submitted: {new Date(s.createdAt).toLocaleString()}
                      </div>

                      <div className="text-sm mt-2 space-y-1">
                        {s.url ? (
                          <div>
                            URL:{" "}
                            <a
                              href={s.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline break-all"
                            >
                              {s.url}
                            </a>
                          </div>
                        ) : null}

                        {fileHref ? (
                          <div>
                            File:{" "}
                            <a
                              href={fileHref}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline break-all"
                            >
                              Download file
                            </a>
                          </div>
                        ) : null}

                        {!s.url && !s.fileUrl ? <div>-</div> : null}
                      </div>
                    </div>

                    <div className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 h-fit">
                      Score: {s.score ?? "-"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <Link
          href={`/teacher/teaching/${teachingAssigmentId}/assignments`}
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back to Assignments
        </Link>
      </div>
    </div>
  );
}
