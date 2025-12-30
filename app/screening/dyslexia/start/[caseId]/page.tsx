// app/screening/dyslexia/start/[caseId]/page.tsx
import { fetchDyslexiaQuestions } from "../../../../../lib/dyslexiaQuestions";
import ScreeningWizard from "../../../dyslexia/ScreeningWizard";

interface DyslexiaStartPageProps {
  params: { caseId: string };
  searchParams: { year?: string };
}

export default async function DyslexiaStartPage(props: DyslexiaStartPageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  try {
    const caseId = params?.caseId;
    const year = searchParams?.year;

    if (!caseId) {
      return <p>No caseId provided.</p>;
    }

    if (!year) {
      return (
        <div className="py-8 px-4 max-w-xl mx-auto">
          <div className="bg-[var(--error-bg)] border-2 border-[var(--error)] rounded-lg p-6 text-center">
            <h2 className="text-xl font-livvic-bold text-[var(--error)] mb-4">⚠️ Missing School Year</h2>
            <p className="mb-5 text-[var(--primary-text)] font-livvic-medium">
              Please select a school year level to continue. We need this to provide age-appropriate questions.
            </p>
            <a
              href="/protected/case/new"
              className="inline-block bg-[var(--secondary)] text-white px-6 py-3 rounded-lg no-underline font-livvic-bold"
            >
              ← Go Back and Select Year
            </a>
          </div>
        </div>
      );
    }

    const sections = await fetchDyslexiaQuestions(year);

    return (
      <div className="py-8 px-4">
        <h1 className="text-2xl font-livvic-bold text-[var(--secondary)] mb-6">Dyslexia Review — Case {caseId} : Year {year}</h1>
        <ScreeningWizard 
          caseId={caseId} 
          sections={sections} 
          readingYear={year}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading dyslexia start page:", error);
    return (
      <div className="py-8 px-4 max-w-xl mx-auto">
        <div className="bg-[var(--error-bg)] border-2 border-[var(--error)] rounded-lg p-6 text-center">
          <h2 className="text-xl font-livvic-bold text-[var(--error)] mb-4">⚠️ Error Loading Assessment</h2>
          <p className="mb-5 text-[var(--primary-text)] font-livvic-medium">
            There was a problem loading the assessment. Please try again.
          </p>
          <a
            href="/protected/case/new"
            className="inline-block bg-[var(--secondary)] text-white px-6 py-3 rounded-lg no-underline font-livvic-bold"
          >
            ← Go Back
          </a>
        </div>
      </div>
    );
  }
}