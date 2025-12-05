// app/screening/dyslexia/report-ai/ReportAI.tsx
"use client";

import { useSearchParams } from "next/navigation";

export default function ReportAI() {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId");

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
