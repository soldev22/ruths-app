"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface MeResponse {
  name?: string | null;
  email?: string;
  userId?: string;
  error?: string;
}

export default function Header() {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch {
        // ignore errors
      }
      setLoaded(true);
    }

    loadUser();
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/register";
  }

  return (
    <header className="w-full bg-blue-600 text-white py-3 px-6 flex justify-between items-center shadow">
      <Link href="/" className="text-xl font-bold">
        Ruth’s Screening Tool
      </Link>

      {/* ONLY SHOW THIS AREA IF LOGGED IN */}
      {loaded && user && (
        <div className="flex items-center gap-6">
       
         

          <span className="text-sm">Hi, {user.name || user.email}</span>

          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-3 py-1 rounded-md text-sm font-semibold hover:bg-slate-100"
          >
            Log Out
          </button>
        </div>
      )}

      {/* NOTHING SHOWS IN HEADER WHEN LOGGED OUT */}
    </header>
  );
}
