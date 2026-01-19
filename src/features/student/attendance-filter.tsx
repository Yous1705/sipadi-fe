"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type AttendFilter = "ALL" | "NOT_YET" | "DONE";

export function AttendanceFilters({
  filter,
  onFilter,
  q,
  onQ,
}: {
  filter: AttendFilter;
  onFilter: (v: AttendFilter) => void;
  q: string;
  onQ: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        <Button
          type="button"
          variant={filter === "ALL" ? "primary" : "outline"}
          onClick={() => onFilter("ALL")}
        >
          All
        </Button>
        <Button
          type="button"
          variant={filter === "NOT_YET" ? "primary" : "outline"}
          onClick={() => onFilter("NOT_YET")}
        >
          Not yet
        </Button>
        <Button
          type="button"
          variant={filter === "DONE" ? "primary" : "outline"}
          onClick={() => onFilter("DONE")}
        >
          Done
        </Button>
      </div>

      <div className="max-w-sm">
        <Input
          value={q}
          onChange={(e) => onQ(e.target.value)}
          placeholder="Search session / subject..."
        />
      </div>
    </div>
  );
}
