"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserRow } from "@/types/admin";

export function ResetPassword({
  selectedUser,
  resetPassword,
  setResetPassword,
  onCancel,
  onSubmit,
}: {
  selectedUser: UserRow | null;
  resetPassword: string;
  setResetPassword: (v: string) => void;
  onCancel: () => void;
  onSubmit: () => Promise<void>;
}) {
  return (
    <Card
      title="Reset Password"
      description={
        selectedUser
          ? "Set a new password for the selected user."
          : "Click “Reset PW” from the table."
      }
    >
      {!selectedUser ? (
        <div className="text-sm text-slate-500">
          Pilih user dari tabel untuk reset password.
        </div>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await onSubmit();
          }}
          className="space-y-3"
        >
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="text-sm">
              User: <b>{selectedUser.name}</b>{" "}
              <span className="text-xs text-slate-500">#{selectedUser.id}</span>
            </div>
            <div className="text-xs text-slate-500">{selectedUser.email}</div>
          </div>

          <Field label="New Password">
            <Input
              type="password"
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
              required
            />
          </Field>

          <div className="flex gap-2">
            <Button type="submit" variant="primary">
              Save
            </Button>
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}
