// app/screening/dyslexia/ScreeningWizard.tsx
"use client";

import { useEffect, useState } from "react";
import type { Section } from "../../../lib/dyslexiaQuestions";

type Props = {
  sections: Section[];
  caseId?: string | null;  // 👈 optional, so current calls still compile
};

type AnswersState = {
  [sectionId: string]: {
    [questionId: string]: string;
  };
};

const LOCAL_STORAGE_KEY = "dyslexia_screening_id";

export default function ScreeningWizard({ sections, caseId }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [screeningId, setScreeningId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const currentSection = sections[currentIndex];
  const sectionAnswers = answers[currentSection.id] || {};

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? window.localStorage.getItem(LOCAL_STORAGE_KEY)
        : null;
    if (stored) setScreeningId(stored);
  }, []);

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

  function isCurrentSectionComplete() {
    if (!currentSection.questions.length) return true;
    const current = answers[currentSection.id] || {};
    return currentSection.questions.every((q) => !!current[q.id]);
  }

  async function saveCurrentSection(showSavedMessage = false) {
    setSaving(true);
    setError(null);
    if (showSavedMessage) setSavedMessage(null);

    try {
      const res = await fetch("/api/screening/dyslexia/section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          screeningId,
          sectionId: currentSection.id,
          answers: sectionAnswers,
          caseId: caseId ?? undefined,  // 👈 send it if we have it
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || `HTTP ${res.status}`);
      }

      if (data.screeningId && !screeningId) {
        setScreeningId(data.screeningId);
        window.localStorage.setItem(LOCAL_STORAGE_KEY, data.screeningId);
      }

      if (showSavedMessage) {
        setSavedMessage("Section saved.");
      }
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "There was a problem saving this section.");
    } finally {
      setSaving(false);
    }
  }

  async function handleNext() {
    if (!isCurrentSectionComplete()) {
      setError("Please answer all questions in this section before continuing.");
      return;
    }
    await saveCurrentSection(true);
    if (currentIndex < sections.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  }

  async function handlePrevious() {
    await saveCurrentSection();
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }

  async function handleFinish() {
    if (!isCurrentSectionComplete()) {
      setError("Please answer all questions in this section before finishing.");
      return;
    }
    await saveCurrentSection(true);
    alert(
      "Screening saved. Later we can build a teacher report page to view this profile."
    );
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>
        {currentSection.title} ({currentIndex + 1} of {sections.length})
      </h2>

      {currentSection.description && <p>{currentSection.description}</p>}
      {currentSection.timed && (
        <p>
          This is a timed section. The assessor should time the activity and
          then record the result below.
        </p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
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

            {q.options && (
              <div>
                {q.options.map((opt) => (
                  <label
                    key={opt.value}
                    style={{ display: "block", marginBottom: "0.4rem" }}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={opt.value}
                      checked={sectionAnswers[q.id] === opt.value}
                      onChange={(e) =>
                        handleChange(q.id, e.target.value)
                      }
                    />{" "}
                    {opt.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
        {savedMessage && (
          <p style={{ color: "green", marginTop: "0.5rem" }}>{savedMessage}</p>
        )}
        {saving && <p>Saving section…</p>}

        <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentIndex === 0 || saving}
          >
            Previous
          </button>

          {currentIndex < sections.length - 1 && (
            <button
              type="button"
              onClick={handleNext}
              disabled={saving}
            >
              Save and continue
            </button>
          )}

          {currentIndex === sections.length - 1 && (
            <button
              type="button"
              onClick={handleFinish}
              disabled={saving}
            >
              Save and finish
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
