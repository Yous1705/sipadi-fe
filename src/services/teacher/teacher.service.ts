import { apiFetch } from "@/lib/client";
import { ClassReportResponse, GradeReportResponse } from "@/types/report";
import {
  Assignment,
  AttendanceSession,
  AttendanceSessionDetail,
  AttendanceSessionProgress,
  BulkAttendanceDto,
  ClassSummaryReport,
  CreateAssignmentDto,
  GradeReportItem,
  GradeSubmissionDto,
  HomeroomClassResponse,
  OpenAttendanceSessionDto,
  StudentItem,
  Submission,
  TeachingItem,
  UpdateAssignmentDto,
  UpdateAttendanceDto,
  UpdateAttendanceSessionDto,
} from "@/types/teacher";

export async function getMyTeachings() {
  return apiFetch<TeachingItem[]>("/teacher/teachings", {
    method: "GET",
    headers: authHeader(),
  });
}

export async function getTeachingStudents(teachingAssigmentId: number) {
  return apiFetch<StudentItem[]>(
    `/teacher/teachings/${teachingAssigmentId}/students`,
    {
      method: "GET",
      headers: authHeader(),
    }
  );
}

export async function getTeachingAssignments(teachingAssigmentId: number) {
  return apiFetch<Assignment[]>(
    `/teacher/teachings/${teachingAssigmentId}/assignment`,
    {
      method: "GET",
      headers: authHeader(),
    }
  );
}

export async function getHomeroomClass() {
  return apiFetch<HomeroomClassResponse>("/teacher/homeroom/class", {
    method: "GET",
    headers: authHeader(),
  });
}

// ================
// ASSIGNMENTS
// ======================
export async function getAssignmentsByTeaching(teachingAssigmentId: number) {
  return apiFetch<Assignment[]>(
    `/teacher/assignments?teachingAssigmentId=${teachingAssigmentId}`,
    {
      method: "GET",
      headers: authHeader(),
    }
  );
}

export async function createAssignment(dto: CreateAssignmentDto) {
  return apiFetch<Assignment>("/teacher/assignments", {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(dto),
  });
}

export async function updateAssignment(
  assignmentId: number,
  dto: UpdateAssignmentDto
) {
  return apiFetch<Assignment>(`/teacher/assignments/${assignmentId}`, {
    method: "PATCH",
    headers: authHeader(),
    body: JSON.stringify(dto),
  });
}

export async function getAssignmentById(assignmentId: number) {
  return apiFetch<Assignment[]>(`/teacher/assignments/${assignmentId}`, {
    method: "GET",
    headers: authHeader(),
  });
}

export async function getAssignmentById2(assignmentId: number) {
  return apiFetch<Assignment>(`/teacher/assignments/${assignmentId}`, {
    method: "GET",
    headers: authHeader(),
  });
}

export async function getAssignmentDetail(assignmentId: number) {
  return apiFetch<any>(`/teacher/assignments/${assignmentId}/detail`, {
    method: "GET",
    headers: authHeader(),
  });
}

export async function publishAssignment(assignmentId: number) {
  return apiFetch<Assignment>(`/teacher/assignments/${assignmentId}/publish`, {
    method: "PATCH",
    headers: authHeader(),
  });
}

export async function closeAssignment(assignmentId: number) {
  return apiFetch<Assignment>(`/teacher/assignments/${assignmentId}/close`, {
    method: "PATCH",
    headers: authHeader(),
  });
}

export async function deleteAssignment(assignmentId: number) {
  return apiFetch<{ success: boolean }>(
    `/teacher/assignments/${assignmentId}`,
    {
      method: "DELETE",
      headers: authHeader(),
    }
  );
}

export async function hardDeleteAssignment(assignmentId: number) {
  return apiFetch<{ success: boolean }>(
    `/teacher/assignments/${assignmentId}/hard`,
    {
      method: "DELETE",
      headers: authHeader(),
    }
  );
}

export async function getSubmissionsByAssignment(assignmentId: number) {
  return apiFetch<Submission[]>(
    `/teacher/assignments/${assignmentId}/submissions`,
    {
      method: "GET",
      headers: authHeader(),
    }
  );
}

// ======================
// SUBMISSIONS (grading)
// ==============================
export async function gradeSubmission(
  submissionId: number,
  dto: GradeSubmissionDto
) {
  return apiFetch<Submission>(`/teacher/submissions/${submissionId}/grade`, {
    method: "PATCH",
    headers: authHeader(),
    body: JSON.stringify(dto),
  });
}

