"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
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
        {/* User info (optional) */}
        {user && (user.name || user.email) && (
          <div className="ml-4 text-sm font-medium text-[var(--background)]/80">
            {user.name || user.email}
          </div>
        )}
        {/* Actions and Dropdown */}
        <div className="flex items-center gap-4 ml-auto">
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
          {/* Dropdown menu */}
          <DropdownMenu />
        </div>
      </div>
    </header>
  );
}



function DropdownMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-3 py-1 rounded-md bg-[var(--background)] text-[var(--secondary)] font-medium text-sm hover:bg-[var(--accent)] hover:text-[var(--background)] transition-colors"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {/* Hamburger icon on mobile, 'Menu' text on md+ */}
        <span className="block md:hidden">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <rect x="4" y="6" width="16" height="2" rx="1" />
            <rect x="4" y="11" width="16" height="2" rx="1" />
            <rect x="4" y="16" width="16" height="2" rx="1" />
          </svg>
        </span>
        <span className="hidden md:inline">Menu</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-[var(--background)] text-[var(--secondary)] z-50 border border-[var(--secondary)]/10">
          <hr className="my-2 border-[var(--secondary)]/20" />
          {/* Sidebar links */}
          <Link href="/protected/dashboard" className="block px-4 py-2 hover:bg-[var(--secondary)] hover:text-white transition-colors">Dashboard</Link>
          <Link href="/protected/account" className="block px-4 py-2 hover:bg-[var(--secondary)] hover:text-white transition-colors">Account & Billing</Link>
          <Link href="/protected/pricing" className="block px-4 py-2 hover:bg-[var(--secondary)] hover:text-white transition-colors">View Plans & Pricing</Link>
          <Link href="/user-guide" className="block px-4 py-2 hover:bg-[var(--secondary)] hover:text-white transition-colors">User Guide</Link>
          <Link href="/about" className="block px-4 py-2 hover:bg-[var(--secondary)] hover:text-white transition-colors">About</Link>
          <Link href="/faq" className="block px-4 py-2 hover:bg-[var(--secondary)] hover:text-white transition-colors">FAQ</Link>
          <Link href="/scoring-guide" className="block px-4 py-2 hover:bg-[var(--secondary)] hover:text-white transition-colors">Scoring Guide</Link>
          <Link href="/privacy" className="block px-4 py-2 hover:bg-[var(--secondary)] hover:text-white transition-colors">Privacy & GDPR</Link>
          <Link href="/contact" className="block px-4 py-2 hover:bg-[var(--secondary)] hover:text-white transition-colors">Contact Us</Link>
          {/* Admin section */}
          <div className="px-4 pt-2 pb-1 text-xs text-[var(--secondary)]/70 font-bold">ADMIN</div>
          <Link href="/admin/activity-logs" className="block px-4 py-2 hover:bg-[var(--secondary)] hover:text-white transition-colors">Activity Logs</Link>
          <Link href="/admin/vouchers" className="block px-4 py-2 hover:bg-[var(--secondary)] hover:text-white transition-colors">Vouchers</Link>
        </div>
      )}
    </div>
  );
}
