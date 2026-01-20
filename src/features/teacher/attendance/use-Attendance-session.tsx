"use client";

import { useCallback, useMemo, useState } from "react";
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

function pickErr(e: any) {
  return e?.message ?? e?.error ?? "Terjadi kesalahan";
}

export type RowDraft = {
  status: AttendanceStatus | "";
  note: string;
  saving?: boolean;
  error?: string | null;
};

export function useAttendanceSession(sessionId: number) {
  const [detail, setDetail] = useState<AttendanceSessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const [drafts, setDrafts] = useState<Record<number, RowDraft>>({});

  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"ALL" | AttendanceStatus>("ALL");
  const [bulkSet, setBulkSet] = useState<"" | AttendanceStatus>("");

  const headerTitle = useMemo(() => {
    if (!detail) return "Attendance Session";
    return detail.name ?? `Session ${detail.id}`;
  }, [detail]);

  const load = useCallback(async () => {
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
  }, [sessionId]);

  function updateDraft(studentId: number, patch: Partial<RowDraft>) {
    setDrafts((p) => ({
      ...p,
      [studentId]: { ...(p[studentId] ?? { status: "", note: "" }), ...patch },
    }));
  }

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

  const onCloseSession = useCallback(async () => {
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
  }, [sessionId, load]);

  const onDeleteSession = useCallback(async () => {
    const ok = confirm("Hapus session ini?");
    if (!ok) return;

    try {
      await deleteAttendanceSession(sessionId);
    } catch (e) {
      alert(pickErr(e));
    }
  }, [sessionId]);

  const onSaveRow = useCallback(
    async (studentId: number) => {
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
    },
    [detail, drafts, load],
  );

  const onBulkSave = useCallback(async () => {
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
  }, [detail, drafts, load]);

  const applyBulkSet = useCallback(() => {
    if (!detail) return;
    if (!bulkSet) return;

    // apply hanya ke siswa yang sedang tampil (filtered)
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
  }, [detail, bulkSet, filteredStudents]);

  return {
    detail,
    loading,
    pageError,
    drafts,
    headerTitle,
    filteredStudents,

    q,
    setQ,
    filter,
    setFilter,
    bulkSet,
    setBulkSet,

    bulkLoading,
    bulkError,

    load,
    updateDraft,
    onSaveRow,
    onBulkSave,
    applyBulkSet,
    onCloseSession,
    onDeleteSession,
  };
}
