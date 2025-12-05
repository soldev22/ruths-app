"use client";

import { useState, useEffect } from "react";

// REMOVE all punctuation except , and .
function sanitizeReport(text: string): string {
  return text.replace(/[^\w\s,.]/g, ""); 
}

export default function AIReportPage() {
  const [caseId, setCaseId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      setCaseId(params.get("caseId"));
    } catch (e) {
      setCaseId(null);
    }
  }, []);

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generateReport() {
    if (!caseId) {
      setError("Missing case ID.");
      return;
    }

    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const res = await fetch("/api/screening/dyslexia/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Failed to generate report");
      }

      const data = await res.json();

      // CLEAN REPORT BEFORE DISPLAY
      const cleaned = sanitizeReport(data.report);

      setReport(cleaned);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>
        AI Generated Dyslexia Report
      </h1>

      {!caseId && (
        <p style={{ marginTop: "20px", color: "red" }}>
          No caseId was provided Add caseIdXXXXXX to the URL
        </p>
      )}

      <button
        onClick={generateReport}
        disabled={loading || !caseId}
        style={{
          marginTop: "25px",
          padding: "12px 20px",
          fontSize: "18px",
          fontWeight: "bold",
          backgroundColor: "#005bbb",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Generating report" : "Generate AI Report"}
      </button>

      {loading && (
        <p style={{ marginTop: "20px", fontSize: "18px" }}>
          This will take 3 to 4 minutes as we are giving it our deepest consideration
        </p>
      )}

      {error && (
        <p style={{ marginTop: "20px", color: "red", fontSize: "18px" }}>
          {error}
        </p>
      )}

      {report && (
        <div
          style={{
            marginTop: "30px",
            padding: "25px",
            border: "2px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            lineHeight: "1.6",
            whiteSpace: "pre-wrap",
            fontSize: "18px",
          }}
        >
          {report}
        </div>
      )}
    </div>
  );
}
