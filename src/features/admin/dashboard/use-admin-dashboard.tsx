"use client";

import { useEffect, useState } from "react";
import { getAdminDashboard } from "@/services/admin/admin.service";
import type { AdminDashboard } from "@/types/admin";

export function useAdminDashboard() {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setErr(null);
    try {
      const res = await getAdminDashboard();
      setData(res);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load dashboard");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return { data, loading, err, refresh };
}
