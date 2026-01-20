"use client";

import Link from "next/link";
import React from "react";
import type { AttendanceSessionDetail } from "@/types/teacher";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { AttendanceStatus } from "./attendance-status";

export function SessionHeader({
  title,
  detail,
  teachingAssigmentId,
  bulkLoading,
  onBulkSave,
  onCloseSession,
  onDeleteSession,
  onBack,
}: {
  title: string;
  detail: AttendanceSessionDetail;
  teachingAssigmentId: number;
  bulkLoading: boolean;
  onBulkSave: () => void;
  onCloseSession: () => void;
  onDeleteSession: () => void;
  onBack: () => void;
}) {
  return (
    <PageHeader
      title={title}
      subtitle={`${new Date(detail.openAt).toLocaleString()} — ${new Date(detail.closeAt).toLocaleString()}`}
      right={
        <div className="flex gap-2 flex-wrap">
          <span className="hidden sm:inline-flex items-center">
            <AttendanceStatus active={!!detail.isActive} />
          </span>

          <Button variant="primary" onClick={onBulkSave} disabled={bulkLoading}>
            {bulkLoading ? "Saving..." : "Bulk Save"}
          </Button>

          <Button onClick={onCloseSession}>Close session</Button>

          <Button variant="danger" onClick={onDeleteSession}>
            Delete
          </Button>

          <Link href={`/teacher/teaching/${teachingAssigmentId}/attendance`}>
            <Button>Back</Button>
          </Link>
        </div>
      }
    />
  );
}
