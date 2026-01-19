"use client";
import React from "react";

export function Card({
  title,
  description,
  action,
  children,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {(title || action) && (
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-4">
          <div>
            {title ? (
              <div className="font-semibold text-slate-900">{title}</div>
            ) : null}
            {description ? (
              <div className="text-sm text-slate-500 mt-1">{description}</div>
            ) : null}
          </div>
          {action}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
