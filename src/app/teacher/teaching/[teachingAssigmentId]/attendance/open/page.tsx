"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { OpenAttendanceSessionDto } from "@/types/teacher";
import { openAttendanceSession } from "@/services/teacher/teacher.service";
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

export default function OpenAttendanceSessionPage() {
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
    return <div className="p-6">Invalid teachingAssigmentId</div>;
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
    console.log({
      openAtLocal,
      closeAtLocal,
      openAtIso,
      closeAtIso,
      nowIso: new Date().toISOString(),
    });

    try {
      setLoading(true);
      await openAttendanceSession(payload);

      router.push(`/teacher/teaching/${teachingAssigmentId}/attendance`);
      router.refresh();
    } catch (e: any) {
      const msg = e?.message ?? e?.error ?? "Gagal membuka session";
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
          <h1 className="text-xl font-semibold">Open Attendance Session</h1>
          <p className="text-sm text-gray-500">
            Teaching ID: {teachingAssigmentId}
          </p>
        </div>

        <Link
          href={`/teacher/teaching/${teachingAssigmentId}/attendance`}
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
            <label className="block text-sm font-medium mb-1">
              Name (optional)
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Contoh: Pertemuan 1"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Open at</label>
              <input
                type="datetime-local"
                value={openAtLocal}
                onChange={(e) => setOpenAtLocal(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Close at</label>
              <input
                type="datetime-local"
                value={closeAtLocal}
                onChange={(e) => setCloseAtLocal(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="text-xs text-gray-500">
            Catatan: waktu yang kamu input dianggap waktu lokal dan akan dikirim
            ke server sebagai ISO (UTC).
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="border rounded px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
          >
            {loading ? "Opening..." : "Open session"}
          </button>

          <Link
            href={`/teacher/teaching/${teachingAssigmentId}/attendance`}
            className="border rounded px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
