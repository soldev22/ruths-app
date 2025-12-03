"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Question = {
  _id: string;
  text: string;
  section: string;
  options?: string[];
};

export default function ScreeningWizard({
  caseId,
  screeningType,
  readingYear,
}: {
  caseId: string;
  screeningType: string;
  readingYear: number | null;
}) {
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [id: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load questions dynamically
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const url = readingYear
          ? `/api/questions?type=${screeningType}&year=${readingYear}`
          : `/api/questions?type=${screeningType}`;

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Failed to load questions");
        }

        const data = await res.json();
        setQuestions(data.questions || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [screeningType, readingYear]);

  function handleAnswer(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    try {
      const formatted = Object.entries(answers).map(([id, answer]) => ({
        questionId: id,
        answer,
      }));

      const res = await fetch("/api/screenings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId,
          screeningType,
          readingYear,
          answers: formatted,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit screening");
      }

      router.push(`/protected/case/${caseId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p>Loading questions…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "1rem", maxWidth: "700px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "1rem" }}>
        {screeningType.toUpperCase()} Screening
      </h2>

      {questions.map((q) => (
        <div
          key={q._id}
          style={{
            marginBottom: "1.5rem",
            padding: "1rem",
            border: "1px solid #444",
            borderRadius: "8px",
          }}
        >
          <p><strong>{q.section}</strong></p>
          <p style={{ marginBottom: "0.5rem" }}>{q.text}</p>

          {!q.options || q.options.length === 0 ? (
            <input
              type="text"
              value={answers[q._id] || ""}
              onChange={(e) => handleAnswer(q._id, e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #333",
                borderRadius: "6px",
              }}
            />
          ) : (
            <select
              value={answers[q._id] || ""}
              onChange={(e) => handleAnswer(q._id, e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #333",
                borderRadius: "6px",
              }}
            >
              <option value="">Select…</option>
              {q.options.map((opt, index) => (
                <option key={index} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        style={{
          padding: "0.8rem 1.4rem",
          background: "black",
          color: "white",
          borderRadius: "6px",
          width: "100%",
        }}
      >
        {submitting ? "Submitting…" : "Submit Screening"}
      </button>
    </div>
  );
}

