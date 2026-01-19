"use client";

import React from "react";

export function ReportTable({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
      <div className="overflow-auto">{children}</div>
      {footer ? (
        <div className="p-3 text-xs text-slate-500">{footer}</div>
      ) : null}
    </div>
  );
}
