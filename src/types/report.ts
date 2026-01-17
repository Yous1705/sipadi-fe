export type GradeLetter = "A" | "B" | "C" | "D";

export interface ClassReportSubject {
  id: number;
  name: string;
  classAverage: number | null;
  grade: GradeLetter | null;
}

export interface StudentSubjectGrade {
  subjectId: number;
  average: number | null;
}

export interface StudentAttendance {
  HADIR: number;
  IZIN: number;
  SAKIT: number;
  ALPHA: number;
}

export interface ClassReportStudent {
  studentId: number;
  name: string;
  grades: StudentSubjectGrade[];
  attendance: StudentAttendance;
  overallAverage: number | null;
  overallGrade: GradeLetter | null;
  rank: number | null;
}

export interface ClassReportResponse {
  classId: number;
  className: string;
  subjects: ClassReportSubject[];
  students: ClassReportStudent[];
}

export interface HomeroomClass {
  classId: number;
  className: string;
  subjects: {
    subjectId: number;
    subjectName: string;
  }[];
}

export interface GradeReportAssignment {
  id: number;
  title: string;
}

export interface GradeReportStudentAssignment {
  assignmentId: number;
  title: string;
  score: number;
  submitted: boolean;
}

export interface GradeReportStudent {
  studentId: number;
  studentName: string;
  className: string;
  assignments: GradeReportStudentAssignment[];
  average: number | null;
}

export interface GradeReportResponse {
  teachingId: number;
  className: string;
  assignments: GradeReportAssignment[];
  students: GradeReportStudent[];
}
