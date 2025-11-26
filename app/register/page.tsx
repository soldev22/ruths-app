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

  async function handleSubmit(e: React.FormEvent) {
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

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        if (mode === "login") {
          setMessage("Login successful!");
          // TODO: redirect to dashboard
        } else {
          setMessage("Account created! You can now log in.");
        }
      }
    } catch (err) {
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
            className={`flex-1 py-2 rounded-l-lg border ${
              mode === "login"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700"
            }`}
            onClick={() => setMode("login")}
          >
            Log In
          </button>

          <button
            className={`flex-1 py-2 rounded-r-lg border ${
              mode === "register"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700"
            }`}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Show name only for register */}
          {mode === "register" && (
            <input
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Name (optional)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          )}

          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold disabled:opacity-60"
          >
            {loading
              ? mode === "login"
                ? "Logging in..."
                : "Creating account..."
              : mode === "login"
              ? "Log In"
              : "Register"}
          </button>
        </form>

        {/* Messages */}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
      </div>
    </main>
  );
}
