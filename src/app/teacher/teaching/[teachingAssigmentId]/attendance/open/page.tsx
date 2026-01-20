"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { OpenAttendanceSessionDto } from "@/types/teacher";
import { openAttendanceSession } from "@/services/teacher/teacher.service";

import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

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

function OpenAttendanceSessionPage() {
  const params = useParams();
  const router = useRouter();
  const teachingAssigmentId = Number(params.teachingAssigmentId);

  const defaults = useMemo(() => {
    const open = new Date();
    open.setMinutes(open.getMinutes() + 5);
    open.setSeconds(0, 0);

    const close = new Date(open);
    close.setMinutes(close.getMinutes() + 60);

    return {
      openAt: toLocalDateTimeInputValue(open),
      closeAt: toLocalDateTimeInputValue(close),
    };
  }, []);

  const [name, setName] = useState("");
  const [openAtLocal, setOpenAtLocal] = useState(defaults.openAt);
  const [closeAtLocal, setCloseAtLocal] = useState(defaults.closeAt);

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
          ← Back
        </Link>
      </Card>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!openAtLocal || !closeAtLocal) {
      setError("openAt dan closeAt wajib diisi");
      return;
    }

    const openAtIso = localInputToIso(openAtLocal);
    const closeAtIso = localInputToIso(closeAtLocal);

    if (new Date(openAtIso) >= new Date(closeAtIso)) {
      setError("openAt harus sebelum closeAt");
      return;
    }

    const payload: OpenAttendanceSessionDto = {
      teachingAssigmentId,
      name: name.trim() ? name.trim() : undefined,
      openAt: openAtIso,
      closeAt: closeAtIso,
    };

    try {
      setLoading(true);
      await openAttendanceSession(payload);
      router.push(`/teacher/teaching/${teachingAssigmentId}/attendance`);
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? e?.error ?? "Gagal membuka session");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Open Attendance Session"
        subtitle={`Teaching ID: ${teachingAssigmentId}`}
        right={
          <Link href={`/teacher/teaching/${teachingAssigmentId}/attendance`}>
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
          title="Session details"
          description="Atur nama dan rentang waktu session."
        >
          <div className="space-y-4">
            <Field label="Name (optional)" hint="Contoh: Pertemuan 1">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama session"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Open at">
                <Input
                  type="datetime-local"
                  value={openAtLocal}
                  onChange={(e) => setOpenAtLocal(e.target.value)}
                />
              </Field>

              <Field label="Close at">
                <Input
                  type="datetime-local"
                  value={closeAtLocal}
                  onChange={(e) => setCloseAtLocal(e.target.value)}
                />
              </Field>
            </div>

            <div className="text-xs text-slate-500">
              Catatan: waktu yang kamu input dianggap waktu lokal dan akan
              dikirim ke server sebagai ISO (UTC).
            </div>
          </div>
        </Card>

        <div className="flex items-center gap-2">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Opening..." : "Open session"}
          </Button>

          <Link href={`/teacher/teaching/${teachingAssigmentId}/attendance`}>
            <Button type="button">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
export default OpenAttendanceSessionPage;
