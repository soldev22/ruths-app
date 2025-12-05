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
        background: "#f1f1f1",
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
        }}
      >
        {open ? "◀ Hide" : "▶"}
      </button>

      {/* MAIN NAV */}
      {open && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <Link href="/protected/dashboard">Dashboard</Link>
            <br />
            <Link href="/protected/case/new">New Case</Link>
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
