"use client";

export default function ScoringGuidePage() {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            SkillScan Scoring System Guide
          </h1>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Overview
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The SkillScan scoring system is designed to provide educators and
            specialists with a structured assessment of a student's performance
            in literacy screening. Scores are calculated based on responses to
            targeted questions across multiple screening domains.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Screening Domains
          </h2>
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Phonological Awareness
              </h3>
              <p className="text-gray-700">
                Measures the student's ability to recognize and manipulate the
                sound structures of language, including rhyming, syllable
                segmentation, and phoneme awareness.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Letter-Sound Knowledge
              </h3>
              <p className="text-gray-700">
                Assesses familiarity with the alphabetic principle and the
                student's ability to associate letters with their corresponding
                sounds.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Word Reading Fluency
              </h3>
              <p className="text-gray-700">
                Evaluates how quickly and accurately a student can decode and
                read individual words, an indicator of reading automaticity.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Reading Comprehension
              </h3>
              <p className="text-gray-700">
                Measures the student's understanding of text content and ability
                to extract meaning from written material.
              </p>
            </div>

            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Spelling and Writing
              </h3>
              <p className="text-gray-700">
                Assesses phonetic and orthographic knowledge through spelling
                tasks and written expression capabilities.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Interpreting Results
          </h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Score Ranges
            </h3>
            <ul className="space-y-2 text-gray-700">
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Important Disclaimers
          </h2>
          <div className="bg-amber-50 border border-amber-300 rounded-lg p-6">
            <ul className="space-y-3 text-gray-700">
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Next Steps
          </h2>
          <p className="text-gray-700 leading-relaxed">
            After reviewing a student's SkillScan scores, consider:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 mt-3">
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

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            For questions or concerns about your SkillScan assessment, please
            contact your school or district administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
