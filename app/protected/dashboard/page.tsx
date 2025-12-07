// app/protected/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";

type Screening = {
  _id: string;
  userId: string;
  sections: { sectionId: string; answers: Record<string, string> }[];
  createdAt?: string;
  updatedAt: string;
  caseId?: string;
  readingYear?: string;
};

export default function DashboardPage() {
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<"all" | "7days" | "30days">("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

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

        // 2️⃣ Fetch screenings for THIS USER
        const res = await fetch(`/api/screening/dyslexia/list?userId=${userId}`, {
          credentials: "include",
        });

        if (!res.ok) {
          const txt = await res.text();
          console.error("Failed to load screenings:", res.status, txt);
          setError("Could not load screenings.");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setScreenings(data.screenings || []);
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
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-900">SkillScan Dyslexia Reviews</h1>
        </div>

      {/* Date Filter Section */}
      <div className="bg-gray-100 p-4 rounded mb-6">
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

      {/* In progress */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          In progress ({filteredInProgress.length})
        </h2>
        {filteredInProgress.length === 0 && <p>No in-progress reviews.</p>}

        {filteredInProgress.map((s) => {
          const completedCount = s.sections?.length || 0;

          return (
            <div
              key={s._id}
              className="border rounded p-3 mb-3 flex items-center justify-between"
            >
              <div>
                <p>
                  <strong>Review ID:</strong> {s.caseId}
                </p>
                <p className="text-xs text-gray-500">
                  Started: {s.createdAt ? new Date(s.createdAt).toLocaleString() : "—"}
                </p>
                <p className="text-sm text-gray-600">
                  Sections completed: {completedCount} / {totalSections}
                </p>
              </div>

<a
  href={`/screening/dyslexia/start/${encodeURIComponent(
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
        {filteredCompleted.length === 0 && <p>No completed reviews yet.</p>}

        {filteredCompleted.map((s) => {
          const completedCount = s.sections?.length || 0;

          return (
            <div
              key={s._id}
              className="border rounded p-3 mb-3 flex items-center justify-between"
            >
              <div>
                <p>
                  <strong>Review ID:</strong> {s.caseId}
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
  href={`/screening/dyslexia/start/${encodeURIComponent(
    s.caseId ?? ""
  )}?year=${encodeURIComponent(s.readingYear ?? "NotSet")}`}
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
