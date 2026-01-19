"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CreateAssignmentDto, SubmissionPolicy } from "@/types/teacher";
import { createAssignment } from "@/services/teacher/teacher.service";

import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

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
    return (
      <Card
        title="Invalid params"
        description="teachingAssigmentId tidak valid."
      >
        <Link
          href="/teacher"
          className="text-sm text-slate-600 hover:underline"
        >
          ← Kembali
        </Link>
      </Card>
    );
  }

  const fileEnabled = submissionPolicy !== "URL_ONLY";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) return setError("Judul wajib diisi");
    if (!dueDateLocal) return setError("Due date wajib diisi");

    if (
      (submissionPolicy === "FILE_ONLY" ||
        submissionPolicy === "URL_OR_FILE") &&
      maxFileSizeMb <= 0
    ) {
      return setError("Max file size harus lebih dari 0");
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
      router.push(`/teacher/teaching/${teachingAssigmentId}/assignments`);
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? e?.error ?? "Gagal membuat assignment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Create Assignment"
        subtitle={`Teaching #${teachingAssigmentId}`}
        right={
          <Link href={`/teacher/teaching/${teachingAssigmentId}/assignments`}>
            <Button>Back</Button>
          </Link>
        }
      />

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
          {error}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-4">
        <Card
          title="Details"
          description="Basic information for this assignment."
        >
          <div className="space-y-4">
            <Field label="Title" hint="Contoh: Tugas 1 - Essay">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul tugas"
              />
            </Field>

            <Field
              label="Description (optional)"
              hint="Instruksi, format jawaban, atau rubric."
            >
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={[
                  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900",
                  "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400",
                  "min-h-[120px]",
                ].join(" ")}
                placeholder="Instruksi tugas..."
              />
            </Field>

            <Field
              label="Due date"
              hint="Disimpan ke server dalam format ISO (UTC)."
            >
              <Input
                type="datetime-local"
                value={dueDateLocal}
                onChange={(e) => setDueDateLocal(e.target.value)}
              />
            </Field>
          </div>
        </Card>

        <Card
          title="Submission settings"
          description="How students submit their work."
        >
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Submission policy">
                <Select
                  value={submissionPolicy}
                  onChange={(e) =>
                    setSubmissionPolicy(e.target.value as SubmissionPolicy)
                  }
                >
                  <option value="URL_ONLY">URL only</option>
                  <option value="FILE_ONLY">File only</option>
                  <option value="URL_OR_FILE">URL or File</option>
                </Select>
              </Field>

              <Field
                label="Max file size (MB)"
                hint={
                  !fileEnabled
                    ? "Tidak dipakai karena policy URL only."
                    : undefined
                }
              >
                <Input
                  type="number"
                  min={1}
                  value={maxFileSizeMb}
                  onChange={(e) => setMaxFileSizeMb(Number(e.target.value))}
                  disabled={!fileEnabled}
                />
              </Field>
            </div>

            <Field
              label="Allowed MIME (optional)"
              hint={
                !fileEnabled
                  ? "Tidak dipakai karena policy URL only."
                  : 'Contoh: "application/pdf,image/png"'
              }
            >
              <Input
                value={allowedMime}
                onChange={(e) => setAllowedMime(e.target.value)}
                placeholder='Contoh: "application/pdf,image/png"'
                disabled={!fileEnabled}
              />
            </Field>
          </div>
        </Card>

        <div className="flex items-center gap-2">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Saving..." : "Create"}
          </Button>

          <Link href={`/teacher/teaching/${teachingAssigmentId}/assignments`}>
            <Button type="button">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
