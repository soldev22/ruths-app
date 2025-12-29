"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./Logo";

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
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user ?? null);
        }
      } catch {}

      setLoaded(true);
    }

    loadUser();
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    window.location.href = "/register";
  }

  return (
    <header className="w-full bg-[var(--secondary)] text-[var(--background)] shadow-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo / brand */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-wide">
          <Logo />
         
        </Link>

        {/* Menu (desktop) */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/user-guide" className="hover:underline">User guide</Link>
          <Link href="/faq" className="hover:underline">FAQs</Link>
        </nav>

        {/* User name – desktop only */}
        {loaded && user && (
          <div className="hidden md:block max-w-[240px] truncate font-medium">
            {user.name || user.email}
          </div>
        )}

        {/* Actions */}
        <div>
          {loaded && user ? (
            <button
              onClick={handleLogout}
              className="rounded-md bg-[var(--background)] px-3 py-1 text-sm font-medium text-[var(--secondary)] hover:bg-[var(--accent)] hover:text-[var(--background)] transition-colors"
            >
              Log out
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-[var(--background)] px-3 py-1 text-sm font-medium text-[var(--secondary)] hover:bg-[var(--accent)] hover:text-[var(--background)] transition-colors"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
