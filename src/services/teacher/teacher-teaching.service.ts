import { AssignmentDetail, CreateAssignment } from "./../../types/assignment";
import { apiFetch } from "@/lib/client";
import { Assignment } from "@/types/assignment";
import {
  AttendanceSession,
  AttendanceSessionDetail,
  AttendanceStudent,
  BulkAttendance,
} from "@/types/attendance";
import { ClassReportResponse, HomeroomClass } from "@/types/report";

export type Teaching = {
  id: number;
  createdAt: string;

  class: {
    id: number;
    name: string;
    year: number;
    isActive: boolean;
  };
  subject: {
    id: number;
    name: string;
  };
};

function getToken() {
  return document.cookie.match(/sipadi_token=([^;]+)/)?.[1];
}

export async function getMyTeachings() {
  return apiFetch<Teaching[]>(`/teacher/teachings`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function getAssignmetsByTeaching(teachingAssigmentId: number) {
  return apiFetch<Assignment[]>(
    `/teacher/assignments?teachingAssigmentId=${teachingAssigmentId}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
}

export async function createAssignment(data: CreateAssignment) {
  return apiFetch(`/teacher/assignment`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
}

export function publishAssignment(assignmentId: number) {
  return apiFetch(`/teacher/assignments/${assignmentId}/publish`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export function closeAssignment(assignmentId: number) {
  return apiFetch(`/teacher/assignments/${assignmentId}/close`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function getAssignmentDetail(assignmentId: number) {
  return apiFetch<AssignmentDetail>(`/teacher/assignments/${assignmentId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function gradeAssignment(
  submissionId: number,
  payload: {
    score?: number;
    feedback?: string;
  }
) {
  return apiFetch(`/teacher/submission/${submissionId}/grade`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
}

export function resetGradeAssignment(submissionId: number) {
  return apiFetch(`/teacher/submission/${submissionId}/reset-grade`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export function openAttendanceSession(
  teachingAssigmentId: number,
  openAt: string,
  closeAt: string
) {
  return apiFetch(`/teacher/attendance-session`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ teachingAssigmentId, openAt, closeAt }),
  });
}

export function closeAttendanceSession(sessionId: number) {
  return apiFetch(`/teacher/attendance-session/${sessionId}/close`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export function getAttendanceSessionDetail(sessionId: number) {
  return apiFetch<AttendanceSession>(
    `/teacher/attendance-session/${sessionId}/detail`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
}

export function getAttendanceStudents(sessionId: number) {
  return apiFetch<AttendanceStudent[]>(
    `/teacher/attendance-session/${sessionId}/attendances`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
}

export function submitBulkAttendance(payload: BulkAttendance) {
  return apiFetch(`/teacher/attendances/bulk`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
}

export function updateAttendanceSession(
  id: number,
  payload: {
    name: string;
    openAt?: string;
    closeAt?: string;
  }
) {
  return apiFetch(`/teacher/attendance-session/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
}

export function updateAttendance(
  attendanceId: number,
  data: { status: AttendanceStudent["status"]; note?: string | null }
) {
  return apiFetch(`/teacher/attendances/${attendanceId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
}

export function getAttendanceSession(teachingAssigmentId: number) {
  return apiFetch<AttendanceSession[]>(
    `/teacher/attendance-session/${teachingAssigmentId}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
}

export function getAttendanceDetail(id: number) {
  return apiFetch<AttendanceSessionDetail>(
    `/teacher/attendance-session/${id}/detail`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
}

export function createAttendanceSession(payload: {
  teachingAssigmentId: number;
  name?: string;
  openAt: string;
  closeAt: string;
}) {
  return apiFetch(`/teacher/attendance-session`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
}

export function deleteAttendanceSession(id: number) {
  return apiFetch(`/teacher/attendance-session/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export function deleteAssignment(id: number) {
  return apiFetch(`/teacher/assignments/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export function updateAssignment(
  assignmentId: number,
  data: {
    title: string;
    description: string;
    dueDate?: string;
  }
) {
  return apiFetch(`/teacher/assignments/${assignmentId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
}

// ======= Grade =======

export function getGradeReport(teachingAssigmentId: number) {
  return apiFetch(`/teacher/reports/teaching/${teachingAssigmentId}/grades`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function exportGradeReport(
  teachingAssigmentId: number,
  format: "csv" | "xlsx"
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/teacher/reports/teaching/${teachingAssigmentId}/grades/export?format=${format}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to export report");
  }

  const blob = await res.blob();

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `grade-report.${format}`;
  a.click();

  window.URL.revokeObjectURL(url);
}

export function getClassReport(classId: number) {
  return apiFetch<ClassReportResponse>(`/teacher/reports/class/${classId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export function exportClassReport(
  classId: number,
  format: "csv" | "xlsx" = "xlsx"
) {
  return fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/teacher/reports/class/${classId}/export?format=${format}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  ).then((res) => res.blob());
}

export async function getHomeroomClass(): Promise<HomeroomClass | null> {
  return apiFetch(`/teacher/homeroom/class`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}
