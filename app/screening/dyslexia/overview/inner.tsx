"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OverviewInner() {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId");

  const [loading, setLoading] = useState(true);
  const [screening, setScreening] = useState<any>(null);
  const [questionLookup, setQuestionLookup] = useState<Record<string, string>>({});
  const [scoring, setScoring] = useState<any>(null);

  useEffect(() => {
    if (!caseId) return;

    async function loadData() {
      try {
        const res = await fetch(`/api/screening/dyslexia/list?caseId=${caseId}`);
        const data = await res.json();

        setScreening(data.screening || null);
        setQuestionLookup(data.questionLookup || {});
        setScoring(data.scoring || null);

        setLoading(false);
      } catch (err) {
        console.error("Failed to load overview:", err);
        setLoading(false);
      }
    }

    loadData();
  }, [caseId]);

  if (!caseId) {
    return <p>No caseId provided.</p>;
  }

  if (loading) {
    return <p>Loading overview…</p>;
  }

  if (!screening) {
    return <p>No screening found for Case ID: {caseId}</p>;
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
        Dyslexia Screening Overview
      </h1>

      <p style={{ marginTop: "10px", fontSize: "1.2rem" }}>
        Case ID: <strong>{caseId}</strong>
      </p>

      {scoring && (
        <div style={{ marginTop: "20px" }}>
          <h2 style={{ fontWeight: "bold" }}>Overall Score</h2>
          <p>
            <strong>{scoring.overallPercent}%</strong> – {scoring.indicator}
          </p>
        </div>
      )}

      <hr style={{ margin: "20px 0" }} />

      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Saved Answers</h2>

      {screening.sections.map((section: any) => (
        <div
          key={section.sectionId}
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <h3 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
            {section.sectionId}
          </h3>

          <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
            {Object.entries(section.answers).map(([questionId, answer]) => {
              const text = questionLookup[questionId] || "(Question deleted)";
              return (
                <li key={questionId} style={{ marginBottom: "6px" }}>
                  <strong>{text}:</strong> {String(answer)}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </main>
  );
}
