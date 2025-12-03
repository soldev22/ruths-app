"use client";

import { useEffect, useState } from "react";

type Question = {
  id: string;
  text: string;
  options: string[];
  order?: number;
  readingYear?: number | null;
};

type Section = {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
};

type Props = {
  sections: Section[];
  caseId: string;
};

type AnswersState = {
  [sectionId: string]: { [questionId: string]: string };
};

// Helper safely reading JSON from API
async function safeJson(res: Response) {
  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse JSON. Raw:", text);
    throw err;
  }
}

export default function ScreeningWizard({ sections, caseId }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const currentSection = sections[currentIndex];
  const sectionAnswers = answers[currentSection.id] || {};

  //
  // LOAD EXISTING ANSWERS
  //
  useEffect(() => {
    async function load() {
      if (!caseId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/screening/dyslexia/section?caseId=${encodeURIComponent(caseId)}`
        );

        if (!res.ok) {
          console.error("Failed to load screening", res.status);
          setLoading(false);
          return;
        }

        const data = await safeJson(res);

        if (!data || !data.exists) {
          setLoading(false);
          return;
        }

        const screening = data.screening;

        const collected: AnswersState = {};
        (screening.sections || []).forEach((s: any) => {
          const secId = s.sectionId;
          const ansMap = s.answers || {};

          collected[secId] = {};
          Object.keys(ansMap).forEach((qId) => {
            collected[secId][qId] = ansMap[qId];
          });
        });

        setAnswers(collected);
      } catch (err) {
        console.error("Error loading screening:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [caseId]);

  //
  // HANDLE ANSWERS
  //
  function handleChange(questionId: string, value: string) {
    setAnswers((prev) => ({
      ...prev,
      [currentSection.id]: {
        ...(prev[currentSection.id] || {}),
        [questionId]: value,
      },
    }));

    setError(null);
    setSavedMessage(null);
  }

  //
  // VALIDATION
  //
  function isCurrentSectionComplete() {
    const current = answers[currentSection.id] || {};
    return currentSection.questions.every((q) => !!current[q.id]);
  }

  //
  // SAVE SECTION
  //
  async function saveCurrentSection(showMsg = false) {
    if (!caseId) {
      setError("Missing caseId — cannot save.");
      return;
    }

    setSaving(true);
    if (showMsg) setSavedMessage(null);

    try {
      const payload = {
        caseId,
        sectionId: currentSection.id,
        answers: answers[currentSection.id] || {},
      };

      const res = await fetch("/api/screening/dyslexia/section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data = null;

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          console.error("Invalid JSON from API:", text);
        }
      }

      if (!res.ok) {
        throw new Error(data?.error || "Save failed.");
      }

      if (showMsg) setSavedMessage("Section saved.");
    } catch (err: any) {
      setError(err.message || "Couldn't save section.");
    } finally {
      setSaving(false);
    }
  }

  //
  // NAVIGATION
  //
  async function handleNext() {
    if (!isCurrentSectionComplete()) {
      setError("Please answer all questions before continuing.");
      return;
    }

    await saveCurrentSection(true);

    const last = currentIndex === sections.length - 1;

    if (last) {
      window.location.href = `/screening/dyslexia/overview?caseId=${caseId}`;
      return;
    }

    setCurrentIndex((i) => i + 1);
  }

  async function handlePrevious() {
    await saveCurrentSection();
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }

  async function handleFinish() {
    if (!isCurrentSectionComplete()) {
      setError("Please complete this section before finishing.");
      return;
    }

    await saveCurrentSection(true);

    window.location.href = `/screening/dyslexia/overview?caseId=${caseId}`;
  }

  if (loading) return <p>Loading screening…</p>;
  if (!caseId) return <p>No caseId provided.</p>;

  //
  // RENDER
  //
  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>
        {currentSection.title} ({currentIndex + 1} of {sections.length})
      </h2>

      {currentSection.description && <p>{currentSection.description}</p>}

      <form onSubmit={(e) => e.preventDefault()}>
        {currentSection.questions.map((q) => (
          <div
            key={q.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "4px",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <p>{q.text}</p>

            {/* FIXED: unique key using index */}
            {q.options?.map((opt, i) => (
              <label
                key={`${q.id}_${i}`}
                style={{ display: "block", marginBottom: "0.4rem" }}
              >
                <input
                  type="radio"
                  name={q.id}
                  value={opt}
                  checked={sectionAnswers[q.id] === opt}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                />{" "}
                {opt}
              </label>
            ))}
          </div>
        ))}

        {error && <p style={{ color: "red" }}>{error}</p>}
        {savedMessage && <p style={{ color: "green" }}>{savedMessage}</p>}
        {saving && <p>Saving…</p>}

        <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentIndex === 0 || saving}
          >
            Previous
          </button>

          {currentIndex < sections.length - 1 && (
            <button type="button" onClick={handleNext} disabled={saving}>
              Save and continue
            </button>
          )}

          {currentIndex === sections.length - 1 && (
            <button type="button" onClick={handleFinish} disabled={saving}>
              Save and finish
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
