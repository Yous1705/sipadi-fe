"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import type {
  AttendanceSessionDetail,
  AttendanceStatus,
  BulkAttendanceDto,
} from "@/types/teacher";
import {
  bulkAttendance,
  closeAttendanceSession,
  deleteAttendanceSession,
  getAttendanceSessionDetail,
  updateAttendance,
} from "@/services/teacher/teacher.service";
import TeacherNavbar from "@/components/teacher-navbar";

function pickErr(e: any) {
  return e?.message ?? e?.error ?? "Terjadi kesalahan";
}

type RowDraft = {
  status: AttendanceStatus | "";
  note: string;
  saving?: boolean;
  error?: string | null;
};

function AttendanceSessionDetailPage() {
  const params = useParams();
  const teachingAssigmentId = Number(params.teachingAssigmentId);
  const sessionId = Number(params.sessionId);

  const [detail, setDetail] = useState<AttendanceSessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const [drafts, setDrafts] = useState<Record<number, RowDraft>>({});

  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);

  const headerTitle = useMemo(() => {
    if (!detail) return "Attendance Session";
    return detail.name ?? `Session ${detail.id}`;
  }, [detail]);

  async function load() {
    setLoading(true);
    setPageError(null);
    try {
      const d = await getAttendanceSessionDetail(sessionId);
      setDetail(d);

      const init: Record<number, RowDraft> = {};
      d.students.forEach((s) => {
        init[s.studentId] = {
          status: s.status ?? "",
          note: s.note ?? "",
          saving: false,
          error: null,
        };
      });
      setDrafts(init);
    } catch (e) {
      setPageError(pickErr(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!sessionId) return;
    load();
  }, [sessionId]);

  if (!teachingAssigmentId || !sessionId) {
    return <div className="p-6">Invalid params</div>;
  }

  async function onCloseSession() {
    const ok = confirm(
      "Close session? Student yang belum absen akan menjadi ALPHA."
    );
    if (!ok) return;
    try {
      await closeAttendanceSession(sessionId);
      await load();
    } catch (e) {
      alert(pickErr(e));
    }
  }

  async function onDeleteSession() {
    const ok = confirm("Hapus session ini?");
    if (!ok) return;
    try {
      await deleteAttendanceSession(sessionId);
      window.location.href = `/teacher/teaching/${teachingAssigmentId}/attendance`;
    } catch (e) {
      alert(pickErr(e));
    }
  }

  async function onSaveRow(studentId: number) {
    if (!detail) return;

    const student = detail.students.find((s) => s.studentId === studentId);
    if (!student) return;

    const d = drafts[studentId];
    if (!d || !d.status) {
      setDrafts((p) => ({
        ...p,
        [studentId]: {
          ...(p[studentId] ?? { note: "" }),
          error: "Status wajib dipilih",
        },
      }));
      return;
    }

    if (!student.attendanceId) {
      setDrafts((p) => ({
        ...p,
        [studentId]: { ...p[studentId], saving: true, error: null },
      }));

      try {
        const payload: BulkAttendanceDto = {
          attendanceSessionId: detail.id,
          students: [
            {
              studentId,
              status: d.status as any,
              note: d.note?.trim() ? d.note.trim() : undefined,
            },
          ],
        };

        await bulkAttendance(payload);
        await load();
      } catch (e) {
        setDrafts((p) => ({
          ...p,
          [studentId]: { ...p[studentId], saving: false, error: pickErr(e) },
        }));
      }
      return;
    }

    setDrafts((p) => ({
      ...p,
      [studentId]: { ...p[studentId], saving: true, error: null },
    }));

    try {
      await updateAttendance(student.attendanceId, {
        status: d.status as any,
        note: d.note?.trim() ? d.note.trim() : undefined,
      });
      await load();
    } catch (e) {
      setDrafts((p) => ({
        ...p,
        [studentId]: { ...p[studentId], saving: false, error: pickErr(e) },
      }));
    }
  }

  async function onBulkSave() {
    if (!detail) return;

    setBulkError(null);
    setBulkLoading(true);

    try {
      const students = detail.students
        .map((s) => {
          const d = drafts[s.studentId];
          if (!d || !d.status) return null;

          return {
            studentId: s.studentId,
            status: d.status as any,
            note: d.note?.trim() ? d.note.trim() : undefined,
          };
        })
        .filter(Boolean) as BulkAttendanceDto["students"];

      if (!students.length) {
        setBulkError(
          "Tidak ada data untuk disimpan (pilih status minimal 1 siswa)."
        );
        setBulkLoading(false);
        return;
      }

      await bulkAttendance({
        attendanceSessionId: detail.id,
        students,
      });

      await load();
    } catch (e) {
      setBulkError(pickErr(e));
    } finally {
      setBulkLoading(false);
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;

  if (pageError) {
    return (
      <div className="p-6 space-y-4">
        <div className="border border-red-200 bg-red-50 text-red-700 rounded p-4">
          {pageError}
        </div>
        <Link
          href={`/teacher/teaching/${teachingAssigmentId}/attendance`}
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back
        </Link>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="p-6 space-y-4">
        <div className="border rounded p-6 text-gray-600">
          Session tidak ditemukan.
        </div>
        <Link
          href={`/teacher/teaching/${teachingAssigmentId}/attendance`}
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <TeacherNavbar />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold truncate">{headerTitle}</h1>
          <div className="text-sm text-gray-600">
            {new Date(detail.openAt).toLocaleString()} —{" "}
            {new Date(detail.closeAt).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Active: {String(detail.isActive)} • Attended:{" "}
            {detail.stats.attended}/{detail.stats.totalStudents}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onBulkSave}
            disabled={bulkLoading}
            className="border rounded px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
          >
            {bulkLoading ? "Saving..." : "Bulk Save"}
          </button>
          <button
            onClick={onCloseSession}
            className="border rounded px-3 py-2 text-sm hover:bg-gray-50"
          >
            Close session
          </button>
          <button
            onClick={onDeleteSession}
            className="border rounded px-3 py-2 text-sm hover:bg-gray-50"
          >
            Delete
          </button>
        </div>
      </div>

      {bulkError && (
        <div className="border border-red-200 bg-red-50 text-red-700 rounded p-4">
          {bulkError}
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 gap-2 bg-gray-50 p-3 text-xs font-semibold text-gray-600">
          <div className="col-span-4">Student</div>
          <div className="col-span-3">Status</div>
          <div className="col-span-4">Note</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        <div className="divide-y">
          {detail.students.map((s) => {
            const d = drafts[s.studentId] ?? { status: "", note: "" };

            return (
              <div
                key={s.studentId}
                className="grid grid-cols-12 gap-2 p-3 items-start"
              >
                <div className="col-span-4">
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-gray-500">
                    attendanceId: {s.attendanceId ?? "-"}
                  </div>
                  {d.error ? (
                    <div className="text-xs text-red-700 mt-1">{d.error}</div>
                  ) : null}
                </div>

                <div className="col-span-3">
                  <select
                    value={d.status}
                    onChange={(e) =>
                      setDrafts((p) => ({
                        ...p,
                        [s.studentId]: {
                          ...p[s.studentId],
                          status: e.target.value as any,
                          error: null,
                        },
                      }))
                    }
                    className="w-full border rounded px-2 py-2 text-sm"
                    disabled={d.saving}
                  >
                    <option value="">Pilih...</option>
                    <option value="HADIR">HADIR</option>
                    <option value="IZIN">IZIN</option>
                    <option value="SAKIT">SAKIT</option>
                    <option value="ALPHA">ALPHA</option>
                  </select>
                </div>

                <div className="col-span-4">
                  <input
                    value={d.note}
                    onChange={(e) =>
                      setDrafts((p) => ({
                        ...p,
                        [s.studentId]: {
                          ...p[s.studentId],
                          note: e.target.value,
                          error: null,
                        },
                      }))
                    }
                    className="w-full border rounded px-2 py-2 text-sm"
                    placeholder="Catatan (optional)"
                    disabled={d.saving}
                  />
                </div>

                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => onSaveRow(s.studentId)}
                    disabled={d.saving}
                    className="border rounded px-2 py-2 text-xs hover:bg-gray-50 disabled:opacity-60"
                    title="Simpan baris ini"
                  >
                    {d.saving ? "..." : "Save"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between">
        <Link
          href={`/teacher/teaching/${teachingAssigmentId}/attendance`}
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back to Sessions
        </Link>

        <button
          onClick={load}
          className="text-sm text-gray-600 hover:underline"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
export default AttendanceSessionDetailPage;
