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

  const [caseId] = useState<string>(() => generateCaseId());
  const [selected, setSelected] = useState<ScreeningType | null>(null);
  const [readingYear, setReadingYear] = useState<string>("");
  const [userType, setUserType] = useState<"teacher" | "individual">("individual");
  const [studentIdentifier, setStudentIdentifier] = useState<string>("");
  // const [assessing, setAssessing] = useState<"child" | "self" | "other">("child");

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Fetch user type
    async function fetchUserType() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUserType(data.user?.userType || "individual");
        }
      } catch (err) {
        console.error("Error fetching user type:", err);
      }
    }
    fetchUserType();
  }, []);

  function selectScreening(type: ScreeningType) {
    setError(null);
    setMessage(null);
    setSelected(type);
  }

  function isSelected(type: ScreeningType) {
    return selected === type;
  }

  function handleStart() {
    setError(null);
    setMessage(null);

    if (!selected) {
      setError("Please select a screening to begin.");
      return;
    }

    if (!readingYear) {
      setError("Please select the school year level to continue.");
      return;
    }

    if (selected === "dyslexia") {
      router.push(`/screening/dyslexia/start/${caseId}?year=${readingYear}`);
      return;
    }

    if (selected === "dyscalculia") {
      router.push(`/screening/dyscalculia/start/${caseId}?year=${readingYear}`);
      return;
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-8 max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-900">New SkillScan Case</h1>
        </div>

        {/* CASE ID SLUG */}
        <div className="bg-red-50 border-l-4 border-red-600 rounded-lg p-6 mb-8">
          <p className="text-sm font-semibold text-gray-700 mb-2">⚠️ Important: Record this Case ID</p>
          <p className="text-4xl font-mono font-bold text-red-600 mb-3">{caseId || "------"}</p>
          <p className="text-sm text-gray-700 font-medium">
            Write down this Case ID in your records. This is how you&#39;ll track the assessment - it does not store any personal names.
          </p>
        </div>

        {/* USER-SPECIFIC FIELDS */}
        {userType === "teacher" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Student Identifier (Optional)
            </label>
            <input
              type="text"
              placeholder="First name or code (e.g. Student A)"
              value={studentIdentifier}
              onChange={(e) => setStudentIdentifier(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">
              Use a first name or code to help you identify this student later. This is optional for privacy.
            </p>
          </div>
        )}

        {/* READING YEAR DROPDOWN */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <label className="block text-lg font-bold text-gray-900 mb-2">
            {userType === "teacher" ? "What school year is the student in?" : "What school year (or how old is the child)?"}
          </label>
          <p className="text-sm text-gray-600 mb-4">
            💡 We use this to select age-appropriate questions that match the child&#39;s developmental stage.
          </p>

          <select
            value={readingYear}
            onChange={(e) => setReadingYear(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Select school year level"
          >
            <option value="">Choose a year level…</option>
            <option value="S1">S1 (Ages 12-13) - First year of secondary school</option>
            <option value="S2">S2 (Ages 13-14) - Second year of secondary school</option>
            <option value="S3">S3 (Ages 14-15) - Third year of secondary school</option>
            <option value="S4">S4 (Ages 15-16) - Fourth year of secondary school</option>
            <option value="S5">S5 (Ages 16-17) - Fifth year of secondary school</option>
          </select>

          {/* Warning if no year selected */}
          {!readingYear && (
            <div className="mt-3 bg-amber-50 border-l-4 border-amber-500 rounded p-3">
              <p className="text-sm text-amber-800 font-medium">
                ⚠️ Please select a school year to continue
              </p>
            </div>
          )}
        </div>

        {/* SCREENING TYPE PICKER */}
        <div className="space-y-3">
          <p className="text-sm text-gray-700 text-center">
            Choose which screening to include (only one can be selected):
          </p>

          <div className="grid gap-6 md:grid-cols-2 justify-center items-center">

            {/* Dyslexia */}
            <button
              type="button"
              onClick={() => selectScreening("dyslexia")}
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
              onClick={() => selectScreening("dyscalculia")}
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
        <div className="space-y-3 mt-8">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleStart}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-base font-semibold hover:bg-blue-700 shadow-md"
            >
              Start Screening with this Case ID
            </button>
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          {message && <p className="text-sm text-green-600 text-center">{message}</p>}
        </div>
      </div>
    </div>
  );
}
