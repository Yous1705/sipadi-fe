"use client";

import React from "react";
import { Submission } from "@/types/teacher";
import { toFileUrl } from "@/lib/fileUrl";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type GradeState = {
  score: string;
  feedback: string;
  loading: boolean;
  error: string | null;
};

export function SubmissionCard({
  s,
  state,
  onChange,
  onSave,
  onReset,
}: {
  s: Submission;
  state: GradeState;
  onChange: (patch: Partial<GradeState>) => void;
  onSave: () => void;
  onReset: () => void;
}) {
  const fileHref = toFileUrl(s.fileUrl);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-semibold text-slate-900 truncate">
            {s.student?.name ?? `Student #${s.studentId}`}
          </div>
          <div className="text-xs text-slate-500">
            Submitted: {new Date(s.createdAt).toLocaleString()}
          </div>

          <div className="text-sm mt-2 space-y-1 text-slate-700">
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

        <span className="shrink-0 text-xs px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-700">
          Score: {s.score ?? "-"}
        </span>
      </div>

      {/* grading panel */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Score" hint="angka (contoh: 90)">
          <Input
            value={state.score}
            onChange={(e) => onChange({ score: e.target.value })}
            placeholder="0 - 100"
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Feedback (optional)">
            <input
              value={state.feedback}
              onChange={(e) => onChange({ feedback: e.target.value })}
              className={[
                "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900",
                "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400",
              ].join(" ")}
              placeholder="Optional feedback..."
            />
          </Field>
        </div>
      </div>

      {state.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-2 text-sm">
          {state.error}
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <Button variant="primary" disabled={state.loading} onClick={onSave}>
          {state.loading ? "Saving..." : "Save grade"}
        </Button>
        <Button disabled={state.loading} onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
