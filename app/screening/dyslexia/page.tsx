// app/screening/dyslexia/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import ScreeningWizard from "./ScreeningWizard";
import { dyslexiaSections } from "@/lib/dyslexiaQuestions"; // 👈 adjust to your actual export name

export default function DyslexiaPage() {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId");

  return <ScreeningWizard sections={dyslexiaSections} caseId={caseId} />;
}
