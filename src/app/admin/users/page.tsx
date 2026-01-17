"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  adminListUsers,
  adminCreateStudent,
  adminCreateTeacher,
  adminResetUserPassword,
  adminListClasses,
} from "@/services/admin/admin.service";

type UserRow = {
  id: number;
  name: string;
  email: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
  isActive: boolean;
};

type ClassRow = {
  id: number;
  name: string;
  year: number;
  isActive?: boolean;
};

function Btn({
  children,
  onClick,
  variant = "default",
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "danger" | "ghost";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const base =
    "px-3 py-2 rounded-md text-sm border inline-flex items-center justify-center";
  const styles =
    variant === "danger"
      ? "border-red-200 hover:bg-red-50 text-red-700"
      : variant === "ghost"
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

export default function AdminUsersPage() {
  // classes for student create
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const activeClasses = useMemo(
    () => classes.filter((c) => c.isActive !== false),
    [classes],
  );

  // filters
  const [role, setRole] = useState<string>("");
  const [isActive, setIsActive] = useState<string>(""); // "", "true", "false"
  const [q, setQ] = useState<string>(""); // ✅ search query

  // table state
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // create student
  const [sName, setSName] = useState("");
  const [sEmail, setSEmail] = useState("");
  const [sPassword, setSPassword] = useState("");
  const [sClassId, setSClassId] = useState<number>(0);

  // create teacher
  const [tName, setTName] = useState("");
  const [tEmail, setTEmail] = useState("");
  const [tPassword, setTPassword] = useState("");

  // reset pw panel
  const [resetUserId, setResetUserId] = useState<number | null>(null);
  const [resetPassword, setResetPassword] = useState("");

  const params = useMemo(() => {
    return {
      role: role || undefined,
      isActive: isActive === "" ? undefined : isActive === "true",
    };
  }, [role, isActive]);

  function refresh() {
    setLoading(true);
    setError(null);
    adminListUsers(params as any)
      .then(setRows as any)
      .catch((e) => setError(e?.message ?? "Failed to load users"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    // load classes once
    adminListClasses()
      .then((c: any) => {
        const list = (c ?? []) as ClassRow[];
        setClasses(list);
        const firstActive = list.find((x) => x.isActive !== false)?.id ?? 0;
        setSClassId((prev) => prev || firstActive);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const selectedResetUser = useMemo(() => {
    if (!resetUserId) return null;
    return rows.find((u) => u.id === resetUserId) ?? null;
  }, [resetUserId, rows]);

  // ✅ client-side search (name/email/id)
  const filteredRows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;

    return rows.filter((u) => {
      const text = `${u.id} ${u.name} ${u.email} ${u.role}`.toLowerCase();
      return text.includes(needle);
    });
  }, [rows, q]);

  async function onCreateStudent(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (!sClassId) {
        setError("Class is required for student");
        return;
      }

      await adminCreateStudent({
        name: sName.trim(),
        email: sEmail.trim(),
        password: sPassword,
        classId: Number(sClassId),
      });

      setSName("");
      setSEmail("");
      setSPassword("");
      refresh();
    } catch (e: any) {
      setError(e?.message ?? "Create student failed");
    }
  }

  async function onCreateTeacher(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await adminCreateTeacher({
        name: tName.trim(),
        email: tEmail.trim(),
        password: tPassword,
      });

      setTName("");
      setTEmail("");
      setTPassword("");
      refresh();
    } catch (e: any) {
      setError(e?.message ?? "Create teacher failed");
    }
  }

  async function onResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!resetUserId) return;
    setError(null);
    try {
      await adminResetUserPassword(resetUserId, resetPassword);
      setResetUserId(null);
      setResetPassword("");
      refresh();
    } catch (e: any) {
      setError(e?.message ?? "Reset password failed");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Users</h1>
        <p className="text-sm text-gray-500">
          Create users and manage accounts.
        </p>
      </div>

      {error ? (
        <div className="border border-red-200 bg-red-50 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      ) : null}

      {/* Create forms */}
      <div className="grid gap-4 lg:grid-cols-2">
        <form
          onSubmit={onCreateStudent}
          className="border rounded-lg p-4 bg-white space-y-3"
        >
          <div className="font-semibold">Create Student</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name">
              <input
                className="border rounded px-3 py-2 text-sm w-full"
                value={sName}
                onChange={(e) => setSName(e.target.value)}
                required
              />
            </Field>

            <Field label="Email">
              <input
                className="border rounded px-3 py-2 text-sm w-full"
                type="email"
                value={sEmail}
                onChange={(e) => setSEmail(e.target.value)}
                required
              />
            </Field>

            <Field label="Password">
              <input
                className="border rounded px-3 py-2 text-sm w-full"
                type="password"
                value={sPassword}
                onChange={(e) => setSPassword(e.target.value)}
                required
              />
            </Field>

            <Field label="Class">
              <select
                className="border rounded px-3 py-2 text-sm w-full"
                value={sClassId}
                onChange={(e) => setSClassId(Number(e.target.value))}
                required
              >
                <option value={0}>Select class</option>
                {activeClasses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.year})
                  </option>
                ))}
              </select>
            </Field>

            <div className="flex items-end">
              <Btn type="submit">Create Student</Btn>
            </div>
          </div>
        </form>

        <form
          onSubmit={onCreateTeacher}
          className="border rounded-lg p-4 bg-white space-y-3"
        >
          <div className="font-semibold">Create Teacher</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name">
              <input
                className="border rounded px-3 py-2 text-sm w-full"
                value={tName}
                onChange={(e) => setTName(e.target.value)}
                required
              />
            </Field>
            <Field label="Email">
              <input
                className="border rounded px-3 py-2 text-sm w-full"
                type="email"
                value={tEmail}
                onChange={(e) => setTEmail(e.target.value)}
                required
              />
            </Field>
            <Field label="Password">
              <input
                className="border rounded px-3 py-2 text-sm w-full"
                type="password"
                value={tPassword}
                onChange={(e) => setTPassword(e.target.value)}
                required
              />
            </Field>
            <div className="flex items-end">
              <Btn type="submit">Create Teacher</Btn>
            </div>
          </div>
        </form>
      </div>

      {/* Filters */}
      <div className="border rounded-lg p-4 bg-white flex flex-wrap gap-3 items-end">
        <div className="space-y-1">
          <div className="text-sm text-gray-500">Role</div>
          <select
            className="border rounded px-3 py-2 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">All</option>
            <option value="STUDENT">STUDENT</option>
            <option value="TEACHER">TEACHER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <div className="space-y-1">
          <div className="text-sm text-gray-500">Active</div>
          <select
            className="border rounded px-3 py-2 text-sm"
            value={isActive}
            onChange={(e) => setIsActive(e.target.value)}
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* ✅ Search */}
        <div className="space-y-1">
          <div className="text-sm text-gray-500">Search</div>
          <input
            className="border rounded px-3 py-2 text-sm w-[260px]"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name / email / id..."
          />
        </div>

        <Btn variant="ghost" onClick={refresh} type="button">
          Refresh
        </Btn>

        <Btn
          variant="ghost"
          onClick={() => setQ("")}
          type="button"
          disabled={!q}
        >
          Clear Search
        </Btn>
      </div>

      {/* Table + Reset panel */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="border rounded-lg bg-white overflow-hidden lg:col-span-2">
          {loading ? (
            <div className="p-4">Loading...</div>
          ) : (
            <>
              <div className="p-3 text-xs text-gray-500 border-b">
                Showing {filteredRows.length} / {rows.length}
              </div>

              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="p-3">ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Active</th>
                    <th className="p-3 w-[140px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((u) => (
                    <tr key={u.id} className="border-t">
                      <td className="p-3">{u.id}</td>
                      <td className="p-3">{u.name}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">{u.role}</td>
                      <td className="p-3">{String(u.isActive)}</td>
                      <td className="p-3">
                        <Btn
                          variant="ghost"
                          onClick={() => setResetUserId(u.id)}
                          type="button"
                        >
                          Reset PW
                        </Btn>
                      </td>
                    </tr>
                  ))}
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td className="p-3 text-gray-500" colSpan={6}>
                        No users
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </>
          )}
        </div>

        <div className="border rounded-lg p-4 bg-white space-y-3">
          <div className="font-semibold">Reset Password</div>

          {!selectedResetUser ? (
            <div className="text-sm text-gray-500">
              Click <b>Reset PW</b> on a user.
            </div>
          ) : (
            <form onSubmit={onResetPassword} className="space-y-3">
              <div className="text-sm">
                User: <b>{selectedResetUser.name}</b>{" "}
                <span className="text-xs text-gray-500">
                  #{selectedResetUser.id}
                </span>
                <div className="text-xs text-gray-500">
                  {selectedResetUser.email}
                </div>
              </div>

              <Field label="New Password">
                <input
                  className="border rounded px-3 py-2 text-sm w-full"
                  type="password"
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  required
                />
              </Field>

              <div className="flex gap-2">
                <Btn type="submit">Save</Btn>
                <Btn
                  variant="ghost"
                  onClick={() => {
                    setResetUserId(null);
                    setResetPassword("");
                  }}
                  type="button"
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
