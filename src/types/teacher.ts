export type Role = "STUDENT" | "TEACHER" | "ADMIN";

export type AssignmentStatus = "DRAFT" | "PUBLISHED" | "CLOSED";

// sesuai BE kamu: SubmissionPolicy.URL_ONLY, FILE_ONLY, URL_OR_FILE
export type SubmissionPolicy = "URL_ONLY" | "FILE_ONLY" | "URL_OR_FILE";

export type AttendanceStatus = "HADIR" | "IZIN" | "SAKIT" | "ALPHA";

// ==============
// TEACHING
// ==============
export type TeachingItem = {
  id: number;
  teacherId: number;
  classId: number;
  subjectId: number;
  createdAt: string;

  class?: {
    id: number;
    name: string;
    year: number;
  };

  subject?: {
    id: number;
    name: string;
  };
};

export type StudentItem = {
  id: number;
  name: string;
  classId?: number | null;
};

export type HomeroomClassResponse = {
  classId: number;
  className: string;
  subjects: Array<{ id: number; name: string }>;
};

// ==============
// ASSIGNMENT
// ==============
export type Assignment = {
  id: number;
  title: string;
  description?: string | null;
  dueDate: string;
  status: AssignmentStatus;
  deletedAt?: string | null;

  submissionPolicy: SubmissionPolicy;
  maxFileSizeMb: number;
  allowedMime?: string | null;

  teachingAssigmentId: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateAssignmentDto = {
  teachingAssigmentId: number;
  title: string;
  description?: string;
  dueDate: string; // ISO string

  submissionPolicy?: SubmissionPolicy;
  maxFileSizeMb?: number;
  allowedMime?: string | null;
};

export type UpdateAssignmentDto = Partial<
  Pick<
    CreateAssignmentDto,
    | "title"
    | "description"
    | "dueDate"
    | "submissionPolicy"
    | "maxFileSizeMb"
    | "allowedMime"
  >
>;

// ==============
// SUBMISSION
// ==============
export type Submission = {
  id: number;
  assignmentId: number;
  studentId: number;

  // policy URL/file (tergantung schema kamu, minimal ini ada)
  url?: string | null;
  fileUrl?: string | null;

  // grading (di BE kamu pakai score)
  score?: number | null;
  feedback?: string | null;

  createdAt: string;
  updatedAt: string;

  student?: {
    id: number;
    name: string;
  };
};

export type GradeSubmissionDto = {
  score: number;
  feedback?: string;
};

// ==============
// ATTENDANCE SESSION
// ==============
export type AttendanceSession = {
  id: number;
  name?: string | null;
  openAt: string;
  closeAt: string;
  isActive: boolean;
  teachingAssigmentId: number;
};

export type OpenAttendanceSessionDto = {
  teachingAssigmentId: number;
  name?: string;
  openAt: string; // ISO string
  closeAt: string; // ISO string
};

export type UpdateAttendanceSessionDto = Partial<{
  name: string;
  openAt: string;
  closeAt: string;
}>;

export type AttendanceSessionProgress = AttendanceSession & {
  attendedCount: number;
  totalStudent: number;
  progress: string; // "5/30"
};

export type AttendanceSessionDetail = {
  id: number;
  name?: string | null;
  openAt: string;
  closeAt: string;
  isActive: boolean;
  teachingAssigmentId: number;
  stats: {
    totalStudents: number;
    attended: number;
  };
  students: Array<{
    studentId: number;
    name: string;
    attendanceId: number | null;
    status: AttendanceStatus | null;
    note: string | null;
  }>;
};

// ==============
// ATTENDANCE
// ==============
export type UpdateAttendanceDto = {
  status: AttendanceStatus;
  note?: string;
};

export type BulkAttendanceDto = {
  attendanceSessionId: number;
  students: Array<{
    studentId: number;
    status: AttendanceStatus;
    note?: string;
  }>;
};

// ==============
// REPORTS (minimal typing)
// ==============
export type GradeReportItem = {
  studentId: number;
  studentName: string;
  assignmentId: number;
  assignmentTitle: string;
  score: number | null;
};

export type ClassSummaryReport = {
  classId: number;
  className: string;
  // sesuaikan kalau response BE kamu lebih detail
  studentsCount: number;
};
