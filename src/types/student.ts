export type ClassResponse = {
  classId: number;
  subjects: Array<{
    teachingAssignmentId: number;
    subjectName: string;
    teacherName: string;
    assignments: Array<{
      id: number;
      title: string;
      dueDate: string;
      status: "SUBMITTED" | "NOT_SUBMITTED";
      score: number | null;
    }>;
    attendanceSessions: Array<{
      id: number;
      name: string;
      openAt: string;
      closeAt: string | null;
      isActive: boolean;
      isAttended: boolean;
    }>;
  }>;
};

export type AssignmentDetail = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  subjectName: string;
  teacherName: string;
  submission: null | {
    id: number;
    fileUrl: string;
    submittedAt: string;
    score: number | null;
  };
};

export type ActiveAttendanceItem = {
  id: number;
  name: string;
  openAt: string;
  closeAt: string | null;
  isActive: boolean;
  subjectName: string;
  teacherName: string;
  isAttended: boolean;
  status: "HADIR" | "IZIN" | "SAKIT" | "ALPHA" | null;
};

export type AttendanceHistoryItem = {
  id: number;
  name: string;
  openAt: string;
  closeAt: string | null;
  isActive: boolean;
  subjectName: string;
  teacherName: string;
  attendance: null | {
    status: "HADIR" | "IZIN" | "SAKIT" | "ALPHA";
    note: string | null;
    attendedAt: string;
  };
};

export type MyClassItem = {
  classId: number;
  className: string;
  teachingAssignmentId: number;
  subjectName: string;
  teacherName: string;
};

export type Subject = {
  classId: number;
  teachingAssigmentId: number;
  subjectName: string;
  teacherName: string;
};

export type SubjectResponse = {
  classId: number;
  teachingAssigmentId: number;
  subjectName: string;
  teacherName: string;

  assignments: Array<{
    id: number;
    title: string;
    dueDate: string;
    status: "SUBMITTED" | "NOT_SUBMITTED";
    score: number | null;
  }>;

  activeAttendanceSessions: Array<{
    id: number;
    name: string;
    openAt: string;
    closeAt: string | null;
    isActive: boolean;
    isAttended: boolean;
  }>;
};
export type SubmissionPolicy = "URL_ONLY" | "FILE_ONLY" | "URL_OR_FILE";
export type SubmissionKind = "URL" | "FILE";

export type StudentAssignmentDetail = {
  id: number;
  title: string;
  description: string;
  dueDate: string;

  submissionPolicy: SubmissionPolicy;
  maxFileSizeMb: number;

  subjectName: string;
  teacherName: string;

  classId?: number;
  teachingAssigmentId?: number;

  submission: null | {
    id: number;
    kind: SubmissionKind;
    url: string | null;
    fileUrl: string | null;
    submittedAt: string;
    score: number | null;
    feedback?: string | null;
  };
};

export type AttendanceSessionDetail = {
  id: number;
  name: string | null;
  openAt: string;
  closeAt: string | null;
  isActive: boolean;

  classId: number;
  subjectName: string;
  teacherName: string;
};
