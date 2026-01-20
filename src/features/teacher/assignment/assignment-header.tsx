"use client";

import React from "react";
import Link from "next/link";
import type { Assignment } from "@/types/teacher";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";

export function AssignmentHeader({
  title,
  assignment,
  teachingAssigmentId,
  onPublish,
  onClose,
  onDelete,
}: {
  title: string;
  assignment: Assignment;
  teachingAssigmentId: number;
  onPublish: () => void;
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <PageHeader
      title={title}
      subtitle={`Due: ${new Date(assignment.dueDate).toLocaleString()}`}
      right={
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="primary" onClick={onPublish}>
            Publish
          </Button>
          <Button onClick={onClose}>Close</Button>
          <Button variant="danger" onClick={onDelete}>
            Delete
          </Button>
          <Link href={`/teacher/teaching/${teachingAssigmentId}/assignments`}>
            <Button>Back</Button>
          </Link>
        </div>
      }
    />
  );
}
