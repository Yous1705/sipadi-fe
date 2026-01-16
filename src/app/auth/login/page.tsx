"use client";

import { decodeJwt } from "@/lib/jwt";
import { token } from "@/lib/token";
import { login } from "@/services/auth.services";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await login(email, password);
    token.set(res.access_token);
    const payload = decodeJwt(res.access_token);
    router.push(`/${payload?.role.toLowerCase()}/dashboard`);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 space-y-4">
      <input
        className="border p-2 w-full"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      ></input>

      <input
        className="border p2 w-full"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      ></input>

      <button className="bg-black text-white px-4 py-2 w-full">Login</button>
    </form>
  );
}

export default LoginPage;
