"use client";

import { useCallback, useMemo, useState } from "react";
import type { Assignment, Submission } from "@/types/teacher";
import {
  closeAssignment,
  deleteAssignment,
  getAssignmentById2,
  getSubmissionsByAssignment,
  gradeSubmission,
  publishAssignment,
  resetGrade,
} from "@/services/teacher/teacher.service";
import type { GradeState } from "@/features/teacher/assignment/submission-card";

function pickErr(e: any) {
  return e?.message ?? e?.error ?? "Terjadi kesalahan";
}

export type EditGradeState = Record<number, GradeState>;

export function useAssignment(assignmentId: number) {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [gradeState, setGradeState] = useState<EditGradeState>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const title = useMemo(() => assignment?.title ?? "Assignment", [assignment]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [a, subs] = await Promise.all([
        getAssignmentById2(assignmentId),
        getSubmissionsByAssignment(assignmentId),
      ]);

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
    } catch (e) {
      setError(pickErr(e));
    } finally {
      setLoading(false);
    }
  }, [assignmentId]);

  const refreshSubmissions = useCallback(async () => {
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
  }, [assignmentId]);

  const onPublish = useCallback(async () => {
    if (!assignment) return;
    try {
      const updated = await publishAssignment(assignment.id);
      setAssignment(updated);
    } catch (e) {
      alert(pickErr(e));
    }
  }, [assignment]);

  const onClose = useCallback(async () => {
    if (!assignment) return;
    try {
      const updated = await closeAssignment(assignment.id);
      setAssignment(updated);
    } catch (e) {
      alert(pickErr(e));
    }
  }, [assignment]);

  const onDelete = useCallback(async () => {
    if (!assignment) return;
    const ok = confirm("Hapus assignment ini? (soft delete)");
    if (!ok) return;
    try {
      await deleteAssignment(assignment.id);
      return true;
    } catch (e) {
      alert(pickErr(e));
      return false;
    }
  }, [assignment]);

  const onGrade = useCallback(
    async (submissionId: number) => {
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
    },
    [gradeState, refreshSubmissions],
  );

  const onReset = useCallback(
    async (submissionId: number) => {
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
    },
    [refreshSubmissions],
  );

  function patchGrade(submissionId: number, patch: Partial<GradeState>) {
    setGradeState((p) => ({
      ...p,
      [submissionId]: {
        ...(p[submissionId] ?? {
          score: "",
          feedback: "",
          loading: false,
          error: null,
        }),
        ...patch,
      },
    }));
  }

  return {
    assignment,
    submissions,
    gradeState,
    loading,
    error,
    title,

    load,
    refreshSubmissions,

    onPublish,
    onClose,
    onDelete,

    onGrade,
    onReset,
    patchGrade,
  };
}
