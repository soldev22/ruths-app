// app/screening/dyslexia/page.tsx

import { dyslexiaSections } from "../../../lib/dyslexiaQuestions";
import ScreeningWizard from "./ScreeningWizard";

export default async function DyslexiaScreeningPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = await searchParams;
  const raw = resolved?.caseId;
  const caseId = Array.isArray(raw) ? raw[0] : raw ?? null;

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
      <h1>Secondary Dyslexia Screening Assessment</h1>
      <p>
        This screening helps identify patterns that may indicate dyslexia. It is
        not a diagnosis but can guide further assessment and support.
      </p>

      {caseId && (
        <p style={{ fontStyle: "italic", marginBottom: "1rem" }}>
          Linked to case: {caseId}
        </p>
      )}

      <ScreeningWizard sections={dyslexiaSections} caseId={caseId} />
    </main>
  );
}
