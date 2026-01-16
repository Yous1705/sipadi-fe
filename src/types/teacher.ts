export type Teaching = {
  id: number;
  teacherId: number;
  classId: number;
  subjectId: number;
  createdAt: string;

  class: {
    id: number;
    name: string;
    year: number;
    isActive: boolean;
  };
  subjec: {
    id: number;
    name: string;
  };
};
