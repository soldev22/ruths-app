export default function UserGuidePage() {
  return (
    <div className="w-full min-h-screen bg-[var(--background)] font-sans">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
        <div className="bg-[var(--background)] rounded-2xl shadow-sm p-6 mb-8 border border-[var(--secondary)]/10">
          <h1 className="text-4xl font-livvic-bold text-[var(--secondary)]">User guide</h1>
        </div>
        <p className="text-lg text-[var(--primary-text)] font-livvic-medium mb-8">
          Step-by-step instructions for using SkillScan effectively
        </p>

        <div className="space-y-8">
        {/* Step 1: Creating Your Account */}
        <section className="bg-[var(--background)] shadow-md rounded-lg p-6 border border-[var(--secondary)]/10">
          <div className="flex items-center mb-4">
            <span className="bg-[var(--accent)] text-[var(--background)] font-livvic-bold text-xl rounded-full w-10 h-10 flex items-center justify-center mr-3">
              1
            </span>
            <h2 className="text-2xl font-livvic-bold text-[var(--secondary)]">Creating your account</h2>
          </div>
          <div className="ml-13 space-y-3 text-[var(--primary-text)] font-livvic-medium">
            <p>
              <strong>New Users:</strong> Click the "Login" button in the top right corner, then select 
              "Register" to create your teacher account.
            </p>
            <ol className="list-decimal list-inside ml-4 space-y-2">
              <li>Enter your professional email address</li>
              <li>Create a secure password</li>
              <li>Provide your name (optional but recommended)</li>
              <li>Click "Register" to complete setup</li>
            </ol>
            <p className="text-sm text-[var(--secondary-text)] mt-3 font-livvic-medium">
              💡 <strong>Tip:</strong> Use your school email address so colleagues can identify you if 
              collaborating on cases.
            </p>
          </div>
        </section>

        {/* Step 2: Creating a New Case */}
        <section className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center mb-4">
            <span className="bg-blue-600 text-white font-bold text-xl rounded-full w-10 h-10 flex items-center justify-center mr-3">
              2
            </span>
            <h2 className="text-2xl font-semibold">Creating a new case</h2>
          </div>
          <div className="ml-13 space-y-3 text-gray-700">
            <ol className="list-decimal list-inside ml-4 space-y-2">
              <li>Click <strong>"New Case"</strong> in the sidebar</li>
              <li>Select the student's reading year level (e.g., S1, S2, S3)</li>
              <li>A unique <strong>Case ID</strong> will be generated (e.g., 983079)</li>
              <li>
                <strong className="text-red-600">IMPORTANT:</strong> Immediately write down the Case ID 
                alongside the student's name in your secure records
              </li>
              <li>Click "Start Screening" to begin</li>
            </ol>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
              <p className="font-semibold text-yellow-900">⚠️ Critical Step</p>
              <p className="text-sm text-gray-700 mt-1">
                SkillScan does NOT save student names for GDPR compliance. You MUST keep your own record 
                linking Case IDs to students. Without this record, you won't be able to identify which 
                screening belongs to which student.
              </p>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              💡 <strong>Tip:</strong> Create a secure spreadsheet or notebook where you record: Case ID | 
              Student Name | Date Created | Year Level
            </p>
          </div>
        </section>

        {/* Step 3: Completing the Screening */}
        <section className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center mb-4">
            <span className="bg-blue-600 text-white font-bold text-xl rounded-full w-10 h-10 flex items-center justify-center mr-3">
              3
            </span>
            <h2 className="text-2xl font-semibold">Completing the screening</h2>
          </div>
          <div className="ml-13 space-y-3 text-gray-700">
            <p>The screening is divided into sections (e.g., Phonological Awareness, Letter-Sound Knowledge).</p>
            
            <h3 className="font-semibold mt-4">Navigation box</h3>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>At the top of the page, you'll see buttons for all sections</li>
              <li>The <strong>current section</strong> is highlighted in black</li>
              <li><strong className="text-green-600">Green sections with ✓</strong> are completed</li>
              <li><strong>Gray sections</strong> are locked until previous sections are complete</li>
            </ul>

            <h3 className="font-semibold mt-4">Answering questions</h3>
            <ol className="list-decimal list-inside ml-4 space-y-2">
              <li>Read each question to the student (or have them read it)</li>
              <li>Select their answer using the radio buttons</li>
              <li>You must answer <strong>all questions</strong> in a section before moving forward</li>
              <li>Click "Save and continue" to move to the next section</li>
              <li>Progress is saved automatically</li>
            </ol>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
              <p className="font-semibold text-blue-900">✓ Best Practices</p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-sm text-gray-700 mt-2">
                <li>Complete screenings in a quiet, distraction-free environment</li>
                <li>Take breaks between sections if the student needs them</li>
                <li>You can close the browser and return later using the same Case ID</li>
                <li>Ensure the student understands each question before answering</li>
                <li>Record the student's first response - don't coach or correct</li>
              </ul>
            </div>

            <p className="text-sm text-gray-600 mt-3">
              💡 <strong>Tip:</strong> If you need to change an answer, click on the section button at the 
              top to go back and edit.
            </p>
          </div>
        </section>

        {/* Step 4: Viewing Results */}
        <section className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center mb-4">
            <span className="bg-blue-600 text-white font-bold text-xl rounded-full w-10 h-10 flex items-center justify-center mr-3">
              4
            </span>
            <h2 className="text-2xl font-semibold">Viewing results (overview page)</h2>
          </div>
          <div className="ml-13 space-y-3 text-gray-700">
            <p>
              After completing all sections, you'll automatically be taken to the <strong>Overview page</strong>.
            </p>

            <h3 className="font-semibold mt-4">What you'll see</h3>
            <ol className="list-decimal list-inside ml-4 space-y-2">
              <li>
                <strong>Section Navigation Box:</strong> Quick links to jump to specific sections
              </li>
              <li>
                <strong>Overall Risk Classification:</strong> Low Risk, Moderate Risk, or High Risk (with color coding)
              </li>
              <li>
                <strong>Overall Score:</strong> Percentage showing difficulty level across all sections
              </li>
              <li>
                <strong>Section Cards:</strong> Each section shows:
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>Section name</li>
                  <li>Difficulty percentage</li>
                  <li>Risk level (LOW/MODERATE/HIGH RISK badge)</li>
                  <li>Click to expand and see individual questions</li>
                </ul>
              </li>
            </ol>

            <h3 className="font-semibold mt-4">Expanding sections</h3>
            <p>Click on any section card to see:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Each question text</li>
              <li><strong>Student answered:</strong> What they said</li>
              <li><strong>Correct answer:</strong> The expected response</li>
            </ul>

            <p className="text-sm text-gray-600 mt-3">
              💡 <strong>Tip:</strong> Use the section navigation box to quickly jump to areas of concern 
              (red or amber sections).
            </p>
          </div>
        </section>

        {/* Step 5: Generating Reports */}
        <section className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center mb-4">
            <span className="bg-blue-600 text-white font-bold text-xl rounded-full w-10 h-10 flex items-center justify-center mr-3">
              5
            </span>
            <h2 className="text-2xl font-semibold">Generating reports</h2>
          </div>
          <div className="ml-13 space-y-3 text-gray-700">
            <h3 className="font-semibold">Option 1: Word report</h3>
            <ol className="list-decimal list-inside ml-4 space-y-2">
              <li>On the Overview page, scroll to the "Student Name" field</li>
              <li>
                Enter the student's name (optional - <strong>NOT saved</strong> to database, only appears in report)
              </li>
              <li>Add any teacher notes in the text area</li>
              <li>Click "Download Word Report"</li>
              <li>A formatted .docx file will download to your computer</li>
            </ol>

            <h3 className="font-semibold mt-4">Option 2: AI-generated report</h3>
            <ol className="list-decimal list-inside ml-4 space-y-2">
              <li>Scroll down to the "AI Report Generator" section</li>
              <li>Click "Generate AI Report"</li>
              <li>Wait for the AI to analyze results (10-30 seconds)</li>
              <li>Review the narrative report that appears</li>
              <li>
                <strong>Important:</strong> AI reports are for guidance only and should be reviewed by a 
                qualified professional
              </li>
            </ol>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
              <p className="font-semibold text-yellow-900">⚠️ Remember</p>
              <p className="text-sm text-gray-700 mt-1">
                Reports are screening tools, not diagnoses. Use them as a starting point for conversations 
                with specialists, parents, and support staff.
              </p>
            </div>
          </div>
        </section>

        {/* Step 6: Managing Your Dashboard */}
        <section className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center mb-4">
            <span className="bg-blue-600 text-white font-bold text-xl rounded-full w-10 h-10 flex items-center justify-center mr-3">
              6
            </span>
            <h2 className="text-2xl font-semibold">Managing your dashboard</h2>
          </div>
          <div className="ml-13 space-y-3 text-gray-700">
            <p>Click <strong>"Dashboard"</strong> in the sidebar to see all your screenings.</p>

            <h3 className="font-semibold mt-4">Date filtering</h3>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Click <strong>"All"</strong> to see all screenings</li>
              <li>Click <strong>"Last 7 Days"</strong> to see recent cases</li>
              <li>Click <strong>"Last 30 Days"</strong> for the current month</li>
              <li>Use <strong>custom date range</strong> for specific periods</li>
            </ul>

            <h3 className="font-semibold mt-4">Sections</h3>
            <p><strong>In Progress:</strong> Screenings not yet completed (fewer than 10 sections done)</p>
            <p><strong>Completed:</strong> Screenings with all sections finished</p>

            <h3 className="font-semibold mt-4">Actions</h3>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Click <strong>"Continue"</strong> to resume an in-progress screening</li>
              <li>Click <strong>"View Results"</strong> to see the overview of completed screenings</li>
              <li>Each entry shows: Case ID, Reading Year, Date, and current status</li>
            </ul>

            <p className="text-sm text-gray-600 mt-3">
              💡 <strong>Tip:</strong> Use your Case ID lookup record to identify which screening belongs to 
              which student when viewing your dashboard.
            </p>
          </div>
        </section>

        {/* Step 7: Interpreting Results */}
        <section className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center mb-4">
            <span className="bg-blue-600 text-white font-bold text-xl rounded-full w-10 h-10 flex items-center justify-center mr-3">
              7
            </span>
            <h2 className="text-2xl font-semibold">Interpreting results</h2>
          </div>
          <div className="ml-13 space-y-3 text-gray-700">
            <h3 className="font-semibold">Understanding risk levels</h3>
            <div className="space-y-2 ml-4">
              <div className="flex items-start">
                <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded mr-2">LOW</span>
                <p>80%+ correct - Performance within expected range, no immediate concerns</p>
              </div>
              <div className="flex items-start">
                <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded mr-2">MODERATE</span>
                <p>60-79% correct - Some difficulties present, monitor progress and provide targeted support</p>
              </div>
              <div className="flex items-start">
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded mr-2">HIGH RISK</span>
                <p>Below 60% - Significant difficulties, recommend further assessment by specialists</p>
              </div>
            </div>

            <h3 className="font-semibold mt-4">Next steps based on results</h3>
            <div className="space-y-3 ml-4">
              <div>
                <p className="font-semibold text-green-700">Low Risk:</p>
                <ul className="list-disc list-inside ml-4 text-sm">
                  <li>Continue regular classroom instruction</li>
                  <li>Re-screen in 6-12 months to monitor progress</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-yellow-700">Moderate Risk:</p>
                <ul className="list-disc list-inside ml-4 text-sm">
                  <li>Provide small-group intervention targeting specific areas of difficulty</li>
                  <li>Monitor progress every 6-8 weeks</li>
                  <li>Consider additional classroom accommodations</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-red-700">High Risk:</p>
                <ul className="list-disc list-inside ml-4 text-sm">
                  <li>Refer for comprehensive assessment by educational psychologist or specialist</li>
                  <li>Implement intensive intervention immediately</li>
                  <li>Discuss with parents/guardians and support staff</li>
                  <li>Consider formal accommodations or support plan</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
              <p className="font-semibold text-blue-900">📊 For More Details</p>
              <p className="text-sm text-gray-700 mt-1">
                Visit the <a href="/scoring-guide" className="text-blue-600 hover:underline">Scoring Guide</a> page 
                for detailed information about each domain and scoring thresholds.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Reference */}
        <section className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-blue-900">Quick reference</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Key reminders</h3>
              <ul className="space-y-1 text-gray-700">
                <li>✓ Always record Case IDs with student names</li>
                <li>✓ Complete all questions in a section before moving on</li>
                <li>✓ Progress saves automatically</li>
                <li>✓ You can return to incomplete screenings anytime</li>
                <li>✓ Results are screening tools, not diagnoses</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Need help?</h3>
              <ul className="space-y-1 text-gray-700">
                <li>📧 <a href="mailto:contact@solutionsdeveloped.co.uk" className="text-blue-600 hover:underline">contact@solutionsdeveloped.co.uk</a></li>
                <li>📞 <a href="tel:07739870670" className="text-blue-600 hover:underline">07739 870670</a></li>
                <li>❓ <a href="/faq" className="text-blue-600 hover:underline">Visit our FAQ page</a></li>
                <li>ℹ️ <a href="/about" className="text-blue-600 hover:underline">Learn about the science</a></li>
              </ul>
            </div>
          </div>
        </section>
      </div>
      </div>
    </div>
  );
}
