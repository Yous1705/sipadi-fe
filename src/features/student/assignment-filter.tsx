"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type Filter = "ALL" | "NOT_SUBMITTED" | "SUBMITTED";

export function AssignmentFilters({
  filter,
  onFilter,
  q,
  onQ,
}: {
  filter: Filter;
  onFilter: (v: Filter) => void;
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
          variant={filter === "NOT_SUBMITTED" ? "primary" : "outline"}
          onClick={() => onFilter("NOT_SUBMITTED")}
        >
          Not submitted
        </Button>
        <Button
          type="button"
          variant={filter === "SUBMITTED" ? "primary" : "outline"}
          onClick={() => onFilter("SUBMITTED")}
        >
          Submitted
        </Button>
      </div>

      <div className="max-w-sm">
        <Input
          value={q}
          onChange={(e) => onQ(e.target.value)}
          placeholder="Search title..."
        />
      </div>
    </div>
  );
}
