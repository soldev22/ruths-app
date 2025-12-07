// app/screening/dyslexia/start/[caseId]/page.tsx
import { fetchDyslexiaQuestions } from "../../../../../lib/dyslexiaQuestions";
import ScreeningWizard from "../../../dyslexia/ScreeningWizard";


export default async function DyslexiaStartPage({ 
  params,
  searchParams,
}: {
  params: Promise<{ caseId: string }>;
  searchParams: Promise<{ year: string }>;

}) {
  // 🔥 MUST unwrap the params Promise
  const { caseId } = await params;
  const { year } = await searchParams;

  if (!caseId) {
    return <p>No caseId provided.</p>;
  }

  const sections = await fetchDyslexiaQuestions(year);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dyslexia Review — Case {caseId} : Year {(await searchParams).year} </h1>

   <ScreeningWizard 
  caseId={caseId} 
  sections={sections} 
  readingYear={year}
/>

    </div>
  );
}
