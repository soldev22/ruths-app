export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-[var(--background)] font-sans">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
        <div className="bg-[var(--background)] rounded-2xl shadow-sm p-6 mb-8 border border-[var(--secondary)]/10">
          <h1 className="text-4xl font-livvic-bold text-[var(--secondary)]">About SkillScan</h1>
        </div>

      <section className="mb-8">
        <h2 className="text-2xl font-livvic-bold mb-4 text-[var(--secondary)]">The Science Behind Online Screeners</h2>
        <p className="text-[var(--primary-text)] font-livvic-medium mb-4">
          Online screening tools like SkillScan are grounded in decades of research into learning difficulties, 
          cognitive assessment, and educational psychology. Digital screeners have become increasingly effective 
          because they combine evidence-based assessment frameworks with the accessibility and efficiency of 
          modern technology.
        </p>
      </section>

      <section className="mb-8 bg-[var(--secondary)]/10 border-l-4 border-[var(--secondary)] p-6">
        <h2 className="text-2xl font-livvic-bold mb-4 text-[var(--secondary)]">Why Online Screeners Are Effective</h2>
        <div className="space-y-4 text-[var(--primary-text)] font-livvic-medium">
          <div>
            <h3 className="text-lg font-livvic-bold mb-2">1. Standardized Assessment</h3>
            <p>
              Online screeners deliver consistent, standardized questions to every student, eliminating 
              variability in administration. This ensures that results are comparable across different 
              students, classes, and time periods.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-livvic-bold mb-2">2. Evidence-Based Domains</h3>
            <p>
              SkillScan assessments target research-validated indicators of learning difficulties, including:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li><strong>Phonological Awareness:</strong> The ability to recognize and manipulate sounds in spoken language</li>
              <li><strong>Letter-Sound Knowledge:</strong> Understanding the relationship between letters and their sounds</li>
              <li><strong>Word Reading Fluency:</strong> Speed and accuracy in recognizing words</li>
              <li><strong>Reading Comprehension:</strong> Understanding and interpreting written text</li>
              <li><strong>Spelling:</strong> The ability to encode words accurately</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-livvic-bold mb-2">3. Early Identification</h3>
            <p>
              Research consistently shows that early identification of learning difficulties leads to better 
              outcomes. Online screeners make it practical for schools to assess all students regularly, 
              catching difficulties before they become entrenched.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-livvic-bold mb-2">4. Objective Data Collection</h3>
            <p>
              Digital tools record student responses precisely, providing objective data free from observer 
              bias. This supports more reliable decision-making about intervention needs.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-livvic-bold mb-2">5. Efficiency and Accessibility</h3>
            <p>
              Online screeners allow teachers to assess many students quickly, making universal screening 
              feasible even in resource-constrained environments. Results are available immediately, 
              enabling timely intervention.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-livvic-bold mb-2">6. Progress Monitoring</h3>
            <p>
              The ability to re-administer screeners over time provides valuable data on student growth 
              and intervention effectiveness, supporting a response-to-intervention (RTI) approach.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8 bg-[var(--accent)]/10 border-l-4 border-[var(--accent)] p-6">
        <h2 className="text-2xl font-livvic-bold mb-4 text-[var(--accent)]">
          ✓ Professional Oversight & Verification
        </h2>
        <div className="text-[var(--primary-text)] space-y-4 font-livvic-medium">
          <p className="font-livvic-bold text-lg">
            SkillScan has been developed and verified by a qualified teaching professional with specialization 
            in teaching support and learning difficulties.
          </p>
          
          <div>
            <h3 className="text-lg font-livvic-bold mb-2">Expert Development</h3>
            <p>
              The screening questions, scoring algorithms, and interpretation frameworks have been:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Designed by educators with expertise in literacy and learning support</li>
              <li>Aligned with current research on dyslexia and related learning difficulties</li>
              <li>Calibrated to age-appropriate expectations across year groups</li>
              <li>Validated through pilot testing with real students</li>
              <li>Reviewed for cultural and linguistic appropriateness</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-livvic-bold mb-2">Ongoing Quality Assurance</h3>
            <p>
              SkillScan undergoes continuous review to ensure:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Questions remain relevant and effective</li>
              <li>Scoring thresholds reflect current best practices</li>
              <li>AI-generated reports are accurate and actionable</li>
              <li>The system evolves with emerging research</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-livvic-bold mb-2">Teacher Expertise Required</h3>
            <p>
              While SkillScan provides data-driven insights, it is designed to <strong>support</strong>, 
              not replace, professional judgment. Teachers with knowledge of each student&#39;s context,
              strengths, and needs are essential for interpreting results meaningfully.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-livvic-bold mb-4 text-[var(--secondary)]">The Role of AI in Report Generation</h2>
        <p className="text-[var(--primary-text)] font-livvic-medium mb-4">
          SkillScan uses artificial intelligence to analyze screening results and generate narrative reports. 
          The AI has been trained to:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-2 text-[var(--primary-text)]">
          <li>Identify patterns in student responses across multiple domains</li>
          <li>Highlight areas of strength and concern</li>
          <li>Suggest evidence-based next steps for teachers</li>
          <li>Present findings in clear, accessible language</li>
        </ul>
        <p className="text-[var(--primary-text)] font-livvic-medium mt-4">
          However, AI-generated reports should always be reviewed by qualified professionals before informing 
          educational decisions. They are a tool to enhance teacher insight, not a substitute for clinical 
          diagnosis or comprehensive assessment.
        </p>
      </section>

      <section className="mb-8 bg-yellow-50 border-l-4 border-yellow-500 p-6">
        <h2 className="text-2xl font-livvic-bold mb-4 text-yellow-900">Important Limitations</h2>
        <ul className="list-disc list-inside space-y-2 text-[var(--primary-text)] font-livvic-medium">
          <li>
            <strong>Not a Diagnostic Tool:</strong> SkillScan is a screener, not a diagnostic assessment. 
            Students identified as at-risk should be referred for comprehensive evaluation by qualified specialists.
          </li>
          <li>
            <strong>One Data Point:</strong> Screening results should be considered alongside classroom observations, 
            work samples, and other assessments.
          </li>
          <li>
            <strong>Context Matters:</strong> Factors such as English as an additional language, anxiety, 
            attention difficulties, or environmental stressors can affect performance.
          </li>
          <li>
            <strong>Professional Judgment Essential:</strong> Teachers must use their professional knowledge to 
            interpret results in the context of each student&#39;s unique situation.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-livvic-bold mb-4 text-[var(--secondary)]">Research Foundations</h2>
        <p className="text-[var(--primary-text)] font-livvic-medium mb-4">
          SkillScan is informed by research into:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-2 text-[var(--primary-text)]">
          <li>The Simple View of Reading (Gough & Tunmer, 1986)</li>
          <li>Phonological deficit theory of dyslexia (Snowling, 2000)</li>
          <li>Response to Intervention (RTI) frameworks</li>
          <li>Multi-tiered systems of support (MTSS)</li>
          <li>Universal Design for Learning (UDL) principles</li>
          <li>Evidence-based literacy instruction (Ehri, Galuschka, et al.)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-livvic-bold mb-4 text-[var(--secondary)]">Commitment to Best Practice</h2>
        <p className="text-[var(--primary-text)] font-livvic-medium mb-4">
          SkillScan is committed to:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-2 text-[var(--primary-text)]">
          <li>Basing all assessments on peer-reviewed research</li>
          <li>Maintaining professional oversight by qualified educators</li>
          <li>Updating content to reflect evolving understanding of learning difficulties</li>
          <li>Protecting student privacy and complying with GDPR</li>
          <li>Supporting teachers with actionable, evidence-based insights</li>
          <li>Promoting equity and access to high-quality screening for all students</li>
        </ul>
      </section>

      <section className="mt-8 pt-6 border-t">
        <p className="text-sm text-[var(--secondary-text)] font-livvic-medium">
          <strong>Questions about the science or methodology behind SkillScan?</strong> Contact us at{" "}
          <a
            href="mailto:contact@solutionsdeveloped.co.uk"
            className="text-[var(--accent)] underline font-livvic-bold"
          >
            contact@solutionsdeveloped.co.uk
          </a>
        </p>
      </section>
      </div>
    </div>
  );
}
