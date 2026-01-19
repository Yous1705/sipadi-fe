"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Assignment } from "@/types/teacher";
import { getAssignmentsByTeaching } from "@/services/teacher/teacher.service";

import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AssignmentFilter } from "@/types/ui";
import { AssignmentFilters } from "@/features/teacher/assignment/assignment-filters";
import { AssignmentItem } from "@/features/teacher/assignment/assignment-item";

export default function TeacherAssignmentsPage() {
  const params = useParams();
  const teachingAssigmentId = Number(params.teachingAssigmentId);

  const [items, setItems] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<AssignmentFilter>("ALL");

  useEffect(() => {
    if (!teachingAssigmentId) return;

    setLoading(true);
    setError(null);

    getAssignmentsByTeaching(teachingAssigmentId)
      .then(setItems)
      .catch((e) => {
        const msg = e?.message ?? e?.error ?? "Gagal memuat assignments";
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [teachingAssigmentId]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return items.filter((a) => {
      const okQ = !qq || a.title?.toLowerCase().includes(qq);
      const okS = status === "ALL" || String(a.status) === status;
      return okQ && okS;
    });
  }, [items, q, status]);

  if (!teachingAssigmentId) {
    return (
      <Card
        title="Invalid params"
        description="teachingAssigmentId tidak valid."
      >
        <Link
          href="/teacher"
          className="text-sm text-slate-600 hover:underline"
        >
          ← Kembali
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Assignments"
        subtitle={`Teaching #${teachingAssigmentId}`}
        right={
          <div className="flex items-center gap-2">
            <Link
              href={`/teacher/teaching/${teachingAssigmentId}/assignments/create`}
            >
              <Button variant="primary">+ Create</Button>
            </Link>
            <Link href={`/teacher/teaching/${teachingAssigmentId}`}>
              <Button>Back</Button>
            </Link>
          </div>
        }
      />

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
          {error}
        </div>
      ) : null}

      <Card
        title="All assignments"
        description={
          loading
            ? "Loading..."
            : `${filtered.length} dari ${items.length} assignment`
        }
      >
        <div className="space-y-4">
          <AssignmentFilters
            q={q}
            onQ={setQ}
            status={status}
            onStatus={setStatus}
          />

          {loading ? (
            <div className="text-sm text-slate-500">Loading...</div>
          ) : !filtered.length ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
              Tidak ada assignment yang cocok.
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((a) => (
                <AssignmentItem
                  key={a.id}
                  teachingAssigmentId={teachingAssigmentId}
                  a={a}
                />
              ))}
            </div>
          )}

          <div>
            <Link
              href={`/teacher/teaching/${teachingAssigmentId}`}
              className="text-sm text-slate-600 hover:underline"
            >
              ← Kembali ke Teaching
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
