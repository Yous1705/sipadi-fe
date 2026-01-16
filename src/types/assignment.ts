export type Assignment = {
  id: number;
  title: string;
  description: string | null;
  dueDate: string;
  status: "PUBLISHED" | "DRAFT" | "CLOSED";
  deletedAt: string | null;
  teachingAssigmentId: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateAssignment = {
  title: string;
  description?: string;
  dueDate: string;
  teachingAssigmentId: number;
};

export type AssignmentDetail = {
  id: number;
  title: string;
  description?: string;
  dueDate: string;
  status: "PUBLISHED" | "DRAFT" | "CLOSED";
  submissions: Submission[];
};

export type assignmentProps = {
  assignmentId: number;
  status: "DRAFT" | "PUBLISHED" | "CLOSED";
  onUpdated: () => void;
};

export type Submission = {
  id: number;
  score: number | null;
  feedback: string | null;
  submittedAt: string;
  fileUrl?: string;
  student: {
    id: number;
    name: string;
  };
};

export type StudentReport = {
  studentId: number;
  studentName: string;
  assignments: {
    assignmentId: number;
    score: number | null;
  }[];
  average: number | null;
};
