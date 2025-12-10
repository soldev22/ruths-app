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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl shadow-lg mb-4">
            <h1 className="text-3xl font-bold">SkillScan</h1>
          </div>
          <p className="text-gray-600">Professional Dyslexia & Dyscalculia Screening</p>
        </div>

        <div className="bg-white shadow-2xl rounded-3xl p-8 border border-gray-100">
          {/* Title */}
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h2>

          {/* Toggle */}
          <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
            <button
              type="button"
              className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                mode === "login"
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-gray-600 hover:text-gray-800"
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
              className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                mode === "register"
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-gray-600 hover:text-gray-800"
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
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name (optional)
                  </label>
                  <input
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">I am a...</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, userType: "teacher" })}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                        form.userType === "teacher"
                          ? "bg-green-50 border-green-500 text-green-700 shadow-md"
                          : "bg-white border-gray-200 text-gray-700 hover:border-green-300 hover:shadow"
                      }`}
                    >
                      <div className="font-semibold">👩‍🏫 Teacher</div>
                      <div className="text-xs mt-1 opacity-80">Multiple students</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, userType: "individual" })}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                        form.userType === "individual"
                          ? "bg-blue-50 border-blue-500 text-blue-700 shadow-md"
                          : "bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:shadow"
                      }`}
                    >
                      <div className="font-semibold">👤 Parent/Individual</div>
                      <div className="text-xs mt-1 opacity-80">For my child or me</div>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">Account Type</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, accountType: "individual" })}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                        form.accountType === "individual"
                          ? "bg-blue-50 border-blue-500 text-blue-700 shadow-md"
                          : "bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:shadow"
                      }`}
                    >
                      <div className="font-semibold">Pay Per Use</div>
                      <div className="text-xs mt-1 opacity-80">£5 per assessment</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, accountType: "school" })}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                        form.accountType === "school"
                          ? "bg-purple-50 border-purple-500 text-purple-700 shadow-md"
                          : "bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:shadow"
                      }`}
                    >
                      <div className="font-semibold">School License</div>
                      <div className="text-xs mt-1 opacity-80">Contact us</div>
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                placeholder="you@example.com"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
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
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-4 font-bold text-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 mt-6"
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
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 text-center font-medium">{error}</p>
            </div>
          )}
          {message && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 text-center font-medium">{message}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500">
            {mode === "login" ? (
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
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
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 mb-2">Trusted by educators across the UK</p>
          <div className="flex justify-center gap-4 text-xs text-gray-400">
            <span>🔒 Secure & Private</span>
            <span>✓ GDPR Compliant</span>
            <span>📊 Evidence-Based</span>
          </div>
        </div>
      </div>
    </main>
  );
}
