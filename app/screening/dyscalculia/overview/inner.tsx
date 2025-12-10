"use client";

import { useEffect, useState } from "react";

type SectionScore = {
  sectionId: string;
  correct: number;
  total: number;
  percent: number;
  rag: "green" | "amber" | "red";
};

type FlatAnswer = {
  sectionId: string;
  questionId: string;
  questionText: string;
  answer: string;
  correctAnswer?: string | string[];
};

export default function OverviewInner(caseIdx: { caseIdx: string | null }) {
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<any>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [studentName, setStudentName] = useState("");
  const [teacherNotes, setTeacherNotes] = useState("");
  const [generating, setGenerating] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const caseId =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("caseId")
      : null;

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/screening/dyscalculia/details?caseId=${caseId}`);
      const data = await res.json();
      console.log("API RESPONSE:", data);
      setDetails(data);
      setLoading(false);
    }

    if (caseId) load();
  }, [caseId]);

  if (loading) return <p>Loading overview…</p>;
  if (!details || !details.screening)
    return <p>No screening data found for Case ID {caseId}.</p>;

  const { scoring, sectionScores, flatAnswers } = details;
  console.log("Section Scores:", sectionScores);

  const ragColours: any = {
    green: "#c6f6d5",
    amber: "#fefcbf",
    red: "#fed7d7",
  };

  const ragLabels: Record<string, string> = {
    green: "LOW",
    amber: "MODERATE",
    red: "HIGH RISK",
  };

  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold mb-4">Dyscalculia Review — Overview</h1>

      <p className="text-lg mb-1">
        <strong>Case ID:</strong> {caseId}
      </p>

      {/* Risk overview panel */}
      <div
        className="mb-6 p-4 rounded border"
        style={{
          background:
            scoring.classification === "High Risk"
              ? "#fed7d7"
              : scoring.classification === "Moderate Risk"
                ? "#fefcbf"
                : "#c6f6d5",
          borderColor:
            scoring.classification === "High Risk"
              ? "#f56565"
              : scoring.classification === "Moderate Risk"
                ? "#d69e2e"
                : "#38a169",
        }}
      >
        <h2 className="text-xl font-semibold mb-1">
          Overall Result: <span className="uppercase">{scoring.classification}</span>
        </h2>
        <p className="text-md">
          The screening shows <strong>{scoring.overallPercent}%</strong> indicators of difficulty, classified as <strong>{scoring.classification.toLowerCase()}</strong>.
        </p>
        <span
          className={`inline-block mt-2 px-3 py-1 rounded-full text-white text-sm font-semibold ${scoring.classification === "High Risk"
              ? "bg-red-600"
              : scoring.classification === "Moderate Risk"
                ? "bg-yellow-500"
                : "bg-green-600"
            }`}
        >
          {scoring.classification}
        </span>

        {/* Generate Report Button */}
        <div className="mt-4 pt-4 border-t border-gray-400">
          <button
            onClick={async () => {
              setGenerating(true);
              setAiReport(null);
              try {
                const res = await fetch("/api/screening/dyscalculia/generate-report", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    caseId,
                  }),
                });

                if (!res.ok) {
                  const errorText = await res.text();
                  throw new Error(`Failed to generate report: ${errorText}`);
                }

                const data = await res.json();
                setAiReport(data.report);
              } catch (err: any) {
                console.error("AI Report Error:", err);
                alert("Could not generate AI report. See console for details.");
              } finally {
                setGenerating(false);
              }
            }}
            disabled={generating}
            className={`px-6 py-3 rounded-lg text-white font-semibold text-lg w-full ${
              generating ? "bg-gray-500 cursor-not-allowed" : "bg-purple-700 hover:bg-purple-800"
            }`}
          >
            {generating ? "Generating Report..." : "📝 Generate Report"}
          </button>
        </div>
      </div>

      {/* Student name and notes input - MOVED HERE */}
      <div className="mb-6 border p-4 rounded bg-blue-50">
        <h3 className="font-bold text-lg mb-3">📝 Report Details</h3>
        <label className="block mb-2 font-semibold">Student Name (optional):</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 mb-4"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Enter student name..."
        />
        
        <label className="block mb-2 font-semibold">Additional Notes (optional):</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          rows={4}
          value={teacherNotes}
          onChange={(e) => setTeacherNotes(e.target.value)}
          placeholder="Add observations, context, or recommendations..."
        />
        <p className="text-sm text-gray-500 mt-1">
          These details will be included in your downloadable report.
        </p>
      </div>

      {/* Section cards */}
      {sectionScores.map((sec: SectionScore) => {
        const isOpen = openSection === sec.sectionId;

        return (
          <div
            key={sec.sectionId}
            className="mb-4 border rounded-lg overflow-hidden"
            style={{
              display: "flex",
              background: ragColours[sec.rag] + "55",
            }}
          >
            {/* RAG side bar */}
            <div
              style={{
                width: "10px",
                background: ragColours[sec.rag],
              }}
            />

            {/* Main section */}
            <div className="flex-1 p-4">
              <button
                className="flex items-center justify-between w-full"
                onClick={() =>
                  setOpenSection(isOpen ? null : sec.sectionId)
                }
              >
                <div className="text-left">
                  <h2 className="text-xl font-semibold">{sec.sectionId}</h2>
                  <p className="text-sm text-gray-700">
                    Score: {sec.percent}%
                  </p>
                </div>

                {/* Badge and arrow */}
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-white text-xs font-bold ${sec.rag === "red"
                        ? "bg-red-600"
                        : sec.rag === "amber"
                          ? "bg-yellow-500"
                          : "bg-green-600"
                      }`}
                  >
                    {ragLabels[sec.rag]}
                  </span>
                  <span
                    style={{
                      display: "inline-block",
                      transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
                      transition: "transform 0.2s ease",
                      fontSize: "1.2rem",
                    }}
                  >
                    ▶
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className="mt-3">
                  {flatAnswers
                    .filter((a: FlatAnswer) => a.sectionId === sec.sectionId)
                    .map((a: FlatAnswer) => (
                      <div key={a.questionId} className="mb-3">
                        <p className="font-medium">{a.questionText}</p>
                        <p className="text-gray-700">
                          <strong>Student answered:</strong> {a.answer}
                        </p>
                        {a.correctAnswer && (
                          <p className="text-gray-600 text-sm">
                            <strong>Correct answer:</strong> {Array.isArray(a.correctAnswer) ? a.correctAnswer.join(" / ") : a.correctAnswer}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Loading/Success Modal */}
      {generating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-700 mx-auto mb-4"></div>
              <h3 className="text-xl font-bold mb-2">Generating Report</h3>
              <p className="text-gray-600">
                Please wait while we analyze the assessment results and generate your professional report.
              </p>
              <p className="text-sm text-gray-500 mt-4">
                This may take 10-30 seconds...
              </p>
            </div>
          </div>
        )}

        {aiReport && !generating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
              <div className="text-green-600 text-6xl mb-4">✓</div>
              <h3 className="text-2xl font-bold mb-4">Report Ready!</h3>
              <p className="text-gray-600 mb-6">
                Your assessment report has been generated and is ready to download.
              </p>
              
              <button
                onClick={async () => {
                  try {
                    const res = await fetch("/api/screening/dyscalculia/export-ai-report", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        caseId,
                        studentName,
                        teacherNotes,
                        aiReport,
                        sectionScores,
                        flatAnswers,
                      }),
                    });

                    if (!res.ok) {
                      throw new Error("Failed to export report");
                    }

                    const blob = await res.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `dyscalculia-report-${caseId}.docx`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                    
                    // Close modal after download
                    setAiReport(null);
                  } catch (err: any) {
                    console.error("Export Error:", err);
                    alert("Could not export report to Word. See console for details.");
                  }
                }}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-lg mb-3 w-full"
              >
                Download Word Report
              </button>
              
              <button
                onClick={() => setAiReport(null)}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
    </div>
  );
}
