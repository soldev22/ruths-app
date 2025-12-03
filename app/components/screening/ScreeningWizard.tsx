"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Question = {
  _id: string;
  text: string;
  section?: string;
  options?: string[];
};

type Props = {
  caseId: string;
  screeningType: string;
  readingYear?: number | null; // passed in manually
};

export default function ScreeningWizard({
  caseId,
  screeningType,
  readingYear = null,
}: Props) {
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Teacher MUST pass readingYear
  if (!readingYear) {
    return (
      <p style={{ color: "red" }}>
        No reading year provided. Please select reading year before starting
        screening.
      </p>
    );
  }

  // Load the correct reading-year question set
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/questions?type=${screeningType}&year=${readingYear}`
        );

        const data = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.error || "Failed to load questions.");
        }

        setQuestions(data.questions);
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

      if (!res.ok) throw new Error("Failed to submit screening");

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
      <h2>
        {screeningType.toUpperCase()} Screening (Reading Year {readingYear})
      </h2>

      {questions.map((q) => (
        <div key={q._id} style={{ marginBottom: "1rem" }}>
          <p>
            <strong>{q.section || "Question"}:</strong> {q.text}
          </p>

          {!q.options || q.options.length === 0 ? (
            <input
              type="text"
              value={answers[q._id] || ""}
              onChange={(e) => handleAnswer(q._id, e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          ) : (
            <select
              value={answers[q._id] || ""}
              onChange={(e) => handleAnswer(q._id, e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
            >
              <option value="">Select…</option>
              {q.options.map((opt, idx) => (
                <option key={idx} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}

      <button
        disabled={submitting}
        onClick={handleSubmit}
        style={{
          width: "100%",
          padding: "0.8rem",
          background: "black",
          color: "white",
          borderRadius: "6px",
        }}
      >
        {submitting ? "Submitting…" : "Submit Screening"}
      </button>
    </div>
  );
}
