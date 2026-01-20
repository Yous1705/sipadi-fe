"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAssignment } from "@/features/teacher/assignment/use-Assignment";
import { AssignmentHeader } from "@/features/teacher/assignment/assignment-header";
import { AssignmentOverview } from "@/features/teacher/assignment/assignment-overview";
import { SubmissionsSection } from "@/features/teacher/assignment/submissions-section";

export default function TeacherAssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();

  const teachingAssigmentId = Number(params.teachingAssigmentId);
  const assignmentId = Number(params.assignmentId);

  const assignment = useAssignment(assignmentId);

  useEffect(() => {
    if (!assignmentId) return;
    assignment.load();
  }, [assignmentId]);

  if (!teachingAssigmentId || !assignmentId) {
    return (
      <Card
        title="Invalid params"
        description="teachingAssigmentId / assignmentId tidak valid."
      >
        <Link
          href={`/teacher/teaching/${teachingAssigmentId || ""}/assignments`}
          className="text-sm text-slate-600 hover:underline"
        >
          ← Back
        </Link>
      </Card>
    );
  }

  if (assignment.loading)
    return <div className="text-sm text-slate-500">Loading...</div>;

  if (assignment.error) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
          {assignment.error}
        </div>
        <Link
          href={`/teacher/teaching/${teachingAssigmentId}/assignments`}
          className="text-sm text-slate-600 hover:underline"
        >
          ← Back
        </Link>
      </div>
    );
  }

  if (!assignment.assignment) {
    return (
      <Card title="Not found" description="Assignment tidak ditemukan.">
        <Link
          href={`/teacher/teaching/${teachingAssigmentId}/assignments`}
          className="text-sm text-slate-600 hover:underline"
        >
          ← Back
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <AssignmentHeader
        title={assignment.title}
        assignment={assignment.assignment}
        teachingAssigmentId={teachingAssigmentId}
        onPublish={assignment.onPublish}
        onClose={assignment.onClose}
        onDelete={async () => {
          const ok = await assignment.onDelete();
          if (ok) {
            router.push(`/teacher/teaching/${teachingAssigmentId}/assignments`);
            router.refresh();
          }
        }}
      />

      <AssignmentOverview assignment={assignment.assignment} />
      <SubmissionsSection
        submissions={assignment.submissions}
        gradeState={assignment.gradeState}
        onPatch={assignment.patchGrade}
        onSave={assignment.onGrade}
        onReset={assignment.onReset}
        onRefresh={assignment.refreshSubmissions}
        teachingAssigmentId={teachingAssigmentId}
      />
    </div>
  );
}
