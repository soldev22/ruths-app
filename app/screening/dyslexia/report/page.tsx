"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function TeacherReportPage() {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId");

  const [loading, setLoading] = useState(true);
  const [screening, setScreening] = useState<any>(null);
  const [questionLookup, setQuestionLookup] = useState<Record<string, string>>(
    {}
  );
  const [scoring, setScoring] = useState<any>(null);

  const [studentName, setStudentName] = useState("");
  const [notes, setNotes] = useState("");

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
        console.error("Failed to load report:", err);
        setLoading(false);
      }
    }

    loadData();
  }, [caseId]);

  async function downloadWord() {
    const res = await fetch(
      `/api/screening/dyslexia/export-word?caseId=${caseId}&notes=${encodeURIComponent(
        notes
      )}&studentName=${encodeURIComponent(studentName)}`
    );

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `dyslexia-report-${caseId}.docx`;
    a.click();

    window.URL.revokeObjectURL(url);
  }

  if (!caseId) return <p>No caseId provided.</p>;
  if (loading) return <p>Loading report…</p>;
  if (!screening) return <p>No screening found for Case ID: {caseId}</p>;

  // Helper to colour each section
  function getColour(percent: number) {
    if (percent > 60) return "red";
    if (percent > 40) return "orange";
    if (percent > 25) return "gold";
    return "green";
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
        Teacher Screening Report
      </h1>

      {/* STUDENT DETAILS PANEL */}
      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          background: "#eef6ff",
          borderRadius: "10px",
          borderLeft: "6px solid #0070f3",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "10px", color: "#0070f3" }}>
          Student Details
        </h2>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ fontWeight: "bold" }}>Student Name: </label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Enter student name (not saved)"
            style={{
              marginLeft: "10px",
              padding: "6px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              width: "260px",
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: "bold" }}>Case ID: </label>
          <span>{caseId}</span>
        </div>

        <div style={{ marginTop: "15px" }}>
          <label style={{ fontWeight: "bold" }}>Teacher Notes:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes included in Word export"
            style={{
              width: "100%",
              height: "100px",
              marginTop: "5px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />
        </div>
      </div>

      {/* OVERALL SCORE CARD */}
      {scoring && (
        <div
          style={{
            marginTop: "25px",
            borderLeft: `8px solid ${getColour(scoring.overallPercent)}`,
            padding: "15px 20px",
            background: "#f9f9f9",
            borderRadius: "8px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.4rem" }}>Overall Indicators</h2>
          <p style={{ marginTop: "8px", fontSize: "1.1rem" }}>
            <strong>{scoring.overallPercent}%</strong> — {scoring.indicator}
          </p>
        </div>
      )}

      <hr style={{ margin: "30px 0" }} />

      {/* SECTION REPORTS */}
      {screening.sections.map((section: any, index: number) => {
        const answers = Object.values(section.answers);
        const hard = answers.filter((a: any) => String(a).length > 6).length;
        const percent = Math.round((hard / answers.length) * 100);
        const colour = getColour(percent);

        return (
          <div
            key={index}
            style={{
              marginBottom: "25px",
              padding: "15px",
              borderRadius: "8px",
              background: "#fff",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              borderLeft: `6px solid ${colour}`,
            }}
          >
            <h3
              style={{
                fontSize: "1.3rem",
                fontWeight: "bold",
                color: "#0070f3",
                marginBottom: "4px",
              }}
            >
              {section.sectionId}
            </h3>

            <p style={{ marginTop: 0, opacity: 0.7 }}>
              Section Difficulty: {percent}%
            </p>

            <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
              {Object.entries(section.answers).map(([questionId, answer]) => {
                const text = questionLookup[questionId] || "(Question deleted)";
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
        onClick={downloadWord}
        style={{
          marginTop: "20px",
          background: "#0070f3",
          color: "white",
          padding: "12px 18px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          fontSize: "1rem",
        }}
      >
        Download Word Report
      </button>

      <div style={{ marginTop: "20px" }}>
        <Link href={`/screening/dyslexia/overview?caseId=${caseId}`}>
          ← Back to Overview
        </Link>
      </div>
    </main>
  );
}
