"use client";

import React, { useState } from "react";
import { assignmentProps } from "../types/assignment";
import {
  closeAssignment,
  publishAssignment,
} from "@/services/teacher/teacher-teaching.service";

function AssignmentStatusAction({
  assignmentId,
  status,
  onUpdated,
}: assignmentProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handlePublish() {
    setLoading(true);
    await publishAssignment(assignmentId);
    setLoading(false);
    setOpen(false);
    onUpdated();
  }

  async function handleClose() {
    setLoading(true);
    await closeAssignment(assignmentId);
    setLoading(false);
    setOpen(false);
    onUpdated();
  }
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`px-2 py-1 rounded text-xs font-medium ${
          status === "PUBLISHED"
            ? "bg-green-100 text-green-700"
            : status === "DRAFT"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-gray-200 text-gray-600"
        }`}
      >
        {status}
      </button>

      {open && status !== "CLOSED" && (
        <div className="absolute right-0 mt-1 w-32 border rounded bg-white shadow">
          {status === "DRAFT" && (
            <ActionItem
              label="Publish"
              onClick={handlePublish}
              loading={loading}
            />
          )}

          {status === "PUBLISHED" && (
            <ActionItem label="Close" onClick={handleClose} loading={loading} />
          )}
        </div>
      )}
    </div>
  );
}
function ActionItem({
  label,
  onClick,
  loading,
}: {
  label: string;
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="block w-full text-left text-green-600 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
    >
      {label}
    </button>
  );
}

export default AssignmentStatusAction;
