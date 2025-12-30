"use client";

import { useState } from "react";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    accountType: "individual" as "individual" | "school",
    userType: "individual" as "teacher" | "individual",
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
          // Redirect to dashboard after login
          window.location.href = "/protected/dashboard";
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
    <main className="min-h-screen flex items-center justify-center bg-[var(--background)] font-sans">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-block bg-[var(--secondary)] text-[var(--background)] px-6 py-3 rounded-2xl shadow-lg mb-4">
            <h1 className="text-3xl font-livvic-bold">Skillscan</h1>
          </div>
          <p className="text-[var(--secondary-text)] font-livvic-medium">Professional dyslexia and dyscalculia screening</p>
        </div>

        <div className="bg-[var(--background)] shadow-2xl rounded-3xl p-8 border border-[var(--secondary)]/10">
          {/* Title */}
          <h2 className="text-2xl font-livvic-bold mb-6 text-center text-[var(--secondary)]">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h2>

          {/* Pricing info for login mode */}
          {mode === "login" && (
            <div className="mb-6 bg-[var(--secondary)]/5 rounded-lg p-4 text-[var(--secondary-text)] text-sm">
              <h3 className="font-bold text-[var(--secondary)] mb-2">Pricing and packages</h3>
              <ul className="mb-2 list-disc list-inside">
                <li><span className="font-semibold">Pay Per Use:</span> £5 per assessment</li>
                <li><span className="font-semibold">School Licence:</span> Contact us for a yearly fee</li>
              </ul>
              <div className="text-xs text-[var(--secondary-text)]">All plans include full access to dyslexia and dyscalculia screening tools. No hidden fees. Credits never expire.</div>
            </div>
          )}

          {/* Toggle */}
          <div className="flex mb-6 bg-[var(--secondary)]/10 rounded-xl p-1">
            <button
              type="button"
              className={`flex-1 py-3 rounded-lg text-sm font-livvic-bold transition-all duration-200 ${
                mode === "login"
                  ? "bg-[var(--background)] text-[var(--accent)] shadow-md"
                  : "text-[var(--secondary-text)] hover:text-[var(--secondary)]"
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
              className={`flex-1 py-3 rounded-lg text-sm font-livvic-bold transition-all duration-200 ${
                mode === "register"
                  ? "bg-[var(--background)] text-[var(--accent)] shadow-md"
                  : "text-[var(--secondary-text)] hover:text-[var(--secondary)]"
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
              <div>
                <label className="block text-sm font-medium text-[var(--secondary)] mb-2 font-livvic-medium">
                  Name (optional)
                </label>
                <input
                  className="w-full border-2 border-[var(--secondary)]/20 rounded-xl px-4 py-3 text-sm focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)] transition-all outline-none font-livvic-medium"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[var(--secondary)] mb-2 font-livvic-medium">
                Email Address
              </label>
              <input
                className="w-full border-2 border-[var(--secondary)]/20 rounded-xl px-4 py-3 text-sm focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)] transition-all outline-none font-livvic-medium"
                placeholder="you@example.com"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--secondary)] mb-2 font-livvic-medium">
                Password
              </label>
              <input
                className="w-full border-2 border-[var(--secondary)]/20 rounded-xl px-4 py-3 text-sm focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)] transition-all outline-none font-livvic-medium"
                placeholder="••••••••"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--accent)] hover:bg-[var(--secondary)] text-[var(--background)] rounded-xl py-4 font-livvic-bold text-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 mt-6 border-2 border-[var(--accent)]"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>
                    {mode === "login" ? "Logging in..." : "Creating account..."}
                  </span>
                </>
              ) : (
                <span>
                  {mode === "login" ? "Log In" : "Create Account"}
                </span>
              )}
            </button>
          </form>

          {/* Error / success messages */}
          {error && (
            <div className="mt-4 p-3 bg-[var(--accent)]/10 border border-[var(--accent)]/40 rounded-lg">
              <p className="text-sm text-[var(--accent)] text-center font-livvic-bold">{error}</p>
            </div>
          )}
          {message && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 text-center font-livvic-bold">{message}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-[var(--secondary-text)] font-livvic-medium">
            {mode === "login" ? (
              <p>
                Don&#39;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="text-[var(--accent)] hover:text-[var(--secondary)] font-livvic-bold"
                >
                  Sign up free
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-[var(--accent)] hover:text-[var(--secondary)] font-livvic-bold"
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-6 text-center">
          <p className="text-xs text-[var(--secondary-text)] mb-2 font-livvic-medium">Trusted by educators across the UK</p>
          <div className="flex justify-center gap-4 text-xs text-[var(--secondary-text)]/70 font-livvic-medium">
            <span>🔒 Secure & Private</span>
            <span>✓ GDPR Compliant</span>
            <span>📊 Evidence-Based</span>
          </div>
        </div>
      </div>
    </main>
  );
}
