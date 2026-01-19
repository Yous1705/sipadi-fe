"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { AssignmentFilter } from "@/types/ui";

export function AssignmentFilters({
  q,
  onQ,
  status,
  onStatus,
}: {
  q: string;
  onQ: (v: string) => void;
  status: AssignmentFilter;
  onStatus: (v: AssignmentFilter) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <Input
        value={q}
        onChange={(e) => onQ(e.target.value)}
        placeholder="Search title..."
      />
      <Select
        value={status}
        onChange={(e) => onStatus(e.target.value as AssignmentFilter)}
      >
        <option value="ALL">All status</option>
        <option value="DRAFT">Draft</option>
        <option value="PUBLISHED">Published</option>
        <option value="CLOSED">Closed</option>
      </Select>
    </div>
  );
}
