"use client";
import {
  getAttendanceDetail,
  submitBulkAttendance,
  updateAttendance,
  updateAttendanceSession,
} from "@/services/teacher/teacher-teaching.service";
import { AttendanceSessionDetail, AttendanceStatus } from "@/types/attendance";
import React, { useEffect, useState } from "react";

interface Props {
  sessionId: number;
}

function AttendanceDetailPage({ sessionId }: Props) {
  const [data, setData] = useState<AttendanceSessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSession, setEditingSession] = useState(false);
  const [formName, setFormName] = useState("");
  const [formOpenAt, setFormOpenAt] = useState("");
  const [formCloseAt, setFormCloseAt] = useState("");

  async function load() {
    setLoading(true);
    const res = await getAttendanceDetail(sessionId);
    setData(res);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [sessionId]);

  useEffect(() => {
    if (!data) return;

    setFormName(data.name ?? "");
    setFormOpenAt(toLocalDatetime(data.openAt));
    setFormCloseAt(toLocalDatetime(data.closeAt));
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!data) return <div>Attendance not found</div>;

  const handleStatusChange = (
    studentId: number,
    status: AttendanceStatus | null
  ) => {
    setData((prev) =>
      prev
        ? {
            ...prev,
            students: prev.students.map((s) =>
              s.studentId === studentId ? { ...s, status } : s
            ),
          }
        : prev
    );
  };

  const handleSaveAttendance = async () => {
    if (!data.isActive) return;

    const toUpdate = data.students.filter((s) => s.attendanceId);
    const toCreate = data.students.filter((s) => !s.attendanceId && s.status);

    await Promise.all(
      toUpdate.map((s) =>
        updateAttendance(s.attendanceId!, {
          status: s.status!,
          note: s.note,
        })
      )
    );

    if (toCreate.length) {
      await submitBulkAttendance({
        attendanceSessionId: data.id,
        students: toCreate.map((s) => ({
          studentId: s.studentId,
          status: s.status!,
          note: s.note,
        })),
      });
    }

    await load();
    alert("Absensi berhasil disimpan");
  };

  const handleUpdateSession = async () => {
    if (!data) return;

    if (!formName.trim()) {
      alert("Nama sesi wajib diisi");
      return;
    }

    await updateAttendanceSession(data.id, {
      name: formName,
      openAt: formOpenAt ? toISOString(formOpenAt) : undefined,
      closeAt: formCloseAt ? toISOString(formCloseAt) : undefined,
    });

    setEditingSession(false);
    await load();
    alert("Sesi berhasil diperbarui");
  };

  return (
    <div className="space-y-6 p-6">
      {/* SESSION INFO */}
      <div className="border p-4 rounded bg-white">
        <h2 className="font-semibold text-lg">{data.name}</h2>
        <p className="text-sm text-gray-500">
          {data.stats.attended}/{data.stats.totalStudents} hadir
        </p>
      </div>

      {/* TABLE */}
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Nama</th>
            <th className="p-2">Status</th>
            <th className="p-2">Catatan</th>
          </tr>
        </thead>
        <tbody>
          {data.students.map((s) => (
            <tr key={s.studentId} className="border-t">
              <td className="p-2">{s.name}</td>
              <td className="p-2">
                <select
                  disabled={!data.isActive}
                  value={s.status ?? ""}
                  onChange={(e) =>
                    handleStatusChange(
                      s.studentId,
                      e.target.value
                        ? (e.target.value as AttendanceStatus)
                        : null
                    )
                  }
                  className="border rounded px-2 py-1"
                >
                  <option value="">Belum absen</option>
                  <option value="HADIR">Hadir</option>
                  <option value="IZIN">Izin</option>
                  <option value="SAKIT">Sakit</option>
                  <option value="ALPHA">Alpha</option>
                </select>
              </td>
              <td className="p-2">
                <input
                  disabled={!data.isActive}
                  value={s.note ?? ""}
                  onChange={(e) =>
                    setData((prev) =>
                      prev
                        ? {
                            ...prev,
                            students: prev.students.map((x) =>
                              x.studentId === s.studentId
                                ? { ...x, note: e.target.value }
                                : x
                            ),
                          }
                        : prev
                    )
                  }
                  className="border px-2 py-1 w-full"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.isActive && (
        <div className="flex justify-end">
          <button
            onClick={handleSaveAttendance}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Simpan Absensi
          </button>
        </div>
      )}
      <div className="border rounded p-4 bg-white">
        {!editingSession ? (
          <>
            <h2 className="font-semibold text-lg">{data.name}</h2>
            <p className="text-sm text-gray-500">
              {new Date(data.openAt).toLocaleString()} –{" "}
              {data.closeAt ? new Date(data.closeAt).toLocaleString() : "-"}
            </p>

            <button
              onClick={() => setEditingSession(true)}
              className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded"
            >
              Edit Sesi
            </button>
          </>
        ) : (
          <div className="space-y-2">
            <input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="border px-2 py-1 w-full rounded"
              placeholder="Nama sesi"
            />

            <input
              type="datetime-local"
              value={formOpenAt}
              onChange={(e) => setFormOpenAt(e.target.value)}
              className="border px-2 py-1 w-full rounded"
            />

            <input
              type="datetime-local"
              value={formCloseAt}
              onChange={(e) => setFormCloseAt(e.target.value)}
              className="border px-2 py-1 w-full rounded"
            />

            <div className="flex gap-2">
              <button
                onClick={handleUpdateSession}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Simpan
              </button>
              <button
                onClick={() => setEditingSession(false)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function toLocalDatetime(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 16);
}

function toISOString(value: string) {
  return new Date(value).toISOString();
}

export default AttendanceDetailPage;
