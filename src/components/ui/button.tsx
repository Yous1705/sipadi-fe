"use client";
import { Variant } from "@/types/ui";
import React from "react";

export function Button({
  children,
  onClick,
  variant = "outline",
  disabled,
  type = "button",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: Variant;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition border";

  const variants: Record<Variant, string> = {
    primary: "bg-blue-600 text-white border-blue-600 hover:bg-blue-700",
    outline: "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
    ghost:
      "bg-transparent text-slate-700 border-transparent hover:bg-slate-100",
    danger: "bg-red-600 text-white border-red-600 hover:bg-red-700",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        base,
        variants[variant],
        disabled ? "opacity-50 cursor-not-allowed" : "",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
