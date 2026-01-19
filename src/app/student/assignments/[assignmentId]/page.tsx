"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { getAssignmentDetail } from "@/services/student/student.service";
import type { StudentAssignmentDetail } from "@/types/student";

import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Status } from "@/features/student/status";
import { SubmissionInfo } from "@/features/student/submission-info";
import { SubmissionForm } from "@/features/student/submission-form";

function pickErr(e: any) {
  return e?.message ?? e?.error ?? "Gagal memuat assignment";
}

export default function StudentAssignmentDetailPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const id = Number(assignmentId);

  const [data, setData] = useState<StudentAssignmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const d = await getAssignmentDetail(id);
      setData(d);
    } catch (e) {
      setError(pickErr(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const dueLabel = useMemo(
    () => (data ? new Date(data.dueDate).toLocaleString() : "-"),
    [data],
  );
  const late = useMemo(
    () => (data ? Date.now() > new Date(data.dueDate).getTime() : false),
    [data],
  );

  if (!id) {
    return (
      <Card title="Invalid params" description="assignmentId tidak valid.">
        <Link
          href="/student/assignments"
          className="text-sm text-slate-600 hover:underline"
        >
          ← Back
        </Link>
      </Card>
    );
  }

  if (loading) return <div className="text-sm text-slate-500">Loading...</div>;

  if (error) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
          {error}
        </div>
        <Link
          href="/student/assignments"
          className="text-sm text-slate-600 hover:underline"
        >
          ← Back
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <Card title="Not found" description="Assignment tidak ditemukan.">
        <Link
          href="/student/assignments"
          className="text-sm text-slate-600 hover:underline"
        >
          ← Back
        </Link>
      </Card>
    );
  }

  const backHref = data.teachingAssigmentId
    ? `/student/subjects/${data.teachingAssigmentId}`
    : "/student/assignments";

  return (
    <div className="space-y-4">
      <PageHeader
        title={data.title}
        subtitle={`${data.subjectName} • ${data.teacherName}`}
        right={
          <Link href={backHref}>
            <Button>Back</Button>
          </Link>
        }
      />

      <Card
        title="Assignment info"
        description={`Due: ${dueLabel}`}
        action={
          <div className="flex gap-2 flex-wrap justify-end">
            <Status tone={late ? "rose" : "green"}>
              {late ? "Late" : "On time"}
            </Status>
            <Status tone="gray">{data.submissionPolicy}</Status>
          </div>
        }
      >
        <div className="text-sm text-slate-700 whitespace-pre-wrap">
          {data.description || "-"}
        </div>
      </Card>

      <Card
        title="Submission"
        description="Upload file atau kirim URL sesuai policy."
      >
        <div className="space-y-4">
          <SubmissionInfo data={data} />

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="font-semibold text-slate-900 mb-2">
              Submit / Update
            </div>
            <SubmissionForm
              data={data}
              onSubmitted={async () => {
                await load();
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
