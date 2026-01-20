"use client";

import React from "react";
import type { Assignment } from "@/types/teacher";
import { Card } from "@/components/ui/card";
import { AssignmentStatus } from "@/features/teacher/assignment/status";

export function AssignmentOverview({ assignment }: { assignment: Assignment }) {
  return (
    <Card
      title="Overview"
      description={`Policy: ${assignment.submissionPolicy} • Max: ${assignment.maxFileSizeMb}MB${
        assignment.allowedMime ? ` • Mime: ${assignment.allowedMime}` : ""
      }`}
      action={<AssignmentStatus value={String(assignment.status)} />}
    >
      <div className="text-sm text-slate-700 whitespace-pre-wrap">
        {assignment.description ?? "-"}
      </div>
    </Card>
  );
}
