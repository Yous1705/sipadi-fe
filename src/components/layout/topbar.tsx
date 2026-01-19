"use client";

import React from "react";

export function Topbar({
  title,
  left,
  right,
}: {
  title?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
            S
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">
              {title ?? "SIPADI"}
            </div>
            <div className="text-xs text-slate-500">Blue & White UI</div>
          </div>
          {left ? <div className="ml-4">{left}</div> : null}
        </div>

        {right ? <div className="flex items-center gap-2">{right}</div> : null}
      </div>
    </div>
  );
}
