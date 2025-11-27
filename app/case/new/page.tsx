"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function generateCaseId(): string {
  // 6-digit random number between 100000 and 999999
  const num = Math.floor(100000 + Math.random() * 900000);
  return String(num);
}

type ScreeningType = "dyslexia" | "dyscalculia" | "adhd";

export default function NewCasePage() {
  const router = useRouter();

  const [caseId, setCaseId] = useState<string>("");
  const [selected, setSelected] = useState<ScreeningType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setCaseId(generateCaseId());
  }, []);

  function toggleSelection(type: ScreeningType) {
    setError(null);
    setMessage(null);

    setSelected((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  }

  function isSelected(type: ScreeningType) {
    return selected.includes(type);
  }

  function handleStart() {
    if (selected.length === 0) {
      setError("Please select at least one screening to begin.");
      setMessage(null);
      return;
    }

    // For now we only have the Dyslexia wizard built.
    // If Dyslexia is selected, send them there WITH the caseId in the URL.
    if (selected.includes("dyslexia")) {
      router.push(`/screening/dyslexia?caseId=${caseId}`);
      return;
    }

    // If only other screenings are selected (no dyslexia),
    // just show a message until those pages exist.
    setMessage(
      "This case has been created. Dyscalculia/ADHD screening pages are not wired up yet."
    );
    setError(null);
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-2xl p-8 space-y-6">
        {/* Heading with unique ID */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">New Screening Case</h1>
          <p className="text-lg font-mono font-semibold text-blue-700">
            Case ID: {caseId || "------"}
          </p>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Please record this Case ID in your own records instead of the
            pupil&apos;s name. Use it to match screening results to the pupil.
          </p>
        </div>

        {/* Screening multi-select */}
        <div className="space-y-3">
          <p className="text-sm text-gray-700 text-center">
            Choose which screenings you want to include for this case
            (you can select more than one):
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Dyslexia */}
            <button
              type="button"
              onClick={() => toggleSelection("dyslexia")}
              className={`border rounded-xl px-4 py-6 text-center transition flex flex-col items-center justify-center ${
                isSelected("dyslexia")
                  ? "bg-blue-50 border-blue-500"
                  : "hover:bg-blue-50"
              }`}
            >
              <span className="text-base font-semibold">Dyslexia</span>
              <span className="text-xs text-gray-500 mt-2">
                Reading / spelling profile
              </span>
              {isSelected("dyslexia") && (
                <span className="mt-2 text-xs font-semibold text-blue-700">
                  Selected
                </span>
              )}
            </button>

            {/* Dyscalculia */}
            <button
              type="button"
              onClick={() => toggleSelection("dyscalculia")}
              className={`border rounded-xl px-4 py-6 text-center transition flex flex-col items-center justify-center ${
                isSelected("dyscalculia")
                  ? "bg-blue-50 border-blue-500"
                  : "hover:bg-blue-50"
              }`}
            >
              <span className="text-base font-semibold">Dyscalculia</span>
              <span className="text-xs text-gray-500 mt-2">
                Number sense & maths
              </span>
              {isSelected("dyscalculia") && (
                <span className="mt-2 text-xs font-semibold text-blue-700">
                  Selected
                </span>
              )}
            </button>

            {/* ADHD */}
            <button
              type="button"
              onClick={() => toggleSelection("adhd")}
              className={`border rounded-xl px-4 py-6 text-center transition flex flex-col items-center justify-center ${
                isSelected("adhd")
                  ? "bg-blue-50 border-blue-500"
                  : "hover:bg-blue-50"
              }`}
            >
              <span className="text-base font-semibold">ADHD</span>
              <span className="text-xs text-gray-500 mt-2">
                Attention & activity
              </span>
              {isSelected("adhd") && (
                <span className="mt-2 text-xs font-semibold text-blue-700">
                  Selected
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Start button + messages */}
        <div className="space-y-3">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleStart}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
            >
              Start screening with this Case ID
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}
          {message && (
            <p className="text-sm text-green-600 text-center">{message}</p>
          )}

          <p className="text-xs text-gray-500 text-center">
            This Case ID will not contain the pupil&apos;s name. It&apos;s your
            own reference so you can link results to the right child.
          </p>
        </div>
      </div>
    </main>
  );
}
