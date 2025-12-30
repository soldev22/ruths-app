export default function PrivacyPage() {
  return (

    <div className="w-full min-h-screen bg-[var(--background)] font-sans">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
        <div className="bg-[var(--background)] rounded-2xl shadow-sm p-6 mb-8 border border-[var(--secondary)]/10">
          <h1 className="text-4xl font-livvic-bold text-[var(--secondary)]">Privacy and data protection</h1>
        </div>

        <div className="bg-[var(--secondary)]/10 border-l-4 border-[var(--secondary)] p-6 mb-8">
          <h2 className="text-2xl font-livvic-bold mb-3 text-[var(--secondary)]">
            GDPR compliance notice
          </h2>
          <p className="text-lg text-[var(--secondary)] font-livvic-medium">
            SkillScan is designed with privacy at its core. We do not store any personally identifiable student information.
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-livvic-bold mb-4 text-[var(--secondary)]">What we do not store</h2>
          <ul className="list-disc list-inside space-y-2 text-[var(--primary-text)] font-livvic-medium">
            <li><strong>Student names</strong> – Names are never saved to our database</li>
            <li><strong>Date of birth</strong> – No personal demographic data is collected</li>
            <li><strong>School information</strong> – Institution details are not recorded</li>
            <li><strong>Contact information</strong> – No email addresses or phone numbers</li>
            <li><strong>Addresses</strong> – No location or address data is stored</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-livvic-bold mb-4 text-[var(--secondary)]">What we do store</h2>
          <ul className="list-disc list-inside space-y-2 text-[var(--primary-text)] font-livvic-medium">
            <li><strong>Anonymous Case IDs</strong> – Randomly generated reference numbers</li>
            <li><strong>Screening responses</strong> – Student answers to assessment questions</li>
            <li><strong>Teacher account email</strong> – For login authentication only</li>
            <li><strong>Reading year level</strong> – Academic stage (e.g., S1, S2)</li>
          </ul>
        </section>

        <section className="mb-8 bg-yellow-50 border-l-4 border-yellow-500 p-6">
          <h2 className="text-2xl font-livvic-bold mb-4 text-yellow-900">
            ⚠️ Important: record-keeping requirement
          </h2>
          <div className="text-gray-800 space-y-3">
            <p className="font-semibold text-lg">
              You MUST maintain your own records linking Case IDs to student names.
            </p>
            <p>
              Since we do not store student names for GDPR compliance, you are responsible for keeping a secure record that maps each Case ID to the corresponding student.
            </p>
            <p className="font-medium">
              Recommended approach:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Keep a physical notebook or secure digital spreadsheet</li>
              <li>Record the Case ID next to each student's name when you create a new screening</li>
              <li>Store this record in a secure, password-protected location</li>
              <li>Follow your institution's data protection policies</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How to use case IDs</h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li>
              <strong>When creating a new screening:</strong> Note the generated Case ID (e.g., 983079) immediately
            </li>
            <li>
              <strong>Write it down:</strong> Record this Case ID alongside the student's name in your secure records
            </li>
            <li>
              <strong>When reopening a screening:</strong> Look up the Case ID from your records using the student's name
            </li>
            <li>
              <strong>Access the screening:</strong> Use the Case ID to view results on the dashboard
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data retention</h2>
          <p className="text-gray-700 mb-3">
            Screening data (responses and scores) is retained indefinitely unless you request deletion. 
            However, since no personal identifiers are stored, the data cannot be traced back to individual students without your Case ID records.
          </p>
          <p className="text-gray-700">
            If you need to delete a screening, contact your system administrator with the Case ID.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Word report export</h2>
          <p className="text-gray-700 mb-3">
            When you export a Word report, you have the option to enter a student name. This name:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Is <strong>NOT saved</strong> to our database</li>
            <li>Only appears in the downloaded Word document</li>
            <li>Is your responsibility to handle securely according to GDPR requirements</li>
            <li>Should be stored/shared following your institution's policies</li>
          </ul>
        </section>

        <section className="mb-8 bg-green-50 border-l-4 border-green-500 p-6">
          <h2 className="text-2xl font-semibold mb-4 text-green-900">
            ✓ GDPR Compliance Summary
          </h2>
          <p className="text-gray-800 mb-3">
            By design, SkillScan minimizes data collection and ensures:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Data minimization:</strong> Only essential assessment data is stored</li>
            <li><strong>Pseudonymization:</strong> Case IDs replace personal identifiers</li>
            <li><strong>User control:</strong> You maintain the link between IDs and students</li>
            <li><strong>Privacy by design:</strong> Personal data is never requested or stored</li>
          </ul>
        </section>

      <section className="mt-8 pt-6 border-t">
        <p className="text-sm text-gray-600">
          <strong>Questions about data protection?</strong> Contact your system administrator or data protection officer.
        </p>
      </section>
      </div>
    </div>
  );
}
