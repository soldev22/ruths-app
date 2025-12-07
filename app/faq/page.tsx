export default function FAQPage() {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Frequently Asked Questions</h1>
        </div>

        <div className="space-y-6">
        {/* Getting Started */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-900 bg-blue-50 p-3 rounded">
            Getting Started
          </h2>

          <div className="space-y-4">
            <div className="bg-white shadow-sm rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2">How do I create a new screening?</h3>
              <p className="text-gray-700">
                Click "New Case" in the sidebar. You'll be prompted to select a reading year level (e.g., S1, S2). 
                A unique Case ID will be generated automatically. Record this Case ID alongside the student's name 
                in your secure records (we don't store student names for GDPR compliance).
              </p>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2">What is a Case ID and why is it important?</h3>
              <p className="text-gray-700">
                A Case ID is a randomly generated reference number (e.g., 983079) that identifies a specific 
                screening. Since SkillScan doesn't store student names, you must keep your own secure record 
                linking Case IDs to students. This ensures GDPR compliance while allowing you to retrieve 
                screenings later.
              </p>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2">How long does a screening take?</h3>
              <p className="text-gray-700">
                A full dyslexia screening typically takes 20-30 minutes, depending on the student's reading 
                level and the number of sections. The screening is divided into sections that can be completed 
                over multiple sessions if needed.
              </p>
            </div>
          </div>
        </section>

        {/* Using the Screening Tool */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-900 bg-blue-50 p-3 rounded">
            Using the Screening Tool
          </h2>

          <div className="space-y-4">
            <div className="bg-white shadow-sm rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2">Can I save progress and return later?</h3>
              <p className="text-gray-700">
                Yes! Each section is automatically saved when you click "Save and continue" or navigate 
                between sections. You can close the browser and return to the same Case ID later to continue 
                where you left off.
              </p>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2">Can I go back and change answers?</h3>
              <p className="text-gray-700">
                Yes, you can navigate between sections using the section navigation box at the top of the 
                screening page. Changes are saved automatically when you move between sections.
              </p>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2">Do I need to complete all sections at once?</h3>
              <p className="text-gray-700">
                No. You can complete sections over multiple sessions. However, you must complete all questions 
                in the current section before moving forward. The dashboard shows which screenings are 
                "In Progress" vs. "Completed."
              </p>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2">What do the green checkmarks mean?</h3>
              <p className="text-gray-700">
                Green checkmarks (✓) appear next to sections that have been fully completed. This helps you 
                track your progress through the screening.
              </p>
            </div>
          </div>
        </section>

        {/* Understanding Results */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-900 bg-blue-50 p-3 rounded">
            Understanding Results
          </h2>

          <div className="space-y-4">
            <div className="bg-white shadow-sm rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2">What do the risk levels mean?</h3>
              <p className="text-gray-700 mb-2">
                Each section is scored using a traffic light system:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
                <li><strong className="text-green-600">LOW (Green):</strong> 80%+ correct - No significant concerns</li>
                <li><strong className="text-yellow-600">MODERATE (Amber):</strong> 60-79% correct - Some areas need attention</li>
                <li><strong className="text-red-600">HIGH RISK (Red):</strong> Below 60% - Significant difficulties, intervention recommended</li>
              </ul>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2">How is the overall risk classification determined?</h3>
              <p className="text-gray-700">
                The overall classification considers performance across all sections. Generally:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 mt-2">
                <li><strong>High Risk:</strong> 2+ red sections OR 1 red + 2+ amber sections</li>
                <li><strong>Moderate Risk:</strong> 1 red section OR multiple amber sections</li>
                <li><strong>Low Risk:</strong> Mostly green sections with strong overall performance</li>
              </ul>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2">Does a "High Risk" result mean the student has dyslexia?</h3>
              <p className="text-gray-700">
                <strong>No.</strong> SkillScan is a screening tool, not a diagnostic assessment. A high-risk 
                result indicates that the student may benefit from further evaluation by qualified professionals 
                (educational psychologists, specialist teachers). Many factors can affect screening performance, 
                including anxiety, attention difficulties, English as an additional language, or simply an off day.
              </p>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2">Can I see which questions the student got wrong?</h3>
              <p className="text-gray-700">
                Yes! In the Overview page, expand each section to see individual questions, the student's 
                answer, and the correct answer. This helps you identify specific areas of difficulty.
              </p>
            </div>
          </div>
        </section>

        {/* Reports and Export */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-900 bg-blue-50 p-3 rounded">
            Reports and Export
          </h2>

          <div className="space-y-4">
            <div className="bg-white shadow-sm rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2">How do I generate a Word report?</h3>
              <p className="text-gray-700">
                On the Overview page, you can enter a student name (optional - not saved to database) and 
                teacher notes. Click "Download Word Report" to generate a formatted document that can be 
                shared with parents, colleagues, or specialists.
              </p>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2">What is the AI-generated report?</h3>
              <p className="text-gray-700">
                SkillScan can generate a narrative report using artificial intelligence that analyzes the 
                screening results and suggests next steps. This report is for informational purposes only 
                and should be reviewed by a qualified professional before making educational decisions.
              </p>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2">Are student names included in reports?</h3>
              <p className="text-gray-700">
                Only if you enter a name when generating the Word report. The name you enter is <strong>not 
                saved</strong> to the database - it only appears in the downloaded document. This ensures 
                GDPR compliance while allowing you to create personalized reports.
              </p>
            </div>
          </div>
        </section>

        {/* Data and Privacy */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-900 bg-blue-50 p-3 rounded">
            Data and Privacy
          </h2>

          <div className="space-y-4">
            <div className="bg-white shadow-sm rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2">What data does SkillScan store?</h3>
              <p className="text-gray-700">
                SkillScan stores: Case IDs, screening responses, reading year levels, and your teacher account 
                email. We <strong>do not</strong> store student names, dates of birth, school information, or 
                any personally identifiable information about students.
              </p>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2">Is SkillScan GDPR compliant?</h3>
              <p className="text-gray-700">
                Yes. By design, SkillScan minimizes data collection and uses pseudonymization (Case IDs) 
                instead of storing personal identifiers. See our <a href="/privacy" className="text-blue-600 hover:underline">Privacy & GDPR</a> page 
                for full details.
              </p>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2">Can I delete a screening?</h3>
              <p className="text-gray-700">
                Yes. Contact us at <a href="mailto:contact@solutionsdeveloped.co.uk" className="text-blue-600 hover:underline">contact@solutionsdeveloped.co.uk</a> with 
                the Case ID you wish to delete. We'll remove it from the system within 48 hours.
              </p>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2">Who can see my screenings?</h3>
              <p className="text-gray-700">
                Only you can see screenings created under your account. Each teacher has a private dashboard. 
                If you need to share results, use the Word export feature.
              </p>
            </div>
          </div>
        </section>

        {/* Technical Issues */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-900 bg-blue-50 p-3 rounded">
            Technical Issues
          </h2>

          <div className="space-y-4">
            <div className="bg-white shadow-sm rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2">What browsers are supported?</h3>
              <p className="text-gray-700">
                SkillScan works best on modern browsers: Google Chrome, Microsoft Edge, Firefox, and Safari 
                (desktop and tablet). We recommend keeping your browser up to date for the best experience.
              </p>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2">I can't log in. What should I do?</h3>
              <p className="text-gray-700">
                First, check that you're using the correct email address. If you've forgotten your password, 
                contact us at <a href="mailto:contact@solutionsdeveloped.co.uk" className="text-blue-600 hover:underline">contact@solutionsdeveloped.co.uk</a> to 
                reset it.
              </p>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2">My screening isn't saving. What's wrong?</h3>
              <p className="text-gray-700">
                Ensure you have a stable internet connection. Click "Save and continue" after completing each 
                section. If the problem persists, try refreshing the page or using a different browser. Contact 
                support if issues continue.
              </p>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2">Can I use SkillScan on a tablet?</h3>
              <p className="text-gray-700">
                Yes! SkillScan is responsive and works on tablets (iPad, Android tablets). For the best 
                experience, use landscape orientation.
              </p>
            </div>
          </div>
        </section>

        {/* Billing and Subscriptions */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-900 bg-blue-50 p-3 rounded">
            Billing and Subscriptions
          </h2>

          <div className="space-y-4">
            <div className="bg-white shadow-sm rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2">How much does SkillScan cost?</h3>
              <p className="text-gray-700">
                For pricing information and subscription options, please contact us at{" "}
                <a href="mailto:contact@solutionsdeveloped.co.uk" className="text-blue-600 hover:underline">contact@solutionsdeveloped.co.uk</a>. 
                We offer flexible plans for individual teachers, schools, and districts.
              </p>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-gray-700">
                Contact us to inquire about trial options for your school or district.
              </p>
            </div>
          </div>
        </section>

        {/* Still Have Questions? */}
        <section className="bg-green-50 border-l-4 border-green-500 p-6 rounded mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-green-900">Still Have Questions?</h2>
          <p className="text-gray-800 mb-3">
            Can't find the answer you're looking for? We're here to help!
          </p>
          <p className="text-gray-800">
            <strong>Email:</strong>{" "}
            <a href="mailto:contact@solutionsdeveloped.co.uk" className="text-blue-600 hover:underline">
              contact@solutionsdeveloped.co.uk
            </a>
            <br />
            <strong>Phone:</strong>{" "}
            <a href="tel:07739870670" className="text-blue-600 hover:underline">
              07739 870670
            </a>
            <br />
            <strong>Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM
          </p>
          <p className="text-sm text-gray-600 mt-3">
            Also check out our <a href="/about" className="text-blue-600 hover:underline">About</a> and{" "}
            <a href="/privacy" className="text-blue-600 hover:underline">Privacy</a> pages for more information.
          </p>
        </section>
        </div>
      </div>
    </div>
  );
}
