"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function generateCaseId(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return String(num);
}

// Removed "adhd"
type ScreeningType = "dyslexia" | "dyscalculia";

export default function NewCasePage() {
  const router = useRouter();

  const [caseId, setCaseId] = useState<string>("");
  const [selected, setSelected] = useState<ScreeningType[]>([]);
  const [readingYear, setReadingYear] = useState<string>("");

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
    setError(null);
    setMessage(null);

    if (selected.length === 0) {
      setError("Please select at least one screening to begin.");
      return;
    }

    if (!readingYear) {
      setError("Please select a reading year.");
      return;
    }

    if (selected.includes("dyslexia")) {
      router.push(`/screening/dyslexia/start/${caseId}?year=${readingYear}`);
      return;
    }

    if (selected.includes("dyscalculia")) {
      setMessage("Dyscalculia screening is not wired up yet.");
      return;
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-2xl p-8 space-y-6">

        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">New Screening Case</h1>

          <p className="text-lg font-mono font-semibold text-blue-700">
            Case ID: {caseId || "------"}
          </p>

          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Please record this Case ID in your own records. It does not store the pupil’s name.
          </p>
        </div>

        {/* READING YEAR DROPDOWN */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 text-center">
            Select Reading Year
          </label>

          <select
            value={readingYear}
            onChange={(e) => setReadingYear(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Choose reading year…</option>
            <option value="S1">S1</option>
            <option value="S2">S2</option>
            <option value="S3">S3</option>
            <option value="S4">S4</option>
            <option value="S5">S5</option>
          </select>
        </div>

        {/* SCREENING TYPE PICKER */}
        <div className="space-y-3">
          <p className="text-sm text-gray-700 text-center">
            Choose which screenings to include (you can select more than one):
          </p>

          <div className="grid gap-6 md:grid-cols-2 justify-center items-center">

            {/* Dyslexia */}
            <button
              type="button"
              onClick={() => toggleSelection("dyslexia")}
              className={`border rounded-xl px-4 py-6 transition flex flex-col items-center justify-center ${
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
              className={`border rounded-xl px-4 py-6 transition flex flex-col items-center justify-center ${
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

          </div>
        </div>

        {/* BUTTON + ERRORS */}
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

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          {message && <p className="text-sm text-green-600 text-center">{message}</p>}
        </div>
      </div>
    </main>
  );
}
