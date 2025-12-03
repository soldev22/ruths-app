// app/screening/dyslexia/start/[caseId]/page.tsx
import { fetchDyslexiaQuestions } from "../../../../../lib/dyslexiaQuestions";
import ScreeningWizard from "../../../dyslexia/ScreeningWizard";


export default async function DyslexiaStartPage({ 
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  // 🔥 MUST unwrap the params Promise
  const { caseId } = await params;

  if (!caseId) {
    return <p>No caseId provided.</p>;
  }

  const sections = await fetchDyslexiaQuestions();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dyslexia Screening — Case {caseId}</h1>

      <ScreeningWizard caseId={caseId} sections={sections} />
    </div>
  );
}
