"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Navbar from "../components/Navbar";
import { loginUser } from "../services/auth";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();

  const { login } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await loginUser({
        email,
        password,
      });

      const user = await login();

      if (user.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to login.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      <section className="flex items-center justify-center py-20 px-6">

        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">

          <div className="mb-8 text-center">

            <h1 className="text-4xl font-bold">
              Welcome Back
            </h1>

            <p className="mt-3 text-gray-400">
              Sign in to your DesignDNA account.
            </p>

          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-500 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>

              <label className="mb-2 block text-sm">
                Email
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="name@example.com"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm">
                Password
              </label>

              <input
                type="password"
                required
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="••••••••"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>

            <div className="flex items-center justify-between text-sm">

              <label className="flex items-center gap-2">

                Remember me

              </label>

              <Link
                href="/forgot-password"
                className="text-blue-400 hover:text-blue-300"
              >
                Forgot password?
              </Link>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

          </form>

          <div className="my-6 flex items-center gap-4">

            <div className="h-px flex-1 bg-zinc-700" />

            <span className="text-sm text-gray-400">
              OR
            </span>

            <div className="h-px flex-1 bg-zinc-700" />

          </div>

          <button
            type="button"
            disabled
            className="w-full rounded-xl border border-zinc-700 py-3 text-gray-400"
          >
            Continue with Google
            <span className="ml-2 text-xs">
              (Coming Soon)
            </span>
          </button>

          <p className="mt-8 text-center text-gray-400">

            Don't have an account?

            <Link
              href="/register"
              className="ml-2 text-blue-400 hover:text-blue-300"
            >
              Create one
            </Link>

          </p>

        </div>

      </section>

    </main>
  );
}