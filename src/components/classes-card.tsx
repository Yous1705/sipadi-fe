"use client";
import { StudentClass } from "@/types/student";
import Link from "next/link";

export default function ClassesCard({ data }: { data: StudentClass }) {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div>
        <p className="text-lg font-semibold">{data.subjectName}</p>
        <p className="text-sm text-gray-600">{data.teacherName}</p>
        <p className="text-sm text-gray-600">{data.className}</p>
      </div>

      <div className="flex gap-4 text-sm flex-wrap">
        {/* CLASS DETAIL */}
        <Link
          href={`/student/classes/${data.classId}`}
          className="text-indigo-600 hover:underline"
        >
          Class Detail
        </Link>

        {/* PER TEACHING */}
        <Link
          href={`/student/teaching/${data.teachingAssignmentId}/assignments`}
          className="text-blue-600 hover:underline"
        >
          Assignments
        </Link>

        <Link
          href={`/student/teaching/${data.teachingAssignmentId}/attendance`}
          className="text-blue-600 hover:underline"
        >
          Attendance
        </Link>
      </div>
    </div>
  );
}
