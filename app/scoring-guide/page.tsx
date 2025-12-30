"use client";

export default function ScoringGuidePage() {
  return (
    <div className="w-full min-h-screen bg-[var(--background)] font-sans">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
        <div className="bg-[var(--background)] rounded-2xl shadow-sm p-6 mb-8 border border-[var(--secondary)]/10">
          <h1 className="text-4xl font-livvic-bold text-[var(--secondary)]">
            SkillScan scoring system guide
          </h1>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-livvic-bold mb-4 text-[var(--secondary)]">
            Overview
          </h2>
          <p className="text-[var(--primary-text)] font-livvic-medium leading-relaxed mb-4">
            The SkillScan scoring system is designed to provide educators and
            specialists with a structured assessment of a student's performance
            in literacy screening. Scores are calculated based on responses to
            targeted questions across multiple screening domains.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-livvic-bold mb-4 text-[var(--secondary)]">
            Screening domains
          </h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[var(--accent)] pl-4">
              <h3 className="text-lg font-livvic-bold text-[var(--secondary)] mb-2">
                Phonological awareness
              </h3>
              <p className="text-[var(--primary-text)] font-livvic-medium">
                Measures the student's ability to recognize and manipulate the
                sound structures of language, including rhyming, syllable
                segmentation, and phoneme awareness.
              </p>
            </div>

            <div className="border-l-4 border-[var(--accent)]/70 pl-4">
              <h3 className="text-lg font-livvic-bold text-[var(--secondary)] mb-2">
                Letter-sound knowledge
              </h3>
              <p className="text-[var(--primary-text)] font-livvic-medium">
                Assesses familiarity with the alphabetic principle and the
                student's ability to associate letters with their corresponding
                sounds.
              </p>
            </div>

            <div className="border-l-4 border-[var(--secondary)] pl-4">
              <h3 className="text-lg font-livvic-bold text-[var(--secondary)] mb-2">
                Word reading fluency
              </h3>
              <p className="text-[var(--primary-text)] font-livvic-medium">
                Evaluates how quickly and accurately a student can decode and
                read individual words, an indicator of reading automaticity.
              </p>
            </div>

            <div className="border-l-4 border-[var(--accent)]/40 pl-4">
              <h3 className="text-lg font-livvic-bold text-[var(--secondary)] mb-2">
                Reading comprehension
              </h3>
              <p className="text-[var(--primary-text)] font-livvic-medium">
                Measures the student's understanding of text content and ability
                to extract meaning from written material.
              </p>
            </div>

            <div className="border-l-4 border-[var(--secondary)]/60 pl-4">
              <h3 className="text-lg font-livvic-bold text-[var(--secondary)] mb-2">
                Spelling and writing
              </h3>
              <p className="text-[var(--primary-text)] font-livvic-medium">
                Assesses phonetic and orthographic knowledge through spelling
                tasks and written expression capabilities.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-livvic-bold mb-4 text-[var(--secondary)]">
            Interpreting results
          </h2>
          <div className="bg-[var(--secondary)]/10 border border-[var(--secondary)]/20 rounded-lg p-6 mb-4">
            <h3 className="font-livvic-bold text-[var(--secondary)] mb-3">
              Score Ranges
            </h3>
            <ul className="space-y-2 text-[var(--primary-text)] font-livvic-medium">
              <li>
                <strong>80-100:</strong> Proficient — Student demonstrates
                strong skills in this domain.
              </li>
              <li>
                <strong>60-79:</strong> Developing — Student is making progress
                but may benefit from targeted support.
              </li>
              <li>
                <strong>40-59:</strong> At-Risk — Student shows significant
                difficulty; intervention is recommended.
              </li>
              <li>
                <strong>Below 40:</strong> High Risk — Immediate assessment and
                specialized intervention are strongly recommended.
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-livvic-bold mb-4 text-[var(--secondary)]">
            Important Disclaimers
          </h2>
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6">
            <ul className="space-y-3 text-[var(--primary-text)] font-livvic-medium">
              <li>
                ✓ Screening scores are <strong>informational only</strong> and
                should not be used as a standalone diagnostic tool.
              </li>
              <li>
                ✓ Always follow up screening results with a comprehensive
                evaluation by a qualified specialist (psychologist, diagnostician,
                speech-language pathologist).
              </li>
              <li>
                ✓ Factors such as cultural background, language exposure, and
                prior educational experience may influence scores.
              </li>
              <li>
                ✓ Use SkillScan scores as a starting point for professional
                discussion and evidence-based decision-making.
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-livvic-bold mb-4 text-[var(--secondary)]">
            Next Steps
          </h2>
          <p className="text-[var(--primary-text)] font-livvic-medium leading-relaxed">
            After reviewing a student's SkillScan scores, consider:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-[var(--primary-text)] font-livvic-medium mt-3">
            <li>Consulting with the student's teacher(s) and family</li>
            <li>
              Comparing results with other classroom assessments and
              observations
            </li>
            <li>
              Referral to a specialist for formal diagnostic assessment if
              concerns are present
            </li>
            <li>
              Implementing targeted interventions based on identified areas of
              need
            </li>
            <li>
              Monitoring progress over time and reassessing periodically
            </li>
          </ol>
        </section>

        <div className="mt-12 pt-8 border-t border-[var(--secondary)]/10">
          <p className="text-sm text-[var(--secondary-text)] text-center font-livvic-medium">
            For questions or concerns about your SkillScan assessment, please
            contact your school or district administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
