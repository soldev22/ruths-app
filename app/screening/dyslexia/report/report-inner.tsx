"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ReportInner() {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId");

  const [loading, setLoading] = useState(true);
  const [screening, setScreening] = useState<any>(null);
  const [questionLookup, setQuestionLookup] = useState<Record<string, string>>({});
  const [scoring, setScoring] = useState<any>(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!caseId) return;

    async function load() {
      try {
        const res = await fetch(`/api/screening/dyslexia/list?caseId=${caseId}`);
        const data = await res.json();

        setScreening(data.screening);
        setQuestionLookup(data.questionLookup);
        setScoring(data.scoring);
        setLoading(false);
      } catch (e) {
        console.error("LOAD ERROR", e);
        setLoading(false);
      }
    }

    load();
  }, [caseId]);

  if (!caseId) return <p>No caseId provided.</p>;
  if (loading) return <p>Loading…</p>;
  if (!screening) return <p>No screening found.</p>;

  function exportWord() {
    window.location.href = `/api/screening/dyslexia/export-word?caseId=${caseId}&notes=${encodeURIComponent(
      notes
    )}`;
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
        Teacher Report
      </h1>

      <p>Case ID: {caseId}</p>

      {/* Notes input */}
      <div style={{ marginTop: "20px" }}>
        <label style={{ display: "block", fontWeight: "bold" }}>
          Teacher Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={exportWord}
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            background: "black",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Download Word Report
        </button>
      </div>

      {/* Scoring */}
      {scoring && (
        <div style={{ marginTop: "30px" }}>
          <h2>Overall Score</h2>
          <p>{scoring.overallPercent}% – {scoring.indicator}</p>
        </div>
      )}

      <hr style={{ margin: "20px 0" }} />

      {/* Sections */}
      {screening.sections.map((section: any) => (
        <div key={section.sectionId} style={{ marginBottom: "25px" }}>
          <h3 style={{ fontWeight: "bold" }}>{section.sectionId}</h3>

          <ul>
            {Object.entries(section.answers).map(([qid, ans]: any) => (
              <li key={qid}>
                <strong>{questionLookup[qid] || "Unknown question"}:</strong>{" "}
                {String(ans)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </main>
  );
}
