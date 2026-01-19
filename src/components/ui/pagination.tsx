"use client";

import React from "react";
import { Button } from "./button";

export function paginate<T>(items: T[], page: number, pageSize: number) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;

  return {
    page: safePage,
    pageSize,
    total,
    totalPages,
    slice: items.slice(start, end),
    startIndex: start, // untuk No agar lanjut (startIndex + index + 1)
  };
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="text-xs text-slate-500">
        Page <b>{page}</b> of <b>{totalPages}</b>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          disabled={!canPrev}
          onClick={() => onPageChange(1)}
        >
          First
        </Button>
        <Button
          variant="outline"
          disabled={!canPrev}
          onClick={() => onPageChange(page - 1)}
        >
          Prev
        </Button>
        <Button
          variant="outline"
          disabled={!canNext}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
        <Button
          variant="outline"
          disabled={!canNext}
          onClick={() => onPageChange(totalPages)}
        >
          Last
        </Button>
      </div>
    </div>
  );
}
