"use client";

import { useState } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

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
            <Link href="/protected/dashboard" style={{ color: "white", textDecoration: "none" }}>Dashboard</Link>
            <br />
            <Link href="/protected/account" style={{ color: "white", textDecoration: "none" }}>Account & Billing</Link>
            <br />
            <Link href="/protected/pricing" style={{ color: "white", textDecoration: "none" }}>View Plans & Pricing</Link>
            <br />
            <Link href="/protected/case/new" style={{ color: "white", textDecoration: "none" }}>New Case</Link>
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

          {/* ADMIN 
          <div style={{ fontSize: "14px", color: "#666", marginTop: "25px" }}>
            ADMIN
          </div>*/}

          {/*<div>
            <Link href="/admin/questions">Manage Questions</Link>
            <br />
            <Link href="/admin/questions/new">Add Question</Link>
            <br />
            <Link href="/protected/questions/upload">Upload Questions</Link>
          </div>*/}
        </>
      )}
    </div>
  );
}
