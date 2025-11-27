// app/screening/dyslexia/page.tsx

import { dyslexiaSections } from "../../../lib/dyslexiaQuestions";
import ScreeningWizard from "./ScreeningWizard";

export default function DyslexiaScreeningPage() {
  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
      <h1>Secondary Dyslexia Screening Assessment</h1>
      <p>
        This screening helps identify patterns that may indicate dyslexia. It is
        not a diagnosis but can guide further assessment and support.
      </p>

      <ScreeningWizard sections={dyslexiaSections} />
    </main>
  );
}
