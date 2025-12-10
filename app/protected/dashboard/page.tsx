// app/protected/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Screening = {
  _id: string;
  userId: string;
  sections: { sectionId: string; answers: Record<string, string> }[];
  createdAt?: string;
  updatedAt: string;
  caseId?: string;
  readingYear?: string;
  screeningType?: "dyslexia" | "dyscalculia";
};

export default function DashboardPage() {
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<"all" | "7days" | "30days">("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [prepaidCredits, setPrepaidCredits] = useState<number>(0);
  const [screeningsUsed, setScreeningsUsed] = useState<number>(0);
  const [accountType, setAccountType] = useState<string>("");

  const totalSections = 10; // placeholder

  useEffect(() => {
    async function loadScreenings() {
      try {
        // 1️⃣ Get logged in user
        const meRes = await fetch("/api/auth/me", {
          credentials: "include",
        });
        const meData = await meRes.json();
console.log("SCREENINGS:", meData.screenings);

        if (!meData.user) {
          setError("Not authenticated.");
          setLoading(false);
          return;
        }

        const userId = meData.user.userId;
        
        // Store credit information
        setPrepaidCredits(meData.user.prepaidCredits || 0);
        setScreeningsUsed(meData.user.screeningsUsed || 0);
        setAccountType(meData.user.accountType || "individual");

        // 2️⃣ Fetch both dyslexia and dyscalculia screenings
        const [dyslexiaRes, dyscalculiaRes] = await Promise.all([
          fetch(`/api/screening/dyslexia/list?userId=${userId}`, {
            credentials: "include",
          }),
          fetch(`/api/screening/dyscalculia/list?userId=${userId}`, {
            credentials: "include",
          }),
        ]);

        if (!dyslexiaRes.ok && !dyscalculiaRes.ok) {
          console.error("Failed to load screenings");
          setError("Could not load screenings.");
          setLoading(false);
          return;
        }

        const dyslexiaData = dyslexiaRes.ok ? await dyslexiaRes.json() : { screenings: [] };
        const dyscalculiaData = dyscalculiaRes.ok ? await dyscalculiaRes.json() : { screenings: [] };

        // Combine and mark each screening with its type
        const allScreenings = [
          ...(dyslexiaData.screenings || []).map((s: Screening) => ({ ...s, screeningType: "dyslexia" as const })),
          ...(dyscalculiaData.screenings || []).map((s: Screening) => ({ ...s, screeningType: "dyscalculia" as const })),
        ];

        setScreenings(allScreenings);
      } catch (err) {
        console.error(err);
        setError("There was a problem loading the dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadScreenings();
  }, []);

  const completed = screenings.filter(
    (s) => (s.sections?.length || 0) >= totalSections
  );
  const inProgress = screenings.filter(
    (s) => (s.sections?.length || 0) < totalSections
  );

  // Apply date filtering
  const getFilteredScreenings = (list: Screening[]) => {
    if (dateFilter === "all" && !customStartDate && !customEndDate) {
      return list;
    }

    return list.filter((s) => {
      const screeningDate = new Date(s.updatedAt).getTime();
      let startTime = 0;
      let endTime = Date.now();

      if (dateFilter === "7days") {
        startTime = Date.now() - 7 * 24 * 60 * 60 * 1000;
      } else if (dateFilter === "30days") {
        startTime = Date.now() - 30 * 24 * 60 * 60 * 1000;
      } else if (customStartDate) {
        startTime = new Date(customStartDate).getTime();
      }

      if (customEndDate) {
        endTime = new Date(customEndDate).getTime() + 24 * 60 * 60 * 1000; // Include full end date
      }

      return screeningDate >= startTime && screeningDate <= endTime;
    });
  };

  const filteredCompleted = getFilteredScreenings(completed);
  const filteredInProgress = getFilteredScreenings(inProgress);

  // Helper function to format reading year for display
  const formatReadingYear = (year: string | undefined) => {
    if (!year || year === "NotSet") return "Not Set";
    const yearMap: { [key: string]: string } = {
      "S1": "S1 (Ages 12-13)",
      "S2": "S2 (Ages 13-14)",
      "S3": "S3 (Ages 14-15)",
      "S4": "S4 (Ages 15-16)",
      "S5": "S5 (Ages 16-17)",
    };
    return yearMap[year] || year;
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
          <h1 className="text-2xl font-bold mb-4">SkillScan Dyslexia Reviews</h1>
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
          <h1 className="text-2xl font-bold mb-4">SkillScan Dyslexia Reviews</h1>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-8 overflow-y-auto">
        {/* Header - Simple Title Only */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-900">SkillScan Reviews</h1>
        </div>

        {/* Combined Welcome & Credit Panel - Always visible for prepaid users */}
        {accountType === "individual" && (
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-8 mb-8 shadow-lg">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">Welcome to SkillScan!</h2>
                <p className="text-blue-100 text-sm">
                  Professional screening tools to identify learning differences quickly and accurately.
                </p>
              </div>
              <div className="bg-blue-900 bg-opacity-60 rounded-lg px-8 py-4 min-w-[180px] border-2 border-white border-opacity-30">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-1 text-white">{prepaidCredits}</div>
                  <div className="text-sm text-white font-semibold">credits remaining</div>
                  <div className="text-xs text-white mt-2 opacity-90">
                    {screeningsUsed} completed
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <Link 
                href="/protected/case/new"
                className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition-colors"
              >
                Create Your Assessment
              </Link>
              
              {prepaidCredits <= 2 && (
                <Link 
                  href="/protected/account"
                  className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg shadow transition-colors"
                >
                  {prepaidCredits === 0 ? '⚠️ Purchase Credits' : '💡 Buy More Credits'}
                </Link>
              )}
            </div>

            {prepaidCredits === 0 && (
              <p className="text-amber-200 text-sm mt-4 font-medium">
                ⚠️ You have no credits remaining. Purchase credits to continue assessments.
              </p>
            )}
          </div>
        )}

      {/* Date Filter Section */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex-grow bg-gray-100 p-4 rounded">
          <h2 className="text-sm font-semibold mb-3">Filter by Date</h2>
          <div className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => {
                  setDateFilter("all");
                  setCustomStartDate("");
                  setCustomEndDate("");
                }}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  dateFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-300"
                }`}
              >
                All
              </button>
              <button
                onClick={() => {
                  setDateFilter("7days");
                  setCustomStartDate("");
                  setCustomEndDate("");
                }}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  dateFilter === "7days"
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-300"
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => {
                  setDateFilter("30days");
                  setCustomStartDate("");
                  setCustomEndDate("");
                }}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  dateFilter === "30days"
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-300"
                }`}
              >
                Last 30 Days
              </button>
            </div>

            {/* Custom Date Range */}
            <div className="flex gap-2 items-end flex-wrap">
              <div>
                <label className="block text-xs font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => {
                    setCustomStartDate(e.target.value);
                    setDateFilter("all");
                  }}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">End Date</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => {
                    setCustomEndDate(e.target.value);
                    setDateFilter("all");
                  }}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              {(customStartDate || customEndDate) && (
                <button
                  onClick={() => {
                    setCustomStartDate("");
                    setCustomEndDate("");
                    setDateFilter("all");
                  }}
                  className="px-2 py-1 bg-gray-400 text-white rounded text-sm"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* In progress */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          In progress ({filteredInProgress.length})
        </h2>
        {filteredInProgress.length === 0 && (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <p className="text-gray-600">No assessments in progress.</p>
          </div>
        )}

        {filteredInProgress.map((s) => {
          const completedCount = s.sections?.length || 0;
          const screeningLabel = s.screeningType === "dyscalculia" ? "Dyscalculia" : "Dyslexia";

          return (
            <div
              key={s._id}
              className="border rounded p-3 mb-3 flex items-center justify-between"
            >
              <div>
                <p>
                  <strong>Review ID:</strong> {s.caseId}
                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {screeningLabel} — {formatReadingYear(s.readingYear)}
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  Started: {s.createdAt ? new Date(s.createdAt).toLocaleString() : "—"}
                </p>
                <p className="text-sm text-gray-600">
                  Sections completed: {completedCount} / {totalSections}
                </p>
              </div>

<a
  href={`/screening/${s.screeningType || "dyslexia"}/start/${encodeURIComponent(
    s.caseId ?? ""
  )}?year=${encodeURIComponent(s.readingYear ?? "NotSet")}`}
  className="px-3 py-2 text-sm rounded bg-blue-600 text-white"
>
  Resume
</a>

            </div>
          );
        })}
      </section>

      {/* Completed */}
      <section>
        <h2 className="text-xl font-semibold mb-3">
          Completed ({filteredCompleted.length})
        </h2>
        {filteredCompleted.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <p className="text-gray-600">No completed assessments yet.</p>
          </div>
        )}

        {filteredCompleted.map((s) => {
          const completedCount = s.sections?.length || 0;
          const screeningLabel = s.screeningType === "dyscalculia" ? "Dyscalculia" : "Dyslexia";

          return (
            <div
              key={s._id}
              className="border rounded p-3 mb-3 flex items-center justify-between"
            >
              <div>
                <p>
                  <strong>Review ID:</strong> {s.caseId}
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {screeningLabel} — {formatReadingYear(s.readingYear)}
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  Started: {s.createdAt ? new Date(s.createdAt).toLocaleString() : "—"}
                </p>
                <p className="text-sm text-gray-600">
                  Sections completed: {completedCount} / {totalSections}
                </p>
                <p className="text-xs text-gray-500">
                  Last updated: {new Date(s.updatedAt).toLocaleString()}
                </p>
              </div>

<a
  href={`/screening/${s.screeningType || "dyslexia"}/overview?caseId=${encodeURIComponent(
    s.caseId ?? ""
  )}`}
  className="px-3 py-2 text-sm rounded bg-gray-700 text-white"
>
  Review
</a>

            </div>
          );
        })}
      </section>
      </div>
    </div>
  );
}
