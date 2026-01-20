"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

import { getSubject } from "@/services/student/student.service";
import type { SubjectResponse } from "@/types/student";

import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";

import { SubjectTab } from "@/features/student/subject-tab";
import { SubjectSummary } from "@/features/student/subject-summary";
import { SubjectAssignments } from "@/features/student/subject-assignments";
import { SubjectAttendance } from "@/features/student/subject-attendance";

function SubjectPage() {
  const { teachingAssigmentId } = useParams<{ teachingAssigmentId: string }>();
  const tid = Number(teachingAssigmentId);

  const [tab, setTab] = useState<SubjectTab>("assignments");
  const [data, setData] = useState<SubjectResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tid) return;
    setLoading(true);
    getSubject(tid)
      .then(setData)
      .finally(() => setLoading(false));
  }, [tid]);

  if (loading) return <div className="text-sm text-slate-500">Loading...</div>;
  if (!data)
    return (
      <div className="text-sm text-slate-600">Subject tidak ditemukan.</div>
    );

  return (
    <div className="space-y-4">
      <PageHeader
        title={data.subjectName}
        subtitle={`Teacher: ${data.teacherName}`}
        right={
          <Link href="/student/dashboard">
            <Button>Back</Button>
          </Link>
        }
      />

      <SubjectSummary data={data} />
      <SubjectTab value={tab} onChange={setTab} />

      {tab === "assignments" ? (
        <SubjectAssignments data={data} teachingAssigmentId={tid} />
      ) : (
        <SubjectAttendance data={data} />
      )}
    </div>
  );
}

export default SubjectPage;
