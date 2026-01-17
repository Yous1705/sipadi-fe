export type AdminDashboard = {
  generatedAt: string;
  counts: {
    users: {
      total: number;
      students: number;
      teachers: number;
      admins: number;
    };
    classes: { total: number; active: number };
    subjects: number;
    teachingAssignments: number;
    assignments: {
      total: number;
      draft: number;
      published: number;
      closed: number;
    };
    attendanceSessions: { activeNow: number };
    submissions: { pendingGrading: number };
  };
  highlights: {
    classesWithoutHomeroom: { id: number; name: string; year: number }[];
    upcomingAttendanceSessions: Array<{
      id: number;
      name: string | null;
      openAt: string;
      closeAt: string;
      teachingAssigment: {
        id: number;
        class: { id: number; name: string; year: number };
        subject: { id: number; name: string };
        teacher: { id: number; name: string };
      };
    }>;
    recentAssignments: Array<{
      id: number;
      title: string;
      dueDate: string;
      status: "DRAFT" | "PUBLISHED" | "CLOSED";
      createdAt: string;
      teachingAssigment: {
        id: number;
        class: { id: number; name: string; year: number };
        subject: { id: number; name: string };
        teacher: { id: number; name: string };
      };
    }>;
  };
};

export type ClassRow = {
  id: number;
  name: string;
  year: number;
  isActive?: boolean;
  homeroomTeacherId?: number | null;
  homeroomTeacher?: { id: number; name: string } | null;
};

export type UserRow = {
  id: number;
  name: string;
  email: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
  isActive: boolean;
  classId?: number | null;
};

export type SubjectRow = {
  id: number;
  name: string;
};

export type TeacherRow = {
  id: number;
  name: string;
  email: string;
  role: "TEACHER";
  isActive: boolean;
};

export type TeachingRow = {
  id: number;
  classId: number;
  subjectId: number;
  teacherId: number;
  createdAt?: string;
  class?: { id: number; name: string; year: number } | null;
  subject?: { id: number; name: string } | null;
  teacher?: { id: number; name: string } | null;
};

export type AttendanceRow = {
  id: number;
  status: "HADIR" | "IZIN" | "SAKIT" | "ALPHA";
  note?: string | null;

  studentId?: number;
  attendanceSessionId?: number;

  createdAt?: string;
  updatedAt?: string;

  student?: { id: number; name: string; email?: string } | null;
  attendanceSession?: {
    id: number;
    name?: string | null;
    openAt?: string;
    closeAt?: string;
    teachingAssigment?: {
      id: number;
      class?: { id: number; name: string; year: number };
      subject?: { id: number; name: string };
      teacher?: { id: number; name: string };
    };
  } | null;
};

export interface MoveStudentDto {
  studentId: number;
  classId: number;
}
