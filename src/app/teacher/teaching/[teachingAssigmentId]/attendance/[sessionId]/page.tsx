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

import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

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

  // UX tools
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"ALL" | AttendanceStatus>("ALL");
  const [bulkSet, setBulkSet] = useState<"" | AttendanceStatus>("");

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const filteredStudents = useMemo(() => {
    if (!detail) return [];
    const qq = q.trim().toLowerCase();

    return detail.students.filter((s) => {
      const d = drafts[s.studentId];
      const status = d?.status ?? s.status ?? "";
      const okQ = !qq || s.name.toLowerCase().includes(qq);
      const okS = filter === "ALL" || status === filter;
      return okQ && okS;
    });
  }, [detail, drafts, q, filter]);

  if (!teachingAssigmentId || !sessionId) {
    return <div className="text-sm text-slate-500">Invalid params</div>;
  }

  async function onCloseSession() {
    const ok = confirm(
      "Close session? Student yang belum absen akan menjadi ALPHA.",
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

  function updateDraft(studentId: number, patch: Partial<RowDraft>) {
    setDrafts((p) => ({
      ...p,
      [studentId]: { ...(p[studentId] ?? { status: "", note: "" }), ...patch },
    }));
  }

  async function onSaveRow(studentId: number) {
    if (!detail) return;

    const student = detail.students.find((s) => s.studentId === studentId);
    if (!student) return;

    const d = drafts[studentId];
    if (!d || !d.status) {
      updateDraft(studentId, { error: "Status wajib dipilih" });
      return;
    }

    updateDraft(studentId, { saving: true, error: null });

    try {
      // kalau belum punya attendanceId → create via bulkAttendance 1 siswa
      if (!student.attendanceId) {
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
        return;
      }

      await updateAttendance(student.attendanceId, {
        status: d.status as any,
        note: d.note?.trim() ? d.note.trim() : undefined,
      });

      await load();
    } catch (e) {
      updateDraft(studentId, { saving: false, error: pickErr(e) });
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
          "Tidak ada data untuk disimpan (pilih status minimal 1 siswa).",
        );
        setBulkLoading(false);
        return;
      }

      await bulkAttendance({ attendanceSessionId: detail.id, students });
      await load();
    } catch (e) {
      setBulkError(pickErr(e));
    } finally {
      setBulkLoading(false);
    }
  }

  function applyBulkSet() {
    if (!detail) return;
    if (!bulkSet) return;

    // Apply ke siswa yang sedang tampil (filtered)
    setDrafts((prev) => {
      const next = { ...prev };
      filteredStudents.forEach((s) => {
        next[s.studentId] = {
          ...(next[s.studentId] ?? { status: "", note: "" }),
          status: bulkSet,
          error: null,
        };
      });
      return next;
    });
  }

  if (loading) return <div className="text-sm text-slate-500">Loading...</div>;

  if (pageError) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
          {pageError}
        </div>
        <Link
          href={`/teacher/teaching/${teachingAssigmentId}/attendance`}
          className="text-sm text-slate-600 hover:underline"
        >
          ← Back
        </Link>
      </div>
    );
  }

  if (!detail) {
    return (
      <Card title="Not found" description="Session tidak ditemukan.">
        <Link
          href={`/teacher/teaching/${teachingAssigmentId}/attendance`}
          className="text-sm text-slate-600 hover:underline"
        >
          ← Back
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title={headerTitle}
        subtitle={`${new Date(detail.openAt).toLocaleString()} — ${new Date(detail.closeAt).toLocaleString()}`}
        right={
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="primary"
              onClick={onBulkSave}
              disabled={bulkLoading}
            >
              {bulkLoading ? "Saving..." : "Bulk Save"}
            </Button>
            <Button onClick={onCloseSession}>Close session</Button>
            <Button variant="danger" onClick={onDeleteSession}>
              Delete
            </Button>
            <Link href={`/teacher/teaching/${teachingAssigmentId}/attendance`}>
              <Button>Back</Button>
            </Link>
          </div>
        }
      />

      <Card
        title="Overview"
        description={`Active: ${String(detail.isActive)} • Attended: ${detail.stats.attended}/${detail.stats.totalStudents}`}
        action={<Button onClick={load}>Refresh</Button>}
      >
        <div className="text-sm text-slate-600">
          Tips: gunakan <b>Bulk set</b> untuk mempercepat, lalu klik{" "}
          <b>Bulk Save</b>.
        </div>
      </Card>

      {bulkError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
          {bulkError}
        </div>
      ) : null}

      <Card
        title="Tools"
        description="Cari siswa, filter status, dan bulk set status."
      >
        <div className="grid gap-3 sm:grid-cols-3 items-end">
          <div className="sm:col-span-1">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search student..."
            />
          </div>

          <div className="sm:col-span-1">
            <Select
              value={filter as any}
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <option value="ALL">All status</option>
              <option value="HADIR">HADIR</option>
              <option value="IZIN">IZIN</option>
              <option value="SAKIT">SAKIT</option>
              <option value="ALPHA">ALPHA</option>
            </Select>
          </div>

          <div className="sm:col-span-1 flex gap-2">
            <Select
              value={bulkSet}
              onChange={(e) => setBulkSet(e.target.value as any)}
            >
              <option value="">Bulk set…</option>
              <option value="HADIR">HADIR</option>
              <option value="IZIN">IZIN</option>
              <option value="SAKIT">SAKIT</option>
              <option value="ALPHA">ALPHA</option>
            </Select>
            <Button onClick={applyBulkSet}>Apply</Button>
          </div>

          <div className="sm:col-span-3 text-sm text-slate-600">
            Showing <b>{filteredStudents.length}</b> of{" "}
            <b>{detail.students.length}</b> students
          </div>
        </div>
      </Card>

      <Card
        title="Attendance list"
        description="Edit status/note lalu simpan per baris atau bulk."
      >
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-50 text-slate-700">
                <tr>
                  <th className="text-left font-semibold px-3 py-2 border-b w-[280px]">
                    Student
                  </th>
                  <th className="text-left font-semibold px-3 py-2 border-b w-[160px]">
                    Status
                  </th>
                  <th className="text-left font-semibold px-3 py-2 border-b">
                    Note
                  </th>
                  <th className="text-right font-semibold px-3 py-2 border-b w-[120px]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((s) => {
                  const d = drafts[s.studentId] ?? { status: "", note: "" };
                  const disabled = !!d.saving || bulkLoading;

                  return (
                    <tr
                      key={s.studentId}
                      className="odd:bg-white even:bg-slate-50 align-top"
                    >
                      <td className="px-3 py-2 border-b">
                        <div className="font-medium text-slate-900">
                          {s.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          attendanceId: {s.attendanceId ?? "-"}
                        </div>
                        {d.error ? (
                          <div className="text-xs text-red-700 mt-1">
                            {d.error}
                          </div>
                        ) : null}
                      </td>

                      <td className="px-3 py-2 border-b">
                        <Select
                          value={d.status}
                          onChange={(e) =>
                            updateDraft(s.studentId, {
                              status: e.target.value as any,
                              error: null,
                            })
                          }
                          disabled={disabled}
                        >
                          <option value="">Pilih...</option>
                          <option value="HADIR">HADIR</option>
                          <option value="IZIN">IZIN</option>
                          <option value="SAKIT">SAKIT</option>
                          <option value="ALPHA">ALPHA</option>
                        </Select>
                      </td>

                      <td className="px-3 py-2 border-b">
                        <Input
                          value={d.note}
                          onChange={(e) =>
                            updateDraft(s.studentId, {
                              note: e.target.value,
                              error: null,
                            })
                          }
                          placeholder="Catatan (optional)"
                          disabled={disabled}
                        />
                      </td>

                      <td className="px-3 py-2 border-b text-right">
                        <Button
                          variant="primary"
                          onClick={() => onSaveRow(s.studentId)}
                          disabled={disabled}
                        >
                          {d.saving ? "Saving..." : "Save"}
                        </Button>
                      </td>
                    </tr>
                  );
                })}

                {!filteredStudents.length ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-slate-600">
                      Tidak ada siswa yang cocok dengan filter.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="p-3 text-xs text-slate-500">
            Rows: {filteredStudents.length}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default AttendanceSessionDetailPage;
