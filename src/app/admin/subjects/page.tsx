"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  adminListSubjects,
  adminCreateSubject,
  adminUpdateSubject,
} from "@/services/admin/admin.service";
import { SubjectRow } from "@/types/admin";

export default function AdminSubjectsPage() {
  const [rows, setRows] = useState<SubjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // create
  const [newName, setNewName] = useState("");

  // edit
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const editingRow = useMemo(
    () => rows.find((x) => x.id === editingId) ?? null,
    [rows, editingId],
  );

  function refresh() {
    setLoading(true);
    setErr(null);
    adminListSubjects()
      .then((data: any) => setRows(data))
      .catch((e) => setErr(e?.message ?? "Failed to load subjects"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    refresh();
  }, []);

  function startEdit(r: SubjectRow) {
    setEditingId(r.id);
    setEditName(r.name ?? "");
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      if (!newName.trim()) return;
      await adminCreateSubject({ name: newName.trim() });
      setNewName("");
      refresh();
    } catch (e: any) {
      setErr(e?.message ?? "Create failed");
    }
  }

  async function onUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setErr(null);
    try {
      await adminUpdateSubject(editingId, { name: editName.trim() });
      setEditingId(null);
      setEditName("");
      refresh();
    } catch (e: any) {
      setErr(e?.message ?? "Update failed");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Subjects</h1>
        <p className="text-sm text-gray-500">Create and update subjects.</p>
      </div>

      {err ? (
        <div className="border border-red-200 bg-red-50 text-red-700 rounded-lg p-3 text-sm">
          {err}
        </div>
      ) : null}

      {/* Create */}
      <form
        onSubmit={onCreate}
        className="border rounded-lg p-4 bg-white space-y-3"
      >
        <div className="font-semibold">Create Subject</div>
        <div className="flex gap-2">
          <input
            className="border rounded px-3 py-2 text-sm w-full"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Matematika"
            required
          />
          <Btn type="submit">Create</Btn>
        </div>
      </form>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* List */}
        <div className="border rounded-lg bg-white overflow-hidden lg:col-span-2">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="font-semibold">All Subjects</div>
            <Btn variant="ghost" onClick={refresh}>
              Refresh
            </Btn>
          </div>

          {loading ? (
            <div className="p-4">Loading...</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3 w-[160px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.id} className="border-t">
                    <td className="p-3">{s.id}</td>
                    <td className="p-3">{s.name}</td>
                    <td className="p-3">
                      <Btn variant="ghost" onClick={() => startEdit(s)}>
                        Edit
                      </Btn>
                    </td>
                  </tr>
                ))}

                {rows.length === 0 ? (
                  <tr>
                    <td className="p-3 text-gray-500" colSpan={3}>
                      No subjects
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          )}
        </div>

        {/* Edit */}
        <div className="border rounded-lg p-4 bg-white space-y-3">
          <div className="font-semibold">Edit Subject</div>

          {!editingRow ? (
            <div className="text-sm text-gray-500">
              Click Edit on a subject.
            </div>
          ) : (
            <form onSubmit={onUpdate} className="space-y-3">
              <Field label={`Subject #${editingRow.id}`}>
                <input
                  className="border rounded px-3 py-2 text-sm w-full"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </Field>

              <div className="flex gap-2">
                <Btn type="submit">Save</Btn>
                <Btn
                  variant="ghost"
                  onClick={() => {
                    setEditingId(null);
                    setEditName("");
                  }}
                >
                  Cancel
                </Btn>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Btn({
  children,
  onClick,
  variant = "default",
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "ghost";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const base =
    "px-3 py-2 rounded-md text-sm border inline-flex items-center justify-center";
  const styles =
    variant === "ghost"
      ? "border-transparent hover:bg-gray-50"
      : "hover:bg-gray-50";
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        base,
        styles,
        disabled ? "opacity-50 cursor-not-allowed" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-gray-500">{label}</div>
      {children}
    </div>
  );
}
