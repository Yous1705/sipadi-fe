"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { StudentAssignmentDetail, SubmissionKind } from "@/types/student";
import {
  submitAssignmentFile,
  submitAssignmentUrl,
} from "@/services/student/student.service";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Status } from "@/features/student/status";

function pickErr(e: any) {
  return e?.message ?? e?.error ?? "Gagal submit";
}

export function SubmissionForm({
  data,
  onSubmitted,
}: {
  data: StudentAssignmentDetail;
  onSubmitted: () => Promise<void>;
}) {
  const policy = data.submissionPolicy;

  const hasSubmission = !!data.submission;
  const due = new Date(data.dueDate);
  const isLate = Date.now() > due.getTime();

  const initialKind: SubmissionKind = useMemo(() => {
    if (policy === "URL_ONLY") return "URL";
    if (policy === "FILE_ONLY") return "FILE";
    return data.submission?.kind ?? "URL";
  }, [policy, data.submission?.kind]);

  const [kind, setKind] = useState<SubmissionKind>(initialKind);
  const [url, setUrl] = useState(data.submission?.url ?? "");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canPickKind = policy === "URL_OR_FILE";
  const allowUrl = policy === "URL_ONLY" || policy === "URL_OR_FILE";
  const allowFile = policy === "FILE_ONLY" || policy === "URL_OR_FILE";

  useEffect(() => {
    const nextKind: SubmissionKind =
      policy === "URL_ONLY"
        ? "URL"
        : policy === "FILE_ONLY"
          ? "FILE"
          : (data.submission?.kind ?? "URL");

    setKind(nextKind);
    setUrl(data.submission?.url ?? "");
    setFile(null);
    setError(null);
  }, [
    data.submission?.id,
    data.submission?.kind,
    data.submission?.url,
    policy,
  ]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      if (
        policy === "URL_ONLY" ||
        (policy === "URL_OR_FILE" && kind === "URL")
      ) {
        const u = url.trim();
        if (!u) {
          setError("URL wajib diisi");
          return;
        }
        await submitAssignmentUrl(data.id, u);
        await onSubmitted();
        return;
      }

      if (
        policy === "FILE_ONLY" ||
        (policy === "URL_OR_FILE" && kind === "FILE")
      ) {
        if (!file) {
          setError("File wajib dipilih");
          return;
        }

        const mb = file.size / (1024 * 1024);
        if (data.maxFileSizeMb && mb > data.maxFileSizeMb) {
          setError(
            `Ukuran file terlalu besar. Maksimal ${data.maxFileSizeMb}MB`,
          );
          return;
        }

        await submitAssignmentFile(data.id, file);
        await onSubmitted();
        setFile(null);
        return;
      }

      setError("Submission policy tidak valid");
    } catch (e) {
      setError(pickErr(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <Status tone="gray">Policy: {policy}</Status>
        <Status tone="gray">Max file: {data.maxFileSizeMb}MB</Status>
        {isLate ? (
          <Status tone="rose">Late</Status>
        ) : (
          <Status tone="green">On time</Status>
        )}
        {hasSubmission ? (
          <Status tone="blue">Already submitted</Status>
        ) : (
          <Status tone="amber">Not submitted</Status>
        )}
      </div>

      {canPickKind ? (
        <Field label="Submission type">
          <Select
            value={kind}
            onChange={(e) => setKind(e.target.value as SubmissionKind)}
            disabled={loading}
          >
            <option value="URL">URL</option>
            <option value="FILE">File</option>
          </Select>
        </Field>
      ) : null}

      {/* URL */}
      {allowUrl && (policy === "URL_ONLY" || kind === "URL") ? (
        <Field label="Submission URL" hint="Pastikan link dapat diakses.">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            disabled={loading}
          />
        </Field>
      ) : null}

      {/* FILE */}
      {allowFile && (policy === "FILE_ONLY" || kind === "FILE") ? (
        <Field label="Upload file" hint={`Maksimal ${data.maxFileSizeMb}MB`}>
          <input
            type="file"
            disabled={loading}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-md file:border file:border-slate-200 file:bg-white file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-slate-50"
          />
          {file ? (
            <div className="text-xs text-slate-500 mt-1">
              Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)}MB)
            </div>
          ) : null}
        </Field>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
          {error}
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading
            ? "Submitting..."
            : hasSubmission
              ? "Update submission"
              : "Submit"}
        </Button>
      </div>
    </form>
  );
}
