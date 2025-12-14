"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setIsAdmin(data.user?.isAdmin || false);
        }
      } catch (err) {
        console.error("Error checking admin status:", err);
      }
    }
    checkAdmin();
  }, []);

  return (
    <div
      style={{
        width: open ? "240px" : "40px",
        transition: "0.2s ease",
        background: "#1e3a8a",
        color: "white",
        padding: "12px",
        borderRight: "1px solid #ddd",
        minHeight: "100vh",
      }}
    >
      {/* TOGGLE BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "block",
          marginBottom: "20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
          color: "white",
        }}
      >
        {open ? "◀ Hide" : "▶"}
      </button>

      {/* MAIN NAV */}
      {open && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <Link 
              href="/protected/case/new" 
              style={{ 
                color: "white", 
                textDecoration: "none",
                display: "inline-block",
                background: "#3b82f6",
                padding: "8px 12px",
                borderRadius: "6px",
                fontWeight: "600",
                marginBottom: "12px",
                width: "100%",
                textAlign: "center"
              }}
            >
              ➕ New Assessment
            </Link>
            <br />
            <Link href="/protected/dashboard" style={{ color: "white", textDecoration: "none" }}>Dashboard</Link>
            <br />
            <Link href="/protected/account" style={{ color: "white", textDecoration: "none" }}>Account & Billing</Link>
            <br />
            <Link href="/protected/pricing" style={{ color: "white", textDecoration: "none" }}>View Plans & Pricing</Link>
            <br />
            <Link href="/user-guide" style={{ color: "white", textDecoration: "none" }}>User Guide</Link>
            <br />
            <Link href="/about" style={{ color: "white", textDecoration: "none" }}>About</Link>
            <br />
            <Link href="/faq" style={{ color: "white", textDecoration: "none" }}>FAQ</Link>
            <br />
            <Link href="/scoring-guide" style={{ color: "white", textDecoration: "none" }}>Scoring Guide</Link>
            <br />
            <Link href="/privacy" style={{ color: "white", textDecoration: "none" }}>Privacy & GDPR</Link>
            <br />
            <Link href="/contact" style={{ color: "white", textDecoration: "none" }}>Contact Us</Link>
            <br />
          </div>

          {/* ADMIN - Only visible to admin users */}
          {isAdmin && (
            <>
              <div style={{ fontSize: "12px", color: "#93c5fd", marginTop: "25px", marginBottom: "10px" }}>
                ADMIN
              </div>

              <div>
                <Link href="/admin/activity-logs" style={{ color: "white", textDecoration: "none" }}>Activity Logs</Link>
                <br />
                <Link href="/admin/vouchers" style={{ color: "white", textDecoration: "none" }}>Vouchers</Link>
                <br />
                <Link href="/social-media" style={{ color: "white", textDecoration: "none" }}>Social Media</Link>
                <br />
              </div>

              <div style={{ fontSize: "12px", color: "#93c5fd", marginTop: "20px", marginBottom: "10px" }}>
                SOCIAL MEDIA
                  <div>{/* Social Media links removed */}</div>
                <br />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
