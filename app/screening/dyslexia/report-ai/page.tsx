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
    } catch {
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
    } catch (err: unknown) {
      if (typeof err === "object" && err && "message" in err) {
        setError((err as { message?: string }).message || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">AI generated dyslexia report</h1>

      {!caseId && (
        <p className="mt-5 text-red-600">No caseId was provided. Add caseId=XXXXXX to the URL.</p>
      )}

      <button
        onClick={generateReport}
        disabled={loading || !caseId}
        className={`mt-6 px-6 py-3 text-lg font-bold rounded bg-blue-700 text-white transition ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-800"}`}
      >
        {loading ? "Generating report" : "Generate AI report"}
      </button>

      {loading && (
        <p className="mt-5 text-lg">This will take 3 to 4 minutes as we are giving it our deepest consideration</p>
      )}

      {error && (
        <p className="mt-5 text-red-600 text-lg">{error}</p>
      )}

      {report && (
        <div className="mt-8 p-6 border-2 border-gray-300 rounded-lg bg-gray-50 leading-relaxed whitespace-pre-wrap text-lg">
          {report}
        </div>
      )}
    </div>
  );
}
