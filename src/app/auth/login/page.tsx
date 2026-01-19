"use client";

import { decodeJwt } from "@/lib/jwt";
import { token } from "@/lib/token";
import { login } from "@/services/auth.services";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

function pickErr(e: any) {
  return (
    e?.message ??
    e?.error ??
    (Array.isArray(e) ? e.join(", ") : null) ??
    "Login gagal. Coba lagi."
  );
}

function isEmailLike(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailOk = useMemo(() => !email || isEmailLike(email), [email]);
  const canSubmit = useMemo(() => {
    if (loading) return false;
    if (!email.trim() || !password) return false;
    if (!isEmailLike(email)) return false;
    return true;
  }, [email, password, loading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isEmailLike(email)) {
      setError("Email tidak valid.");
      return;
    }
    if (!password) {
      setError("Password wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      const res = await login(email.trim(), password);
      token.set(res.access_token);
      const payload = decodeJwt(res.access_token);

      const role = String(payload?.role ?? "").toLowerCase();
      if (!role) {
        setError("Role tidak ditemukan dari token.");
        return;
      }

      router.push(`/${role}/dashboard`);
      router.refresh();
    } catch (e: any) {
      setError(pickErr(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-slate-900 text-white font-bold text-lg">
                S
              </div>
              <h1 className="mt-4 text-2xl font-bold text-slate-900">
                Login SIPADI
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Masuk untuk melanjutkan ke dashboard kamu.
              </p>
            </div>

            {error ? (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800">
                  Email
                </label>
                <div
                  className={[
                    "flex items-center gap-2 rounded-2xl border bg-white px-4 py-3",
                    "focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-400",
                    email && !emailOk ? "border-rose-300" : "border-slate-200",
                  ].join(" ")}
                >
                  <span className="text-slate-400">✉️</span>
                  <input
                    className="w-full outline-none text-sm text-slate-900 placeholder:text-slate-400"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    inputMode="email"
                  />
                </div>
                {email && !emailOk ? (
                  <div className="text-xs text-rose-600">
                    Format email tidak valid.
                  </div>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800">
                  Password
                </label>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-400">
                  <span className="text-slate-400">🔒</span>
                  <input
                    className="w-full outline-none text-sm text-slate-900 placeholder:text-slate-400"
                    type={showPass ? "text" : "password"}
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((p) => !p)}
                    className="text-xs font-medium text-slate-600 hover:text-slate-900 px-2 py-1 rounded-lg hover:bg-slate-100"
                  >
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className={[
                  "w-full rounded-2xl px-4 py-3 text-sm font-semibold transition shadow-sm",
                  canSubmit
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : "bg-slate-200 text-slate-500 cursor-not-allowed",
                ].join(" ")}
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} SIPADI
        </div>
      </div>
    </div>
  );
}
