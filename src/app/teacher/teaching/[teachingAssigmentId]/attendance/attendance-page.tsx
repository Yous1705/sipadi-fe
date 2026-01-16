"use client";

import {
  createAttendanceSession,
  deleteAttendanceSession,
  getAttendanceSession,
} from "@/services/teacher/teacher-teaching.service";
import { AttendanceSession } from "@/types/attendance";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Props {
  teachingAssigmentId: number;
}
function AttendancePage({ teachingAssigmentId }: Props) {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newOpenAt, setNewOpenAt] = useState("");
  const [newCloseAt, setNewCloseAt] = useState("");

  useEffect(() => {
    getAttendanceSession(teachingAssigmentId)
      .then(setSessions)
      .catch(() => setError("Gagal memuat session"))
      .finally(() => setLoading(false));
  }, [teachingAssigmentId]);

  const handleCreate = async () => {
    if (!newName || !newOpenAt) {
      alert("Nama dan waktu buka wajib diisi");
      return;
    }

    await createAttendanceSession({
      teachingAssigmentId,
      name: newName,
      openAt: new Date(newOpenAt).toISOString(),
      closeAt: new Date(newCloseAt).toISOString(),
    });

    setNewName("");
    setNewOpenAt("");
    setNewCloseAt("");
    setCreating(false);

    const data = await getAttendanceSession(teachingAssigmentId);
    setSessions(data);
    console.log("data", createAttendanceSession);
  };

  const handleDelete = async (id: number) => {
    const ok = confirm("Yakin ingin menghapus session ini?");
    if (!ok) return;

    await deleteAttendanceSession(id);

    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Attendance Sessions</h2>
        <button
          onClick={() => setCreating(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Tambah Session
        </button>
      </div>

      <div className="space-y-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="border rounded-lg p-4 hover:bg-gray-50 transition"
          >
            <div className="flex justify-between items-start">
              <Link
                href={`/teacher/teaching/${teachingAssigmentId}/attendance/${session.id}`}
                className="space-y-1"
              >
                <p className="font-semibold text-gray-800">
                  {session.name ?? `Session ${session.id}`}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(session.openAt).toLocaleString()}
                </p>
              </Link>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{session.progress}</p>
                  <p
                    className={`text-xs ${
                      session.isActive ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {session.isActive ? "Active" : "Closed"}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(session.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {creating && (
        <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
          <h3 className="font-semibold">Buat Session Baru</h3>

          <input
            placeholder="Nama session"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border px-3 py-2 w-full rounded"
          />

          <input
            type="datetime-local"
            value={newOpenAt}
            onChange={(e) => setNewOpenAt(e.target.value)}
            className="border px-3 py-2 w-full rounded"
          />

          <input
            type="datetime-local"
            value={newCloseAt}
            onChange={(e) => setNewCloseAt(e.target.value)}
            className="border px-3 py-2 w-full rounded"
          />

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setCreating(false)}
              className="px-4 py-2 text-gray-600"
            >
              Batal
            </button>
            <button
              onClick={handleCreate}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Simpan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendancePage;
