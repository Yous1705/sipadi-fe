"use client";
import React from "react";

export function Select({
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  children: React.ReactNode;
}) {
  return (
    <select
      {...props}
      className={[
        "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900",
        "focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400",
        className,
      ].join(" ")}
    >
      {children}
    </select>
  );
}
