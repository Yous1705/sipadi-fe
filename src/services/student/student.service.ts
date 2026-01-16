import { apiFetch } from "@/lib/client";
import { Submission } from "@/types/assignment";
import {
  AttendanceSessionDetail,
  MyClasses,
  StudentAssignment,
  StudentAssignmentDetail,
  StudentAttendance,
  StudentClass,
  StudentClassDetail,
} from "@/types/student";

export type StudentDashboardResponse = {
  assignments: number;
  attendanceSession: number;
};

export async function getStudentDashboard() {
  return apiFetch<StudentDashboardResponse>(`/student/dashboard`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function getMyClasses(): Promise<StudentClass[]> {
  return apiFetch(`/student/my-classes`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function getStudentAssignments() {
  return apiFetch<StudentAssignment[]>(`/student/assignments`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

function getToken() {
  const match = document.cookie.match(/sipadi_token=([^;]+)/);
  return match?.[1];
}

export async function getStudentAssignmentDetail(id: number) {
  return apiFetch<StudentAssignmentDetail>(`/student/assignments/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

// export async function submitAssignment(assignmentId: number, fileUrl: string) {
//   return apiFetch<Submission>(
//     `/student/assignments/${assignmentId}/submission`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${getToken()}`,
//       },
//       body: JSON.stringify({
//         fileUrl,
//       }),
//     }
//   );
// }

export async function getMyAttendance(): Promise<StudentAttendance[]> {
  return apiFetch(`/student/attendances`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function getStudentClassDetail(classId: number) {
  return apiFetch<StudentClassDetail>(`/student/classes/${classId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function getAttendanceSessionDetail(sessionId: number) {
  return apiFetch<AttendanceSessionDetail>(
    `/student/attendance/session/${sessionId}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
}

export async function attendSession(
  attendanceSessionId: number,
  status: "HADIR" | "IZIN" | "SAKIT",
  note?: string
) {
  return apiFetch(`/student/attendance`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      attendanceSessionId,
      status,
      note,
    }),
  });
}

export async function getAssignmentsByTeaching(id: number) {
  return apiFetch<StudentAssignment[]>(`/student/teaching/${id}/assignments`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export function getAssignmentDetail(assignmentId: number) {
  return apiFetch<StudentAssignmentDetail>(
    `/student/assignments/${assignmentId}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
}

export function submitAssignment(assignmentId: number, fileUrl: string) {
  return apiFetch(`/student/assignments/${assignmentId}/submission`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ fileUrl }),
  });
}
