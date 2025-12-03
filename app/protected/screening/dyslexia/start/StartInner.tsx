"use client";

import { useSearchParams } from "next/navigation";

export default function StartInner() {
  const params = useSearchParams();
  const caseId = params.get("caseId");

  return (
    <div>
      <h1>Start Dyslexia Screening</h1>
      <p>CaseId: {caseId}</p>
    </div>
  );
}
