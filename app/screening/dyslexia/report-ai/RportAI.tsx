// app/screening/dyslexia/report-ai/ReportAI.tsx
"use client";

import { useEffect, useState } from "react";

export default function ReportAI() {
  const [caseId, setCaseId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      setCaseId(params.get("caseId"));
    } catch (e) {
      setCaseId(null);
    }
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">AI Report Page</h1>
      {caseId ? (
        <p>Showing AI report for case: <strong>{caseId}</strong></p>
      ) : (
        <p>No case ID provided in URL.</p>
      )}
    </div>
  );
}
