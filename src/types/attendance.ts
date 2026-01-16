export type AttendanceStatus = "HADIR" | "SAKIT" | "IZIN" | "ALPHA";

export interface student {
  id: number;
  name: string;
}

export interface Attendance {
  id: number;
  status: AttendanceStatus;
  note?: string | null;
  student: student;
}

export interface AttendanceSession {
  id: number;
  name?: string | null;
  isActive: boolean;
  openAt: string;
  closeAt?: string | null;
  attendedCount: number;
  totalStudent: number;
  attendance: Attendance[];
  progress: string;
}

export interface AttendanceStudent {
  attendanceId: number | null;
  studentId: number;
  name: string;
  status: AttendanceStatus | null;
  note?: string | null;
}

export interface BulkAttendance {
  attendanceSessionId: number;
  students: {
    studentId: number;
    status: AttendanceStatus;
    note?: string | null;
  }[];
}

export interface AttendanceSessionDetail {
  id: number;
  name: string | null;
  openAt: string;
  closeAt: string | null;
  isActive: boolean;
  teachingAssigmentId: number;
  stats: {
    totalStudents: number;
    attended: number;
  };
  students: AttendanceStudent[];
}
