"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DyslexiaOverviewPage() {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId");

  const [loading, setLoading] = useState(true);
  const [screening, setScreening] = useState<any>(null);
  const [questionLookup, setQuestionLookup] = useState<Record<string, string>>(
    {}
  );
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
    return <p>Loading…</p>;
  }

  if (!screening) {
    return <p>No screening found for Case ID: {caseId}</p>;
  }

  // Colour style for severity bands
  const bandColors: any = {
    green: "#c7f5d9",
    amber: "#ffe9b3",
    red: "#ffb3b3",
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.2rem", fontWeight: "bold" }}>
        Dyslexia Screening Overview
      </h1>

      <p style={{ marginTop: "10px", fontSize: "1.2rem" }}>
        Case ID: <strong>{caseId}</strong>
      </p>

      {/* OVERALL SCORE BLOCK */}
      {scoring && (
        <div
          style={{
            marginTop: "25px",
            padding: "20px",
            borderRadius: "10px",
            background: "#eef6ff",
            border: "1px solid #cfe2ff",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            Overall Score
          </h2>

          <p style={{ fontSize: "2.5rem", marginTop: "10px", fontWeight: "900" }}>
            {scoring.overallPercent}%
          </p>

          <p style={{ fontSize: "1.2rem", marginTop: "5px" }}>
            Dyslexia Indicator:{" "}
            <strong style={{ fontSize: "1.3rem" }}>{scoring.indicator}</strong>
          </p>
        </div>
      )}

      <hr style={{ margin: "30px 0" }} />

      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Section Results</h2>

      {screening.sections.map((section: any) => {
        const secScore = scoring?.sectionScores?.[section.sectionId];
        const color = bandColors[secScore?.band] || "#eee";

        return (
          <div
            key={section.sectionId}
            style={{
              marginTop: "20px",
              padding: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              background: color,
            }}
          >
            <h3 style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
              {section.sectionId}
            </h3>

            {/* Section difficulty */}
            {secScore && (
              <p style={{ marginTop: "8px", fontSize: "1rem" }}>
                Difficulty Score:{" "}
                <strong>{secScore.difficultyPercent}%</strong> (
                {secScore.band.toUpperCase()})
              </p>
            )}

            {/* Answers */}
            <ul style={{ marginTop: "12px", paddingLeft: "20px" }}>
              {Object.entries(section.answers).map(([questionId, answer]) => {
                const text =
                  questionLookup[questionId] || "(Question no longer exists)";
                return (
                  <li key={questionId} style={{ marginBottom: "6px" }}>
                    <strong>{text}:</strong> {answer}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
      <button
  onClick={() => {
    window.location.href = `/screening/dyslexia/report?caseId=${caseId}`;
  }}
  style={{
    marginTop: "25px",
    padding: "12px 20px",
    background: "#004c99",
    color: "white",
    borderRadius: "6px",
    fontSize: "1rem",
    border: "none",
    cursor: "pointer",
  }}
>
  View Teacher Report
</button>

    </main>
  );
}
