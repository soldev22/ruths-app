// app/screening/dyslexia/overview/page.tsx

import { connectToDatabase } from "../../../../lib/db";
import { DyslexiaScreening } from "../../../../models/DyslexiaScreening";

export default async function OverviewPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Next.js 16 requires awaiting searchParams
  const resolved = await searchParams;
  const raw = resolved?.caseId;
  const caseId = Array.isArray(raw) ? raw[0] : raw ?? null;

  if (!caseId) {
    return (
      <main style={{ padding: "2rem" }}>
        <h1>Dyslexia Screening Overview</h1>
        <p>No caseId provided.</p>
      </main>
    );
  }

  await connectToDatabase();

  const screening = await DyslexiaScreening.findOne({ caseId }).lean();

  if (!screening) {
    return (
      <main style={{ padding: "2rem" }}>
        <h1>Dyslexia Screening Overview</h1>
        <p>No screening found for case {caseId}.</p>
      </main>
    );
  }

  // Helper to calculate performance band
  function band(score: number, total: number) {
    const pct = score / total;
    if (pct >= 0.75) return "High";
    if (pct >= 0.4) return "Average";
    return "Low";
  }

  // Helper to pull a section easily
  function sec(id: string) {
    return screening.sections.find((s: any) => s.sectionId === id);
  }

  // Scores
  const phon = sec("section-1-phonological");
  const phonScore = phon ? Object.keys(phon.answers).length : 0;

  const ran = sec("section-2-ran");
  const ranBand = ran?.answers?.["q-ran-band"] || "Unknown";

  const wm = sec("section-3-working-memory");
  const wmScore = wm ? Object.keys(wm.answers).length : 0;

  const orth = sec("section-4-orthographic");
  const orthScore = orth ? Object.keys(orth.answers).length : 0;

  const vocab = sec("section-6-vocabulary");
  const vocabScore = vocab ? Object.keys(vocab.answers).length : 0;

  const visual = sec("section-7-visual");
  const visualScore = visual ? Object.keys(visual.answers).length : 0;

  const spelling = sec("section-9-spelling");
  const spellingScore = spelling ? Object.keys(spelling.answers).length : 0;

  // Determine risk level
  let risk = "Low";
  if (
    ranBand === "0-9" ||
    phonScore < 2 ||
    orthScore < 2
  ) {
    risk = "High";
  } else if (
    ranBand === "10-17" ||
    phonScore < 3 ||
    orthScore < 3
  ) {
    risk = "Moderate";
  }

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
      <h1>Dyslexia Screening Overview</h1>

      <p><strong>Case ID:</strong> {caseId}</p>
      <p><strong>Screening ID:</strong> {screening.screeningId}</p>

      <h2 style={{ marginTop: "2rem" }}>Section Summary</h2>
      <ul>
        <li>Phonological Awareness: {band(phonScore, 4)}</li>
        <li>Rapid Naming: {ranBand}</li>
        <li>Working Memory: {band(wmScore, 3)}</li>
        <li>Orthographic Processing: {band(orthScore, 4)}</li>
        <li>Vocabulary: {band(vocabScore, 3)}</li>
        <li>Visual Processing: {band(visualScore, 2)}</li>
        <li>Spelling Application: {band(spellingScore, 3)}</li>
      </ul>

      <h2 style={{ marginTop: "2rem" }}>Risk Level</h2>
      <p style={{ fontSize: "1.2rem" }}>
        {risk === "High" && "⚠ High likelihood of dyslexia"}
        {risk === "Moderate" && "Moderate likelihood of dyslexia"}
        {risk === "Low" && "Low likelihood of dyslexia"}
      </p>

      <h2 style={{ marginTop: "2rem" }}>Interpretation</h2>
      <p>
        This screening shows an overall <strong>{risk}</strong> likelihood.
        Use this information alongside classroom performance, teacher
        observations, and written work to support next steps.
      </p>
    </main>
  );
}
