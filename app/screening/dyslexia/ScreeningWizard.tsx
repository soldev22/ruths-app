"use client";

import { useEffect, useState, useRef } from "react";

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
  readingYear?: string;   // ← ADD THIS
};


type AnswersState = {
  [sectionId: string]: { [questionId: string]: string };
};

// (readingYear is now passed as a prop; remove unused local variable)


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
  // Timer state
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);
  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
  const currentSection = sections[currentIndex];
  const sectionAnswers = answers[currentSection.id] || {};

  //
  // LOAD EXISTING ANSWERS
  //
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
          const startRes = await fetch("/api/screening/dyslexia/start", {
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
          `/api/screening/dyslexia/section?caseId=${encodeURIComponent(caseId)}`
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
        (screening.sections || []).forEach((s: { sectionId: string; answers?: { [questionId: string]: string } }) => {
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
        readingYear  // ← ADD THIS LINE
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Couldn't save section.");
      } else {
        setError("Couldn't save section.");
      }
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

    // Save the final section and include elapsed time
    if (!caseId) {
      setError("Missing caseId — cannot save.");
      return;
    }

    setSaving(true);
    setSavedMessage(null);
    try {
      const payload = {
        caseId,
        sectionId: currentSection.id,
        answers: answers[currentSection.id] || {},
        readingYear,
        elapsedSeconds: timer // Capture the final timer value
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
      setSavedMessage("Section saved.");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Couldn't save section.");
      } else {
        setError("Couldn't save section.");
      }
      setSaving(false);
      return;
    }
    setSaving(false);
    // Now redirect to review/overview page, where you can feed elapsedSeconds to OpenAI if needed
    window.location.href = `/screening/dyslexia/overview?caseId=${caseId}&elapsedSeconds=${timer}`;
  }

  if (loading) return <p>Loading screening…</p>;
  if (startError) return <p className="text-red-600 font-semibold">{startError}</p>;
  if (!caseId) return <p>No caseId provided.</p>;

  //
  // RENDER
  //
  return (
    <>
      {/* Timer bar below main header */}
      <div className="w-full bg-gray-900 text-white text-lg font-mono text-center py-2 tracking-wider shadow-md">
        Assessment time: {formatTime(timer)}
      </div>
      <div className="mt-8">
      {/* SECTION NAVIGATION BOX */}
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-8">
        <p className="font-bold mb-2">Jump to Section:</p>
        <div className="flex flex-wrap gap-2">
          {sections.map((section, idx) => {
            const sectionAnswers = answers[section.id] || {};
            const isSectionComplete = section.questions.every((q) => !!sectionAnswers[q.id]);
            
            // Can only access: current section, section 1, or any section if all previous are complete
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
                className={[
                  'px-4 py-2 rounded',
                  idx === currentIndex ? 'bg-black text-white font-bold' : isSectionComplete ? 'bg-green-200 text-black' : canAccess ? 'bg-gray-300 text-black' : 'bg-gray-200 text-black',
                  'border-none',
                  'transition',
                  canAccess ? 'cursor-pointer opacity-100' : 'cursor-not-allowed opacity-60',
                ].join(' ')}
              >
                {idx + 1}. {section.title} {isSectionComplete ? "✓" : ""}
              </button>
            );
          })}
        </div>
      </div>

      <h2 className="text-xl font-bold mb-2">
        {currentSection.title} ({currentIndex + 1} of {sections.length})
      </h2>
      {currentSection.description && <p className="mb-4 text-gray-700">{currentSection.description}</p>}
      <form onSubmit={(e) => e.preventDefault()}>
        {currentSection.questions.map((q) => {
          const isPassageConfirmation = q.text.toLowerCase().includes('read the passage') || 
            q.text.toLowerCase().includes('i have read') ||
            (currentSection.id.includes('5') && q.options?.some(opt => 
              opt.toLowerCase().includes('yes') || opt.toLowerCase().includes('no')
            ));
          return (
            <div
              key={q.id}
              className={[
                'rounded-lg mb-4',
                isPassageConfirmation ? 'border-4 border-red-600 bg-red-50 p-6' : 'border border-gray-300 bg-white p-4',
              ].join(' ')}
            >
              <p className={[
                isPassageConfirmation ? 'font-bold text-red-600 text-lg mb-4' : 'mb-4',
              ].join(' ')}>
                {isPassageConfirmation && '⚠️ '}{q.text}
              </p>
              {q.options?.map((opt, i) => (
                <label
                  key={`${q.id}_${i}`}
                  className={[
                    'block mb-2 rounded',
                    isPassageConfirmation && sectionAnswers[q.id] === opt ? 'bg-red-100 border-2 border-red-300' : '',
                    isPassageConfirmation ? 'p-3 font-semibold text-base' : 'p-2',
                  ].join(' ')}
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={opt}
                    checked={sectionAnswers[q.id] === opt}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    className={[
                      isPassageConfirmation ? 'w-5 h-5 mr-3' : 'mr-2',
                    ].join(' ')}
                  />
                  {opt}
                </label>
              ))}
            </div>
          );
        })}
        {error && <p className="text-red-600 font-semibold">{error}</p>}
        {savedMessage && <p className="text-green-600 font-semibold">{savedMessage}</p>}
        {saving && <p>Saving…</p>}
        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentIndex === 0 || saving}
            className="px-4 py-2 rounded bg-gray-200 text-black font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {currentIndex < sections.length - 1 && (
            <button
              type="button"
              onClick={handleNext}
              disabled={saving}
              className="px-4 py-2 rounded bg-blue-600 text-white font-bold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Save and continue
            </button>
          )}
          {currentIndex === sections.length - 1 && (
            <button
              type="button"
              onClick={handleFinish}
              disabled={saving}
              className="px-4 py-2 rounded bg-green-600 text-white font-bold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Save and finish
            </button>
          )}
        </div>
      </form>
      </div>
    </>
  );
}
