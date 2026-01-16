"use client";

import StudentNavbar from "@/components/student-navbar";
import {
  getAttendanceSessionDetail,
  selfAttend,
} from "@/services/student/student.service";
import { AttendanceSessionDetail } from "@/types/student";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Status = "HADIR" | "IZIN" | "SAKIT" | "ALPHA";

function StudentAttendanceSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const sid = Number(sessionId);
  const router = useRouter();

  const [data, setData] = useState<AttendanceSessionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState<Status>("HADIR");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!sid) return;
    setLoading(true);
    setError(null);

    getAttendanceSessionDetail(sid)
      .then(setData)
      .catch((e: any) =>
        setError(e?.message ?? e?.error ?? "Gagal memuat session")
      )
      .finally(() => setLoading(false));
  }, [sid]);

  const backHref = useMemo(() => {
    if (data?.classId) return `/student/classes/${data.classId}`;
    return "/student";
  }, [data?.classId]);

  async function onAttend() {
    if (!data) return;

    setError(null);
    setSuccess(null);

    // Kalau BE kamu mewajibkan note untuk IZIN/SAKIT, enforce di FE
    if ((status === "IZIN" || status === "SAKIT") && !note.trim()) {
      setError("Note wajib diisi untuk IZIN/SAKIT");
      return;
    }

    try {
      setSubmitting(true);
      await selfAttend({
        attendanceSessionId: sid,
        status,
        note: note.trim() ? note.trim() : undefined,
      });

      setSuccess("Absen berhasil ✅");
      setNote("");
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? e?.error ?? "Gagal absen");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div>
        <StudentNavbar />
        <div className="max-w-3xl mx-auto p-6">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <StudentNavbar />
        <div className="max-w-3xl mx-auto p-6">Session not found</div>
      </div>
    );
  }

  const openText = new Date(data.openAt).toLocaleString();
  const closeText = data.closeAt
    ? new Date(data.closeAt).toLocaleString()
    : "-";

  return (
    <div>
      <StudentNavbar />
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">
              {data.name ?? `Session #${data.id}`}
            </h1>
            <p className="text-gray-600">
              {data.subjectName} • {data.teacherName}
            </p>
            <p className="text-sm mt-1">Open: {openText}</p>
            <p className="text-sm">Close: {closeText}</p>
            <p className="text-sm mt-1">
              Status:{" "}
              <span
                className={data.isActive ? "text-green-700" : "text-gray-600"}
              >
                {data.isActive ? "ACTIVE" : "CLOSED"}
              </span>
            </p>
          </div>

          <Link href={backHref} className="text-sm underline">
            Back
          </Link>
        </div>

        <div className="border rounded-xl p-4 space-y-3">
          <div className="font-semibold">Self Attendance</div>

          {!data.isActive ? (
            <div className="text-sm text-gray-600">
              Session sudah ditutup, tidak bisa absen.
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {(["HADIR", "IZIN", "SAKIT", "ALPHA"] as Status[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`px-3 py-2 rounded-lg border text-sm ${
                      status === s ? "bg-black text-white" : ""
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {(status === "IZIN" || status === "SAKIT") && (
                <div className="space-y-2">
                  <label className="text-sm text-gray-700">
                    Note (wajib untuk {status})
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="border rounded-lg p-2 w-full min-h-[90px]"
                    placeholder="Contoh: sakit demam / izin acara keluarga..."
                  />
                </div>
              )}

              {error && <div className="text-red-600 text-sm">{error}</div>}
              {success && (
                <div className="text-green-700 text-sm">{success}</div>
              )}

              <button
                onClick={onAttend}
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Attendance"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default StudentAttendanceSessionPage;