export async function resetGrade(submissionId: number) {
  return apiFetch<Submission>(
    `/teacher/submissions/${submissionId}/reset-grade`,
    {
      method: "PATCH",
      headers: authHeader(),
    }
  );
}

// =======================
// ATTENDANCE SESSIONS
// ======================
export async function openAttendanceSession(dto: OpenAttendanceSessionDto) {
  return apiFetch<AttendanceSession>("/teacher/attendance-sessions", {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(dto),
  });
}

export async function listAttendanceSessionsByTeaching(
  teachingAssigmentId: number
) {
  return apiFetch<AttendanceSession[]>(
    `/teacher/attendance-sessions/teaching/${teachingAssigmentId}`,
    {
      method: "GET",
      headers: authHeader(),
    }
  );
}

export async function getAttendanceSessionsProgress(
  teachingAssigmentId: number
) {
  return apiFetch<AttendanceSessionProgress[]>(
    `/teacher/attendance-sessions/teaching/${teachingAssigmentId}/progress`,
    {
      method: "GET",
      headers: authHeader(),
    }
  );
}

export async function getAttendanceSessionDetail(sessionId: number) {
  return apiFetch<AttendanceSessionDetail>(
    `/teacher/attendance-sessions/${sessionId}/detail`,
    {
      method: "GET",
      headers: authHeader(),
    }
  );
}

export async function updateAttendanceSession(
  sessionId: number,
  dto: UpdateAttendanceSessionDto
) {
  return apiFetch<AttendanceSession>(
    `/teacher/attendance-sessions/${sessionId}`,
    {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify(dto),
    }
  );
}

export async function closeAttendanceSession(sessionId: number) {
  return apiFetch<{ success: boolean }>(
    `/teacher/attendance-sessions/${sessionId}/close`,
    {
      method: "PATCH",
      headers: authHeader(),
    }
  );
}

export async function deleteAttendanceSession(sessionId: number) {
  return apiFetch<{ success: boolean }>(
    `/teacher/attendance-sessions/${sessionId}`,
    {
      method: "DELETE",
      headers: authHeader(),
    }
  );
}

// ========================
// ATTENDANCES
// ======================
export async function updateAttendance(
  attendanceId: number,
  dto: UpdateAttendanceDto
) {
  return apiFetch<any>(`/teacher/attendances/${attendanceId}`, {
    method: "PATCH",
    headers: authHeader(),
    body: JSON.stringify(dto),
  });
}

export async function bulkAttendance(dto: BulkAttendanceDto) {
  return apiFetch<any>(`/teacher/attendances/bulk`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(dto),
  });
}

// ======================
// REPORTS
// ======================
export async function getGradeReport(teachingAssigmentId: number) {
  return apiFetch<GradeReportResponse>(
    `/teacher/reports/teaching/${teachingAssigmentId}/grades`,
    { method: "GET", headers: authHeader() }
  );
}

export async function getClassReport(classId: number) {
  return apiFetch<ClassReportResponse>(`/teacher/reports/class/${classId}`, {
    method: "GET",
    headers: authHeader(),
  });
}

export async function exportGradeReport(
  teachingAssigmentId: number,
  format: "csv" | "xlsx" = "csv"
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/teacher/reports/teaching/${teachingAssigmentId}/grades/export?format=${format}`,
    {
      method: "GET",
      headers: {
        ...authHeader(),
      },
    }
  );

  if (!res.ok) {
    let msg = "Gagal export grade report";
    try {
      const j = await res.json();
      msg = j?.message ?? j?.error ?? msg;
    } catch {}
    throw new Error(msg);
  }

  return res.blob();
}

export async function exportClassReport(
  classId: number,
  format: "csv" | "xlsx" = "xlsx"
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/teacher/reports/class/${classId}/export?format=${format}`,
    {
      method: "GET",
      headers: {
        ...authHeader(),
      },
    }
  );

  if (!res.ok) {
    let msg = "Gagal export class report";
    try {
      const j = await res.json();
      msg = j?.message ?? j?.error ?? msg;
    } catch {}
    throw new Error(msg);
  }

  return res.blob();
}

function getToken() {
  const match = document.cookie.match(/sipadi_token=([^;]+)/);
  return match?.[1];
}

function authHeader() {
  return { Authorization: `Bearer ${getToken()}` };
}
