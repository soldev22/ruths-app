"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface MeResponse {
  name?: string | null;
  email?: string;
  userId?: string;
  error?: string;
}

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          // include cookies automatically in browser
        });

        if (!res.ok) {
          // Not logged in or error -> go to login/register
          router.push("/register");
          return;
        }

        const data: MeResponse = await res.json();
        setUserName(data.name || data.email || "there");
      } catch (err) {
        // Any network error -> send to login/register
        router.push("/register");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white shadow-md rounded-2xl p-8 text-center">
          <p className="text-gray-600">Loading your account…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white shadow-md rounded-2xl p-10 text-center">
        <h1 className="text-3xl font-bold mb-4">
          Welcome, {userName} 👋
        </h1>
        <p className="text-gray-600 mb-6">
          You are logged in to the Ruth&apos;s Screening Tool.
        </p>
      </div>
    </main>
  );
}
