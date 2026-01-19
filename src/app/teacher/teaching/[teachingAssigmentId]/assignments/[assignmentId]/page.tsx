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

import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GradeState,
  SubmissionCard,
} from "@/features/teacher/assignment/submission-card";
import { AssignmentStatus } from "@/features/teacher/assignment/status";

type EditGradeState = Record<number, GradeState>;

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
        next[s.id] = {
          score: s.score?.toString() ?? "",
          feedback: s.feedback ?? "",
          loading: false,
          error: null,
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
    return (
      <Card
        title="Invalid params"
        description="teachingAssigmentId / assignmentId tidak valid."
      >
        <Link
          href={`/teacher/teaching/${teachingAssigmentId || ""}/assignments`}
          className="text-sm text-slate-600 hover:underline"
        >
          ← Back
        </Link>
      </Card>
    );
  }

  if (loading) return <div className="text-sm text-slate-500">Loading...</div>;

  if (error) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
          {error}
        </div>
        <Link
          href={`/teacher/teaching/${teachingAssigmentId}/assignments`}
          className="text-sm text-slate-600 hover:underline"
        >
          ← Back
        </Link>
      </div>
    );
  }

  if (!assignment) {
    return (
      <Card title="Not found" description="Assignment tidak ditemukan.">
        <Link
          href={`/teacher/teaching/${teachingAssigmentId}/assignments`}
          className="text-sm text-slate-600 hover:underline"
        >
          ← Back
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title={title}
        subtitle={`Due: ${new Date(assignment.dueDate).toLocaleString()}`}
        right={
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="primary" onClick={onPublish}>
              Publish
            </Button>
            <Button onClick={onClose}>Close</Button>
            <Button variant="danger" onClick={onDelete}>
              Delete
            </Button>
          </div>
        }
      />

      <Card
        title="Overview"
        description={`Policy: ${assignment.submissionPolicy} • Max: ${assignment.maxFileSizeMb}MB${
          assignment.allowedMime ? ` • Mime: ${assignment.allowedMime}` : ""
        }`}
        action={<AssignmentStatus value={String(assignment.status)} />}
      >
        <div className="text-sm text-slate-700 whitespace-pre-wrap">
          {assignment.description ?? "-"}
        </div>
      </Card>

      <Card
        title="Submissions"
        description={
          !submissions.length
            ? "No submissions yet"
            : `${submissions.length} submission(s)`
        }
        action={<Button onClick={refreshSubmissions}>Refresh</Button>}
      >
        {!submissions.length ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
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

              return (
                <SubmissionCard
                  key={s.id}
                  s={s}
                  state={st}
                  onChange={(patch) =>
                    setGradeState((p) => ({
                      ...p,
                      [s.id]: { ...p[s.id], ...patch },
                    }))
                  }
                  onSave={() => onGrade(s.id)}
                  onReset={() => onReset(s.id)}
                />
              );
            })}
          </div>
        )}

        <div className="pt-3">
          <Link
            href={`/teacher/teaching/${teachingAssigmentId}/assignments`}
            className="text-sm text-slate-600 hover:underline"
          >
            ← Back to Assignments
          </Link>
        </div>
      </Card>
    </div>
  );
}
