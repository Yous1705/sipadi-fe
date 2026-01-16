import { apiFetch } from "@/lib/client";
import {
  ActiveAttendanceItem,
  AttendanceHistoryItem,
  AttendanceSessionDetail,
  ClassResponse,
  MyClassItem,
  StudentAssignmentDetail,
  Subject,
  SubjectResponse,
} from "@/types/student";

export async function getStudentDashboard() {
  return apiFetch<{ assignments: number; attendanceSession: number }>(
    "/student/dashboard",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
}

export async function getMyClasses() {
  return apiFetch<MyClassItem[]>("/student/classes", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function getClass(classId: number) {
  return apiFetch<ClassResponse>(`/student/classes/${classId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function getAssignmentDetail(assignmentId: number) {
  return apiFetch<StudentAssignmentDetail>(
    `/student/assignments/${assignmentId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
}

export async function submitAssignmentUrl(assignmentId: number, url: string) {
  return apiFetch(`/student/assignments/${assignmentId}/submission/url`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ url }),
  });
}

export async function submitAssignmentFile(assignmentId: number, file: File) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/student/assignments/${assignmentId}/submission/file`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: form,
    }
  );

  if (!res.ok) {
    let msg = "Gagal upload file";
    try {
      const j = await res.json();
      msg = j?.message ?? j?.error ?? msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function getActiveAttendanceByClass(classId: number) {
  return apiFetch<ActiveAttendanceItem[]>(
    `/student/classes/${classId}/attendance/active`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
}

export async function getAttendanceHistoryByClass(classId: number) {
  return apiFetch<AttendanceHistoryItem[]>(
    `/student/classes/${classId}/attendance/history`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
}

export async function selfAttend(data: {
  attendanceSessionId: number;
  status: "HADIR" | "IZIN" | "SAKIT" | "ALPHA";
  note?: string;
}) {
  return apiFetch(`/student/attendance`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
}

export async function getMySubjects() {
  return apiFetch<Subject[]>("/student/subjects", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function getSubject(teachingAssigmentId: number) {
  return apiFetch<SubjectResponse>(`/student/subjects/${teachingAssigmentId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function getAttendanceSessionDetail(sessionId: number) {
  return apiFetch<AttendanceSessionDetail>(
    `/student/attendance/session/${sessionId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
}

function getToken() {
  const match = document.cookie.match(/sipadi_token=([^;]+)/);
  return match?.[1];
}
