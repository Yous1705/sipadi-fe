"use client";
import ClassesCard from "@/components/classes-card";
import StudentNavbar from "@/components/student-navbar";
import {
  getStudentDashboard,
  getMyClasses,
} from "@/services/student/student.service";
import { StudentClass } from "@/types/student";
import React, { useEffect, useState } from "react";

function Page() {
  const [stats, setStats] = useState<{
    assignments: number;
    attendanceSession: number;
  } | null>(null);

  const [classes, setClasses] = useState<StudentClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStudentDashboard(), getMyClasses()])
      .then(([dashboard, classes]) => {
        setStats(dashboard);
        setClasses(classes);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!stats) return <div>Data tidak tersedia</div>;

  return (
    <div>
      <StudentNavbar />
      <div className="p-6 space-y-8">
        <h1 className="text-2xl font-semibold">Student Dashboard</h1>

        {/* ===== STATS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DashboardCard title="Total Assignments" value={stats.assignments} />
          <DashboardCard
            title="Attendance Sessions"
            value={stats.attendanceSession}
          />
        </div>

        {/* ===== CLASSES ===== */}
        <section className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classes.map((c) => (
              <ClassesCard key={c.teachingAssignmentId} data={c} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function DashboardCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-xl border p-6 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

export default Page;
