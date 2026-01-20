"use client";

import {
  getAttendanceSessionDetail,
  selfAttend,
} from "@/services/student/student.service";
import { AttendanceSessionDetail } from "@/types/student";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";

type Status = "HADIR" | "IZIN" | "SAKIT" | "ALPHA";

function pickErr(e: any) {
  return e?.message ?? e?.error ?? "Terjadi kesalahan";
}

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

  async function load() {
    if (!sid) return;
    setLoading(true);
    setError(null);

    try {
      const d = await getAttendanceSessionDetail(sid);
      setData(d);
    } catch (e) {
      setError(pickErr(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sid]);

  const backHref = useMemo(() => {
    // paling konsisten: balik ke all attendance
    return "/student/attendance";
  }, []);

  if (loading) return <div className="text-sm text-slate-500">Loading...</div>;

  if (!data) {
    return (
      <Card title="Not found" description="Session not found">
        <Link
          href={backHref}
          className="text-sm text-slate-600 hover:underline"
        >
          ← Back
        </Link>
      </Card>
    );
  }

  const openText = new Date(data.openAt).toLocaleString();
  const closeText = data.closeAt
    ? new Date(data.closeAt).toLocaleString()
    : "-";

  async function onAttend() {
    setError(null);
    setSuccess(null);

    if ((status === "IZIN" || status === "SAKIT") && !note.trim()) {
      setError(`Note wajib diisi untuk ${status}`);
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
      await load();
      router.refresh();
    } catch (e) {
      setError(pickErr(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title={data.name ?? `Session #${data.id}`}
        subtitle={`${data.subjectName} • ${data.teacherName}`}
        right={
          <Link href={backHref}>
            <Button>Back</Button>
          </Link>
        }
      />

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 p-3 text-sm">
          {success}
        </div>
      ) : null}

      <Card
        title="Session info"
        description={`Open: ${openText} • Close: ${closeText}`}
        action={
          <span
            className={`text-xs px-2.5 py-1 rounded-full border ${
              data.isActive
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-slate-50 text-slate-700 border-slate-200"
            }`}
          >
            {data.isActive ? "ACTIVE" : "CLOSED"}
          </span>
        }
      >
        <div className="text-sm text-slate-600">
          Jika sesi sudah ditutup, kamu tidak bisa mengisi attendance.
        </div>
      </Card>

      <Card
        title="Self attendance"
        description="Pilih status dan isi catatan jika diperlukan."
      >
        {!data.isActive ? (
          <div className="rounded-lg border border-slate-200 bg-white p-4 text-slate-600">
            Session sudah ditutup, tidak bisa absen.
          </div>
        ) : (
          <div className="space-y-4">
            <Field label="Status">
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
              >
                <option value="HADIR">HADIR</option>
                <option value="IZIN">IZIN</option>
                <option value="SAKIT">SAKIT</option>
                <option value="ALPHA">ALPHA</option>
              </Select>
            </Field>

            {status === "IZIN" || status === "SAKIT" ? (
              <Field label={`Note (wajib untuk ${status})`}>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className={[
                    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900",
                    "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400",
                    "min-h-[100px]",
                  ].join(" ")}
                  placeholder="Contoh: sakit demam / izin acara keluarga..."
                />
              </Field>
            ) : (
              <Field label="Note (optional)">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className={[
                    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900",
                    "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400",
                    "min-h-[100px]",
                  ].join(" ")}
                  placeholder="Catatan (optional)..."
                />
              </Field>
            )}

            <Button variant="primary" onClick={onAttend} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Attendance"}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

export default StudentAttendanceSessionPage;
