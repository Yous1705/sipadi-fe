"use client";

import React from "react";

export function AppShell({
  navbar,
  children,
}: {
  navbar: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {navbar}
      <main className="max-w-6xl mx-auto px-4 pb-10">
        <div className="pt-2">{children}</div>
      </main>
    </div>
  );
}
