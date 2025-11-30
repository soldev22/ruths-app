// app/somewhere/ScreeningWizard.tsx (keep the same path you already use)
"use client";

import { useEffect, useState } from "react";
import type { Section } from "../../../lib/dyslexiaQuestions";

type Props = {
  sections: Section[];
  caseId?: string | null;
};

type AnswersState = {
  [sectionId: string]: { [questionId: string]: string };
};

// Safe JSON helper
async function safeJson(res: Response) {
  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse JSON. Raw response was:", text);
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

  // ✅ Load existing screening answers for this caseId on mount
  useEffect(() => {
    async function loadScreening() {
      if (!caseId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/screening/dyslexia/section?caseId=${encodeURIComponent(
            caseId
          )}`
        );

        if (!res.ok) {
          const txt = await res.text();
          console.error(
            "Failed to load dyslexia screening. Status:",
            res.status,
            "Body:",
            txt
          );
          setLoading(false);
          return;
        }

        const data = await safeJson(res);
        if (!data || !data.exists) {
          setLoading(false);
          return;
        }

        const screening = data.screening;

        const loaded: AnswersState = {};
        (screening.sections || []).forEach((s: any) => {
          const secId = s.sectionId;
          const ansMap = s.answers || {};
          loaded[secId] = {};

          Object.keys(ansMap).forEach((qId) => {
            loaded[secId][qId] = ansMap[qId];
          });
        });

        setAnswers(loaded);
      } catch (err) {
        console.error("Failed to load dyslexia screening:", err);
      } finally {
        setLoading(false);
      }
    }

    loadScreening();
  }, [caseId]);

  // Handle answer selection
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

  // Ensure all questions answered before moving on
  function isCurrentSectionComplete() {
    if (!currentSection.questions.length) return true;
    const current = answers[currentSection.id] || {};
    return currentSection.questions.every((q) => !!current[q.id]);
  }

  // Save a section to the API
  async function saveCurrentSection(showSavedMessage = false) {
    if (!caseId) {
      setError("Missing caseId – cannot save.");
      return;
    }

    setSaving(true);
    setError(null);
    if (showSavedMessage) setSavedMessage(null);

    try {
      const payload = {
        sectionId: currentSection.id,
        answers: sectionAnswers,
        caseId,
      };

      console.log("SAVE PAYLOAD:", payload);

      const res = await fetch("/api/screening/dyslexia/section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data: any = null;

      if (text) {
        try {
          data = JSON.parse(text);
        } catch (err) {
          console.error(
            "Failed to parse JSON from save response. Raw body:",
            text
          );
          throw err;
        }
      }

      if (!res.ok) {
        console.error("Save failed. Status:", res.status, "Body:", text);
        throw new Error(data?.error || `HTTP ${res.status}`);
      }

      if (showSavedMessage) setSavedMessage("Section saved.");
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "There was a problem saving this section.");
    } finally {
      setSaving(false);
    }
  }

  // NEXT section handler, with final redirect
  async function handleNext() {
    if (!isCurrentSectionComplete()) {
      setError(
        "Please answer all questions in this section before continuing."
      );
      return;
    }

    await saveCurrentSection(true);

    const isLast = currentIndex === sections.length - 1;

    if (isLast) {
      if (caseId) {
        window.location.href = `/screening/dyslexia/overview?caseId=${caseId}`;
      } else {
        alert("Saved, but no caseId was provided.");
      }
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
      setError("Please answer all questions in this section before finishing.");
      return;
    }

    await saveCurrentSection(true);

    if (caseId) {
      window.location.href = `/screening/dyslexia/overview?caseId=${caseId}`;
    } else {
      alert("Saved, but missing caseId for redirect.");
    }
  }

  if (loading) {
    return <p>Loading screening…</p>;
  }

  if (!caseId) {
    return <p>No caseId provided – cannot run screening.</p>;
  }

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

            {q.options?.map((opt) => (
              <label
                key={opt.value}
                style={{ display: "block", marginBottom: "0.4rem" }}
              >
                <input
                  type="radio"
                  name={q.id}
                  value={opt.value}
                  checked={sectionAnswers[q.id] === opt.value}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                />{" "}
                {opt.label}
              </label>
            ))}
          </div>
        ))}

        {error && <p style={{ color: "red" }}>{error}</p>}
        {savedMessage && <p style={{ color: "green" }}>{savedMessage}</p>}
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
