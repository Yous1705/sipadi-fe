import { apiFetch } from "@/lib/client";
import type {
  AdminDashboard,
  AttendanceRow,
  ClassRow,
  SubjectRow,
  TeachingRow,
  UserRow,
} from "@/types/admin";

import type {
  AssignHomeroomTeacherDto,
  AssignTeacherDto,
  ChangeUserRoleDto,
  CreateClassDto,
  CreateStudentDto,
  CreateSubjectDto,
  CreateTeacherDto,
  MoveStudentDto,
  ResetPasswordDto,
  UpdateAttendanceDto,
  UpdateClassDto,
  UpdateSubjectDto,
} from "@/types/admin";
import { ClassReportResponse, GradeReportResponse } from "@/types/report";

function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/sipadi_token=([^;]+)/);
  return match?.[1] ?? null;
}

function authHeader() {
  return { Authorization: `Bearer ${getToken()}` };
}

type QueryValue = string | number | boolean | null | undefined;

function toQuery(params: Record<string, QueryValue>) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    q.set(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : "";
}

export function getAdminDashboard() {
  return apiFetch<AdminDashboard>("/admin/dashboard", {
    method: "GET",
    headers: authHeader(),
  });
}

export function adminListUsers(params?: {
  role?: UserRow["role"];
  isActive?: boolean;
}) {
  const qs = toQuery({
    role: params?.role,
    isActive: params?.isActive,
  });

  return apiFetch<UserRow[]>(`/admin/users${qs}`, {
    method: "GET",
    headers: authHeader(),
  });
}

export function adminGetUserById(id: number) {
  return apiFetch<UserRow>(`/admin/users/${id}`, {
    method: "GET",
    headers: authHeader(),
  });
}

export function adminGetUsersByRole(role: UserRow["role"]) {
  return apiFetch<UserRow[]>(`/admin/users/role/${role}`, {
    method: "GET",
    headers: authHeader(),
  });
}

export function adminGetUsersByClass(classId: number) {
  return apiFetch<UserRow[]>(`/admin/classes/${classId}/users`, {
    method: "GET",
    headers: authHeader(),
  });
}

export function adminCreateStudent(dto: CreateStudentDto) {
  return apiFetch<UserRow>("/admin/students", {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(dto),
  });
}

export function adminCreateTeacher(dto: CreateTeacherDto) {
  return apiFetch<UserRow>("/admin/teachers", {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(dto),
  });
}

export function adminResetUserPassword(id: number, newPassword: string) {
  const body: ResetPasswordDto = { newPassword };

  return apiFetch<void>(`/admin/users/${id}/reset-password`, {
    method: "PATCH",
    headers: authHeader(),
    body: JSON.stringify(body),
  });
}

export function adminChangeUserRole(id: number, role: UserRow["role"]) {
  const body: ChangeUserRoleDto = { role };

  return apiFetch<UserRow>(`/admin/users/${id}/role`, {
    method: "PATCH",
    headers: authHeader(),
    body: JSON.stringify(body),
  });
}

export function adminListClasses() {
  return apiFetch<ClassRow[]>("/admin/classes", {
    method: "GET",
    headers: authHeader(),
  });
}

export function adminGetClassById(id: number) {
  return apiFetch<ClassRow>(`/admin/classes/${id}`, {
    method: "GET",
    headers: authHeader(),
  });
}

export function adminFindClassByNameAndYear(name: string, year: number) {
  return apiFetch<ClassRow>(
    `/admin/classes/by-name/${encodeURIComponent(name)}/${year}`,
    {
      method: "GET",
      headers: authHeader(),
    },
  );
}

export function adminCreateClass(dto: CreateClassDto) {
  return apiFetch<ClassRow>("/admin/classes", {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(dto),
  });
}

export function adminUpdateClass(id: number, dto: UpdateClassDto) {
  return apiFetch<ClassRow>(`/admin/classes/${id}`, {
    method: "PATCH",
    headers: authHeader(),
    body: JSON.stringify(dto),
  });
}

export function adminDeleteClass(id: number) {
  return apiFetch<void>(`/admin/classes/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
}

export function adminAssignHomeroomTeacher(dto: AssignHomeroomTeacherDto) {
  return apiFetch<ClassRow>("/admin/classes/homeroom", {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(dto),
  });
}

export function adminMoveStudent(dto: MoveStudentDto) {
  return apiFetch<void>("/admin/classes/student/move", {
    method: "PATCH",
    headers: authHeader(),
    body: JSON.stringify(dto),
  });
}

export function adminRemoveStudentFromClass(studentId: number) {
  return apiFetch<void>(`/admin/classes/student/${studentId}/remove-class`, {
    method: "PATCH",
    headers: authHeader(),
  });
}

export function adminListTeachingAssignments() {
  return apiFetch<TeachingRow[]>("/admin/teaching-assignments", {
    method: "GET",
    headers: authHeader(),
  });
}

export function adminAssignTeacher(dto: AssignTeacherDto) {
  return apiFetch<TeachingRow>("/admin/teaching-assignments", {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(dto),
  });
}

export function adminUnassignTeacher(id: number) {
  return apiFetch<void>(`/admin/teaching-assignments/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
}

export function adminListSubjects() {
  return apiFetch<SubjectRow[]>("/admin/subjects", {
    method: "GET",
    headers: authHeader(),
  });
}

export function adminCreateSubject(dto: CreateSubjectDto) {
  return apiFetch<SubjectRow>("/admin/subjects", {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(dto),
  });
}

export function adminUpdateSubject(id: number, dto: UpdateSubjectDto) {
  return apiFetch<SubjectRow>(`/admin/subjects/${id}`, {
    method: "PATCH",
    headers: authHeader(),
    body: JSON.stringify(dto),
  });
}

export function adminDeleteSubject(id: number) {
  return apiFetch(`/admin/subjects/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
}

export function adminCloseAttendanceSession(sessionId: number) {
  return apiFetch<void>(`/admin/attendance-session/${sessionId}/close`, {
    method: "PATCH",
    headers: authHeader(),
  });
}

export function adminGetAttendances(query?: Record<string, QueryValue>) {
  const qs = toQuery(query ?? {});
  return apiFetch<AttendanceRow[]>(`/admin/attendances${qs}`, {
    method: "GET",
    headers: authHeader(),
  });
}

export function adminUpdateAttendance(id: number, dto: UpdateAttendanceDto) {
  return apiFetch<AttendanceRow>(`/admin/attendances/${id}`, {
    method: "PATCH",
    headers: authHeader(),
    body: JSON.stringify(dto),
  });
}

export async function adminExportClassReport(
  classId: number,
  format: "csv" | "xlsx" = "xlsx",
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/reports/class/${classId}/export?format=${format}`,
    {
      method: "GET",
      headers: {
        ...authHeader(),
      },
    },
  );

  if (!res.ok) {
    let msg = "Gagal export class report (admin)";
    try {
      const j = await res.json();
      msg = j?.message ?? j?.error ?? msg;
    } catch {}
    throw new Error(msg);
  }

  return res.blob();
}

/** =========================
 * REPORTS (ADMIN)
 * ========================= */
export function adminGetClassReport(classId: number) {
  return apiFetch<ClassReportResponse>(`/admin/reports/class/${classId}`, {
    method: "GET",
    headers: authHeader(),
  });
}

export function adminGetGradeReport(teachingId: number) {
  return apiFetch<GradeReportResponse>(
    `/admin/reports/teaching/${teachingId}/grades`,
    {
      method: "GET",
      headers: authHeader(),
    },
  );
}
