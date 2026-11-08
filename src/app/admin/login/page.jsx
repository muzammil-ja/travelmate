
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/admin/enquiries");
  }

  return (
    <main className="min-h-screen bg-[#101b16] flex items-center justify-center p-6 text-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-2xl border border-[#34463a] bg-[#19271f] p-8"
      >
        <h1 className="text-3xl font-bold text-[#d5ae70]">
          Admin Login
        </h1>

        <p className="mt-2 text-gray-400">
          Sign in to manage customer enquiries.
        </p>

        <label className="mt-8 block text-sm">Email Address</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-lg border border-[#34463a] bg-[#101b16] p-3 outline-none"
          placeholder="Admin email"
        />

        <label className="mt-5 block text-sm">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-lg border border-[#34463a] bg-[#101b16] p-3 outline-none"
          placeholder="Enter password"
        />

        {error && (
          <p className="mt-4 text-sm text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-7 w-full rounded-lg bg-[#c69b59] p-3 font-semibold text-[#101b16] disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </main>
  );
}
