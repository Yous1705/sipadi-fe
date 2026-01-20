"use client";

import React from "react";
import Link from "next/link";
import type { Submission } from "@/types/teacher";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  SubmissionCard,
  GradeState,
} from "@/features/teacher/assignment/submission-card";

export function SubmissionsSection({
  submissions,
  gradeState,
  onPatch,
  onSave,
  onReset,
  onRefresh,
  teachingAssigmentId,
}: {
  submissions: Submission[];
  gradeState: Record<number, GradeState>;
  onPatch: (submissionId: number, patch: Partial<GradeState>) => void;
  onSave: (submissionId: number) => void;
  onReset: (submissionId: number) => void;
  onRefresh: () => void;
  teachingAssigmentId: number;
}) {
  return (
    <Card
      title="Submissions"
      description={
        !submissions.length
          ? "No submissions yet"
          : `${submissions.length} submission(s)`
      }
      action={<Button onClick={onRefresh}>Refresh</Button>}
    >
      {!submissions.length ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
          Belum ada submission.
        </div>
      ) : (
        <div className="space-y-2">
          {submissions.map((s) => {
            const st =
              gradeState[s.id] ??
              ({
                score: "",
                feedback: "",
                loading: false,
                error: null,
              } as GradeState);

            return (
              <SubmissionCard
                key={s.id}
                s={s}
                state={st}
                onChange={(patch) => onPatch(s.id, patch)}
                onSave={() => onSave(s.id)}
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
  );
}
