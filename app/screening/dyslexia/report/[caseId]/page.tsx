import { fetchDyslexiaQuestions } from "../../../../../lib/dyslexiaQuestions";

export default async function DyslexiaReportPage({ params }: any) {
  const { caseId } = params;   // ✅ FIXED

  if (!caseId) return <p>No caseId provided.</p>;

  // Load questions for mapping
  const sections = await fetchDyslexiaQuestions();

  // Load screening details
  const res = await fetch(
    `/api/screening/dyslexia/details?caseId=${caseId}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to load screening details");
  }

  const data = await res.json();
  const screening = data?.screening;

  if (!screening) {
    return <p>No screening found for case {caseId}</p>;
  }

  const hasPaid = false; // subscription placeholder

  return (
    <div style={{ padding: 20 }}>
      <h1 className="text-2xl font-bold mb-4">
        Free Screening Report – Case {caseId}
      </h1>

      {/* FREE SUMMARY */}
      <div className="border rounded p-4 mb-6">
        <h2 className="text-xl font-semibold mb-3">Summary</h2>
        <p>This is your free, instant screening summary.</p>

        <ul className="mt-4 list-disc pl-6">
          {screening.sections.map((sec: any) => (
            <li key={sec.sectionId}>
              <strong>{sec.sectionId}</strong> –{" "}
              {Object.keys(sec.answers).length} answers
            </li>
          ))}
        </ul>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-4 mb-10">
        <form action="/api/screening/dyslexia/export-word" method="POST">
          <input type="hidden" name="caseId" value={caseId} />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            type="submit"
          >
            Export to Word
          </button>
        </form>

        {hasPaid && (
          <form action="/api/screening/dyslexia/generate-report" method="POST">
            <input type="hidden" name="caseId" value={caseId} />
            <button
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              type="submit"
            >
              Get Detailed Report
            </button>
          </form>
        )}
      </div>

      {/* ANSWERS */}
      <h2 className="text-xl font-semibold mb-3">Answers</h2>

      {screening.sections.map((sec: any) => (
        <div key={sec.sectionId} className="mb-6">
          <h3 className="font-bold mb-2">{sec.sectionId}</h3>

          <ul className="list-disc pl-6">
            {Object.entries(sec.answers).map(([qId, ans]) => {
              const questionText = sections
                .flatMap((s) => s.questions)
                .find((q) => q._id.toString() === qId)?.text;

              return (
                <li key={qId}>
                  <strong>{questionText || "Unknown question"}</strong>:{" "}
                  {String(ans)}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
