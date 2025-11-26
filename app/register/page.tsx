"use client";

import { useState } from "react";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const endpoint =
      mode === "login" ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("Auth response:", res.status, data);

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        if (mode === "login") {
          setMessage("✅ Login successful. Redirecting…");
          // Instant redirect to home (which will greet the user)
          window.location.href = "/";
        } else {
          setMessage("✅ Account created! Switch to Log In and sign in.");
          setMode("login");
        }
      }
    } catch (err) {
      console.error("Auth error", err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-8">
        {/* Title */}
        <h1 className="text-2xl font-bold mb-6 text-center">
          {mode === "login" ? "Log In" : "Register"}
        </h1>

        {/* Toggle */}
        <div className="flex mb-6">
          <button
            type="button"
            className={`flex-1 py-2 rounded-l-lg border text-sm font-medium ${
              mode === "login"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
            onClick={() => {
              setMode("login");
              setError(null);
              setMessage(null);
            }}
          >
            Log In
          </button>

          <button
            type="button"
            className={`flex-1 py-2 rounded-r-lg border text-sm font-medium ${
              mode === "register"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
            onClick={() => {
              setMode("register");
              setError(null);
              setMessage(null);
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name only for register */}
          {mode === "register" && (
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="Name (optional)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          )}

          <input
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span className="text-sm">
                  {mode === "login" ? "Logging in..." : "Creating account..."}
                </span>
              </>
            ) : (
              <span className="text-sm">
                {mode === "login" ? "Log In" : "Register"}
              </span>
            )}
          </button>
        </form>

        {/* Error / success messages */}
        {error && (
          <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
        )}
        {message && (
          <p className="mt-4 text-sm text-green-600 text-center">{message}</p>
        )}
      </div>
    </main>
  );
}
