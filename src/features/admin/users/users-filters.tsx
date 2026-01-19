"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function UsersFilters({
  role,
  setRole,
  isActive,
  setIsActive,
  q,
  setQ,
  onRefresh,
  onClearSearch,
}: {
  role: string;
  setRole: (v: string) => void;
  isActive: string;
  setIsActive: (v: string) => void;
  q: string;
  setQ: (v: string) => void;
  onRefresh: () => void;
  onClearSearch: () => void;
}) {
  return (
    <Card
      title="Filters"
      description="Filter by role, active status, or search by name/email/id."
      action={
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onRefresh}>
            Refresh
          </Button>
          <Button variant="ghost" onClick={onClearSearch} disabled={!q}>
            Clear
          </Button>
        </div>
      }
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Role">
          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">All</option>
            <option value="STUDENT">STUDENT</option>
            <option value="TEACHER">TEACHER</option>
            <option value="ADMIN">ADMIN</option>
          </Select>
        </Field>

        <Field label="Active">
          <Select
            value={isActive}
            onChange={(e) => setIsActive(e.target.value)}
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </Select>
        </Field>

        <Field label="Search">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name / email / id..."
          />
        </Field>
      </div>
    </Card>
  );
}
