// app/protected/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";

type Screening = {
  _id: string;
  userId: string;
  sections: { sectionId: string; answers: Record<string, string> }[];
  updatedAt: string;
  caseId?: string;
  readingYear?: string;
};

export default function DashboardPage() {
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Your screenings</h1>
        <p>Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Your screenings</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your screenings</h1>

      {/* In progress */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">In progress</h2>
        {inProgress.length === 0 && <p>No in-progress screenings.</p>}

        {inProgress.map((s) => {
          const completedCount = s.sections?.length || 0;

          return (
            <div
              key={s._id}
              className="border rounded p-3 mb-3 flex items-center justify-between"
            >
              <div>
                <p>
                  <strong>Screening ID:</strong> {s.caseId}
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
        <h2 className="text-xl font-semibold mb-3">Completed</h2>
        {completed.length === 0 && <p>No completed screenings yet.</p>}

        {completed.map((s) => {
          const completedCount = s.sections?.length || 0;

          return (
            <div
              key={s._id}
              className="border rounded p-3 mb-3 flex items-center justify-between"
            >
              <div>
                <p>
                  <strong>Screening ID:</strong> {s.caseId}
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
  );
}
