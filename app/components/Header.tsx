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
          credentials: "include", // ← **THIS FIXES THE LOGIN STATE**
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
      credentials: "include", // ← **THIS FIXES LOGOUT**
    });

    window.location.href = "/register";
  }

  return (
    <header style={{ 
      width: "100%", 
      background: "#1e3a8a", 
      color: "white", 
      padding: "0.75rem 1.5rem", 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center", 
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)" 
    }}>
      <Link href="/" style={{ fontSize: "1.25rem", fontWeight: "bold", color: "white", textDecoration: "none", display: "flex", alignItems: "center" }}>
        <Logo />
        SkillScan
      </Link>

      {loaded && user && (
        <span style={{ 
          fontSize: "1.5rem", 
          fontWeight: "bold", 
          position: "absolute", 
          left: "50%", 
          transform: "translateX(-50%)" 
        }}>
          Logged In: {user.name || user.email}
          {user.email === 'mike@test.com' && (
            <> | <Link href="/social-media" style={{ color: "white", textDecoration: "underline", marginLeft: "1rem" }}>Social Media</Link></>
          )}
        </span>
      )}

      <div>
        {loaded && user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <button
              onClick={handleLogout}
              style={{
                background: "white",
                color: "#1e3a8a",
                padding: "0.25rem 0.75rem",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
              }}
            >
              Log Out
            </button>
          </div>
        ) : (
          <Link
            href="/register"
            style={{
              background: "white",
              color: "#1e3a8a",
              padding: "0.25rem 0.75rem",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              fontWeight: "600",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
