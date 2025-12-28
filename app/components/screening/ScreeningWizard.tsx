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

  // Always call useEffect, but only fetch if readingYear is present
  useEffect(() => {
    if (!readingYear) return;
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
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="text-center mt-8">Loading questions…</p>;
  if (error) return <p className="text-red-600 text-center mt-8">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-xl font-semibold mb-6 text-center">
        {screeningType.toUpperCase()} Screening (Reading Year {readingYear})
      </h2>

      {questions.map((q) => (
        <div key={q._id} className="mb-6 bg-white rounded-lg border p-4">
          <p className="font-medium mb-3">
            <span className="block text-sm text-gray-500">{q.section || "Question"}</span> {q.text}
          </p>

          {!q.options || q.options.length === 0 ? (
            <input
              type="text"
              value={answers[q._id] || ""}
              onChange={(e) => handleAnswer(q._id, e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder={q.text}
              title={q.text}
            />
          ) : (
            <select
              value={answers[q._id] || ""}
              onChange={(e) => handleAnswer(q._id, e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
              title={q.text}
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
        className="w-full mt-8 rounded-md bg-black py-3 text-white font-semibold hover:bg-gray-800 disabled:opacity-50"
      >
        {submitting ? "Submitting…" : "Submit Screening"}
      </button>
    </div>
  );
}
