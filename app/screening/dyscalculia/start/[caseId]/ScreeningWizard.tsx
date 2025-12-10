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
  readingYear?: string;
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

export default function ScreeningWizard({ sections, caseId, readingYear }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [startError, setStartError] = useState<string | null>(null);

  const currentSection = sections[currentIndex];
  const sectionAnswers = answers[currentSection.id] || {};

  // LOAD EXISTING ANSWERS
  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!caseId) {
        setLoading(false);
        return;
      }

      try {
        const startedFlag =
          typeof window !== "undefined" &&
          new URLSearchParams(window.location.search).get("started") === "1";

        // Ensure screening start is recorded (increments usage)
        if (!startedFlag) {
          const startRes = await fetch("/api/screening/dyscalculia/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ caseId }),
          });

          const startData = await safeJson(startRes);

          if (!startRes.ok) {
            const msg =
              startData?.message ||
              startData?.error ||
              "Unable to start screening.";
            if (!cancelled) {
              setStartError(msg);
              setLoading(false);
            }
            return;
          }
        }
      } catch (err) {
        console.error("Error starting screening:", err);
        if (!cancelled) {
          setStartError("Unable to start screening right now. Please try again.");
          setLoading(false);
        }
        return;
      }

      try {
        const res = await fetch(
          `/api/screening/dyscalculia/section?caseId=${encodeURIComponent(caseId)}`
        );

        if (!res.ok) {
          console.error("Failed to load screening", res.status);
          if (!cancelled) setLoading(false);
          return;
        }

        const data = await safeJson(res);

        if (!data || !data.exists) {
          if (!cancelled) setLoading(false);
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

        if (!cancelled) setAnswers(collected);
      } catch (err) {
        console.error("Error loading screening:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [caseId]);

  // HANDLE ANSWERS
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

  // VALIDATION
  function isCurrentSectionComplete() {
    const current = answers[currentSection.id] || {};
    return currentSection.questions.every((q) => !!current[q.id]);
  }

  // SAVE SECTION
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
        readingYear
      };

      const res = await fetch("/api/screening/dyscalculia/section", {
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

  // NAVIGATION
  async function handleNext() {
    if (!isCurrentSectionComplete()) {
      setError("Please answer all questions before continuing.");
      return;
    }

    await saveCurrentSection(true);

    const last = currentIndex === sections.length - 1;

    if (last) {
      window.location.href = `/screening/dyscalculia/overview?caseId=${caseId}`;
      return;
    }

    // Show encouragement message between sections
    const encouragementMessages = [
      "Great progress! 🎯 Take a break if you need one.",
      "You're doing really well! Keep going! 💪",
      "Excellent work! You're halfway there! 🌟",
      "Almost done! Just a few more sections! 🚀",
      "Fantastic! Keep up the great effort! ⭐",
      "You're making excellent progress! 📈",
      "Well done! Take a moment to rest if needed. ☕",
      "Brilliant work so far! Nearly finished! 🎉"
    ];
    
    const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
    setSavedMessage(randomMessage);
    
    setTimeout(() => {
      setCurrentIndex((i) => i + 1);
      setSavedMessage(null);
    }, 1500);
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

    window.location.href = `/screening/dyscalculia/overview?caseId=${caseId}`;
  }

  if (loading) return <p>Loading screening…</p>;
  if (startError) return <p style={{ color: "red" }}>{startError}</p>;
  if (!caseId) return <p>No caseId provided.</p>;

  // RENDER
  return (
    <div style={{ marginTop: "2rem" }}>
      {/* SECTION NAVIGATION BOX */}
      <div
        style={{
          background: "#f5f5f5",
          border: "1px solid #ddd",
          borderRadius: "6px",
          padding: "1rem",
          marginBottom: "2rem",
        }}
      >
        <p style={{ fontWeight: "bold", marginBottom: "0.8rem" }}>Jump to Section:</p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {sections.map((section, idx) => {
            const sectionAnswers = answers[section.id] || {};
            const isSectionComplete = section.questions.every((q) => !!sectionAnswers[q.id]);
            
            const prevSectionsComplete = sections.slice(0, idx).every((sec) => {
              const secAnswers = answers[sec.id] || {};
              return sec.questions.every((q) => !!secAnswers[q.id]);
            });
            const canAccess = idx === currentIndex || idx === 0 || prevSectionsComplete;

            return (
              <button
                key={section.id}
                onClick={() => {
                  if (!canAccess) {
                    setError("Complete all previous sections before moving to this section.");
                    return;
                  }
                  setCurrentIndex(idx);
                  setError(null);
                }}
                disabled={!canAccess}
                title={!canAccess ? "Complete previous sections first" : ""}
                style={{
                  padding: "0.5rem 1rem",
                  background: idx === currentIndex ? "black" : isSectionComplete ? "#90EE90" : canAccess ? "#ddd" : "#ccc",
                  color: idx === currentIndex ? "white" : "black",
                  border: "none",
                  borderRadius: "4px",
                  cursor: canAccess ? "pointer" : "not-allowed",
                  fontWeight: idx === currentIndex ? "bold" : "normal",
                  opacity: canAccess ? 1 : 0.6,
                }}
              >
                {idx + 1}. {section.title} {isSectionComplete ? "✓" : ""}
              </button>
            );
          })}
        </div>
      </div>

      <h2>
        {currentSection.title} ({currentIndex + 1} of {sections.length})
      </h2>

      {currentSection.description && <p>{currentSection.description}</p>}

      <form onSubmit={(e) => e.preventDefault()}>
        {currentSection.questions.map((q) => {
          // Check if this is a passage confirmation question (typically in Section 5)
          const isPassageConfirmation = q.text.toLowerCase().includes('read the passage') || 
                                       q.text.toLowerCase().includes('i have read') ||
                                       (currentSection.id.includes('5') && q.options?.some(opt => 
                                         opt.toLowerCase().includes('yes') || opt.toLowerCase().includes('no')
                                       ));
          
          return (
            <div
              key={q.id}
              style={{
                border: isPassageConfirmation ? "3px solid #dc2626" : "1px solid #ddd",
                borderRadius: "8px",
                padding: isPassageConfirmation ? "1.5rem" : "1rem",
                marginBottom: "1rem",
                backgroundColor: isPassageConfirmation ? "#fef2f2" : "white",
              }}
            >
              <p style={{ 
                fontWeight: isPassageConfirmation ? "bold" : "normal",
                fontSize: isPassageConfirmation ? "1.1rem" : "1rem",
                color: isPassageConfirmation ? "#dc2626" : "inherit",
                marginBottom: "1rem"
              }}>
                {isPassageConfirmation && "⚠️ "}{q.text}
              </p>

              {q.options?.map((opt, i) => (
                <label
                  key={`${q.id}_${i}`}
                  style={{ 
                    display: "block", 
                    marginBottom: "0.8rem",
                    padding: isPassageConfirmation ? "0.75rem" : "0.4rem",
                    backgroundColor: isPassageConfirmation && sectionAnswers[q.id] === opt ? "#fee2e2" : "transparent",
                    borderRadius: "6px",
                    border: isPassageConfirmation ? "2px solid #fca5a5" : "none",
                    cursor: "pointer",
                    fontSize: isPassageConfirmation ? "1.05rem" : "1rem",
                    fontWeight: isPassageConfirmation ? "600" : "normal"
                  }}
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={opt}
                    checked={sectionAnswers[q.id] === opt}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    style={{
                      width: isPassageConfirmation ? "20px" : "auto",
                      height: isPassageConfirmation ? "20px" : "auto",
                      marginRight: "0.75rem"
                    }}
                  />{" "}
                  {opt}
                </label>
              ))}
            </div>
          );
        })}

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
