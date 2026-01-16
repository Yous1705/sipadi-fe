"use client";

import {
  attendSession,
  getAttendanceSessionDetail,
} from "@/services/student/student.service";
import { AttendanceSessionDetail } from "@/types/student";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function AttendanceSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();

  const [data, setData] = useState<AttendanceSessionDetail | null>(null);
  const [status, setStatus] = useState<"HADIR" | "IZIN" | "SAKIT">("HADIR");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAttendanceSessionDetail(Number(sessionId))
      .then(setData)
      .catch(() => setError("Gagal memuat sesi attendance"));
  }, [sessionId]);

  async function handleSubmit() {
    if ((status === "IZIN" || status === "SAKIT") && !note) {
      return setError("Note wajib diisi");
    }

    try {
      setSubmitting(true);
      await attendSession(Number(sessionId), status, note);
      router.back();
    } catch (e: any) {
      setError(e.message ?? "Gagal absen");
    } finally {
      setSubmitting(false);
    }
  }

  if (!data) return <div>Loading...</div>;

  const isClosed = !data.isActive || new Date(data.closeAt) < new Date();

  return (
    <div className="p-6 max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Attendance Session</h1>
        <p className="text-gray-600">
          {data.subjectName} • {data.teacherName}
        </p>
        <p className="text-sm mt-1">
          {new Date(data.openAt).toLocaleString()} –{" "}
          {new Date(data.closeAt).toLocaleString()}
        </p>
      </div>

      {isClosed && (
        <p className="text-red-600">Sesi attendance sudah ditutup</p>
      )}

      {!isClosed && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="border p-2 w-full"
            >
              <option value="HADIR">HADIR</option>
              <option value="IZIN">IZIN</option>
              <option value="SAKIT">SAKIT</option>
            </select>
          </div>

          {(status === "IZIN" || status === "SAKIT") && (
            <div className="space-y-2">
              <label className="font-medium">Note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="border p-2 w-full"
                placeholder="Alasan..."
              />
            </div>
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            disabled={submitting}
            onClick={handleSubmit}
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Attendance"}
          </button>
        </div>
      )}
    </div>
  );
}
