import { apiFetch } from "@/lib/client";
import { AdminDashboard, MoveStudentDto } from "@/types/admin";

function getToken() {
  const match = document.cookie.match(/sipadi_token=([^;]+)/);
  return match?.[1];
}

function authHeader() {
  return { Authorization: `Bearer ${getToken()}` };
}

function toQuery(params: Record<string, any>) {
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

/** =========================
 * USERS
 * ========================= */
export function adminListUsers(params?: {
  role?: "STUDENT" | "TEACHER" | "ADMIN";
  isActive?: boolean;
}) {
  const qs = toQuery({
    role: params?.role,
    isActive: params?.isActive,
  });
  return apiFetch<any[]>(`/admin/users${qs}`, {
    method: "GET",
    headers: authHeader(),
  });
}

export function adminGetUserById(id: number) {
  return apiFetch<any>(`/admin/users/${id}`, {
    method: "GET",
    headers: authHeader(),
  });
}

export function adminGetUsersByRole(role: "STUDENT" | "TEACHER" | "ADMIN") {
  return apiFetch<any[]>(`/admin/users/role/${role}`, {
    method: "GET",
    headers: authHeader(),
  });
}

export function adminGetUsersByClass(classId: number) {
  return apiFetch<any[]>(`/admin/classes/${classId}/users`, {
    method: "GET",
    headers: authHeader(),
  });
}

export function adminCreateStudent(dto: any) {
  return apiFetch<any>("/admin/students", {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(dto),
  });
}

export function adminCreateTeacher(dto: any) {
  return apiFetch<any>("/admin/teachers", {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(dto),
  });
}

export function adminResetUserPassword(id: number, newPassword: string) {
  return apiFetch<any>(`/admin/users/${id}/reset-password`, {
    method: "PATCH",
    headers: authHeader(),
    body: JSON.stringify({ newPassword }),
  });
}

export function adminChangeUserRole(
  id: number,
  role: "STUDENT" | "TEACHER" | "ADMIN",
) {
  return apiFetch<any>(`/admin/users/${id}/role`, {
    method: "PATCH",
    headers: authHeader(),
    body: JSON.stringify({ role }),
  });
}

/** =========================
 * CLASSES
 * ========================= */
export function adminListClasses() {
  return apiFetch<any[]>("/admin/classes", {
    method: "GET",
    headers: authHeader(),
  });
}

export function adminGetClassById(id: number) {
  return apiFetch<any>(`/admin/classes/${id}`, {
    method: "GET",
    headers: authHeader(),
  });
}

export function adminFindClassByNameAndYear(name: string, year: number) {
  return apiFetch<any>(
    `/admin/classes/by-name/${encodeURIComponent(name)}/${year}`,
    {
      method: "GET",
      headers: authHeader(),
    },
  );
}

export function adminCreateClass(dto: any) {
  return apiFetch<any>("/admin/classes", {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(dto),
  });
}

export function adminUpdateClass(id: number, dto: any) {
  return apiFetch<any>(`/admin/classes/${id}`, {
    method: "PATCH",
    headers: authHeader(),
    body: JSON.stringify(dto),
  });
}

export function adminDeleteClass(id: number) {
  return apiFetch<any>(`/admin/classes/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
}

export function adminAssignHomeroomTeacher(dto: any) {
  return apiFetch<any>("/admin/classes/homeroom", {
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
  return apiFetch<any>(`/admin/classes/student/${studentId}/remove-class`, {
    method: "PATCH",
    headers: authHeader(),
  });
}

/** =========================
 * TEACHING ASSIGNMENTS
 * ========================= */
export function adminListTeachingAssignments() {
  return apiFetch<any[]>("/admin/teaching-assignments", {
    method: "GET",
    headers: authHeader(),
  });
}

export function adminAssignTeacher(dto: any) {
  return apiFetch<any>("/admin/teaching-assignments", {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(dto),
  });
}

export function adminUnassignTeacher(id: number) {
  return apiFetch<any>(`/admin/teaching-assignments/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
}

/** =========================
 * SUBJECTS
 * ========================= */
export function adminListSubjects() {
  return apiFetch<any[]>("/admin/subjects", {
    method: "GET",
    headers: authHeader(),
  });
}

export function adminCreateSubject(dto: any) {
  return apiFetch<any>("/admin/subjects", {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(dto),
  });
}

export function adminUpdateSubject(id: number, dto: any) {
  return apiFetch<any>(`/admin/subjects/${id}`, {
    method: "PATCH",
    headers: authHeader(),
    body: JSON.stringify(dto),
  });
}

/** =========================
 * ATTENDANCE SESSION
 * ========================= */
export function adminCloseAttendanceSession(sessionId: number) {
  return apiFetch<any>(`/admin/attendance-session/${sessionId}/close`, {
    method: "PATCH",
    headers: authHeader(),
  });
}

/** =========================
 * ATTENDANCES
 * ========================= */
export function adminGetAttendances(query?: Record<string, any>) {
  const qs = toQuery(query ?? {});
  return apiFetch<any[]>(`/admin/attendances${qs}`, {
    method: "GET",
    headers: authHeader(),
  });
}

export function adminUpdateAttendance(id: number, dto: any) {
  return apiFetch<any>(`/admin/attendances/${id}`, {
    method: "PATCH",
    headers: authHeader(),
    body: JSON.stringify(dto),
  });
}
