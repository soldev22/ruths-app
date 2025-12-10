// app/screening/dyscalculia/start/[caseId]/page.tsx
import { fetchDyscalculiaQuestions } from "../../../../../lib/dyscalculiaQuestions";
import ScreeningWizard from "./ScreeningWizard";

export default async function DyscalculiaStartPage({ 
  params,
  searchParams,
}: {
  params: Promise<{ caseId: string }>;
  searchParams: Promise<{ year?: string }>;
}) {
  try {
    const { caseId } = await params;
    const search = await searchParams;
    const year = search?.year;

    if (!caseId) {
      return <p>No caseId provided.</p>;
    }

  if (!year) {
    return (
      <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ 
          background: "#fef2f2", 
          border: "2px solid #dc2626", 
          borderRadius: "8px", 
          padding: "24px",
          textAlign: "center"
        }}>
          <h2 style={{ color: "#dc2626", marginBottom: "16px" }}>⚠️ Missing School Year</h2>
          <p style={{ marginBottom: "20px", color: "#374151" }}>
            Please select a school year level to continue. We need this to provide age-appropriate questions.
          </p>
          <a 
            href="/protected/case/new"
            style={{
              display: "inline-block",
              background: "#2563eb",
              color: "white",
              padding: "12px 24px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600"
            }}
          >
            ← Go Back and Select Year
          </a>
        </div>
      </div>
    );
  }

    const sections = await fetchDyscalculiaQuestions(year);

    return (
      <div style={{ padding: "20px" }}>
        <h1>Dyscalculia Assessment — Case {caseId} : Year {year}</h1>
        <ScreeningWizard 
          caseId={caseId} 
          sections={sections} 
          readingYear={year}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading dyscalculia start page:", error);
    return (
      <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ 
          background: "#fef2f2", 
          border: "2px solid #dc2626", 
          borderRadius: "8px", 
          padding: "24px",
          textAlign: "center"
        }}>
          <h2 style={{ color: "#dc2626", marginBottom: "16px" }}>⚠️ Error Loading Assessment</h2>
          <p style={{ marginBottom: "20px", color: "#374151" }}>
            There was a problem loading the assessment. Please try again.
          </p>
          <a 
            href="/protected/case/new"
            style={{
              display: "inline-block",
              background: "#2563eb",
              color: "white",
              padding: "12px 24px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600"
            }}
          >
            ← Go Back
          </a>
        </div>
      </div>
    );
  }
}