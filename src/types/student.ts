export type StudentAssignment = {
  id: number;
  title: string;
  dueDate: string;
  teachingAssigment: {
    subject: {
      name: string;
    };
    teacher: {
      name: string;
    };
  };
  submissions: {
    id: number;
    score: number | null;
  }[];
};

// export type StudentAssignmentDetail = {
//   id: number;
//   title: string;
//   description: string | null;
//   dueDate: string;
//   status: "PUBLISHED" | "DRAFT" | "CLOSED";

//   teachingAssigment: {
//     subject: {
//       id: number;
//       name: string;
//     };
//     teacher: {
//       id: number;
//       name: string;
//     };
//     class: {
//       id: number;
//       name: string;
//     };
//   };

//   submissions: {
//     id: number;
//     score: number | null;
//     feedback: string | null;
//     submittedAt: string;
//     fileUrl: string;
//   }[];
// };

export type MyClasses = {
  id: number;
  name: string;
  email: string;
  classId: number;
  class: {
    id: number;
    name: string;
    year: number;
    isActive: boolean;
    homeroomTeacherId: number;
    teachingAssigment: {
      id: number;
      teacherId: number;
      subjectId: number;
      subject: {
        name: string;
      };
      teacher: {
        name: string;
      };
    }[];
  };
};

export type StudentAttendance = {
  subject: string;
  teacher: string;
  totalSession: number;
  attendance: {
    HADIR: number;
    IZIN: number;
    SAKIT: number;
    ALPHA: number;
  };
};

export type StudentClass = {
  classId: number;
  className: string;
  teachingAssignmentId: number;
  subjectName: string;
  teacherName: string;
};

export type StudentClassDetail = {
  classId: number;
  subjects: {
    teachingAssignmentId: number;
    subjectName: string;
    teacherName: string;

    assignments: {
      id: number;
      title: string;
      dueDate: string;
      status: "SUBMITTED" | "NOT_SUBMITTED";
      score: number | null;
    }[];

    attendanceSessions: {
      id: number;
      name?: string | null;
      openAt: string;
      closeAt: string;
      isActive: boolean;
      isAttended: boolean;
    }[];
  }[];
};

export type AttendanceSessionDetail = {
  id: number;
  name?: string | null;
  openAt: string;
  closeAt: string;
  isActive: boolean;

  subjectName: string;
  teacherName: string;
};

export interface StudentAssignmentDetail {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  subjectName: string;
  teacherName: string;

  submission: {
    id: number;
    fileUrl: string;
    submittedAt: string;
    score: number | null;
  } | null;
}
