"use client";

import { useState } from "react";

export default function SectionPanel({ title, colour, children }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        marginBottom: "15px",
        overflow: "hidden",
        display: "flex",
      }}
    >
      {/* LEFT COLOUR BAR */}
      <div
        style={{
          width: "10px",
          background: colour,
        }}
      />

      {/* CONTENT */}
      <div style={{ flex: 1 }}>
        <button
          onClick={() => setOpen(!open)}
          style={{
            width: "100%",
            textAlign: "left",
            padding: "10px 15px",
            background: "#f7f7f7",
            border: "none",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          {title}
          <span style={{ float: "right" }}>{open ? "▲" : "▼"}</span>
        </button>

        {open && (
          <div style={{ padding: "15px", background: "white" }}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
