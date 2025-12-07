export default function ContactPage() {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
        </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Contact Information */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Solutions Developed</h3>
              <p className="text-gray-600">
                The Crown Hub<br />
                Main Street<br />
                Thornton, Fife<br />
                KY1 4AF
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Email</h3>
              <a
                href="mailto:contact@solutionsdeveloped.co.uk"
                className="text-blue-600 hover:underline"
              >
                contact@solutionsdeveloped.co.uk
              </a>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Telephone</h3>
              <a
                href="tel:07739870670"
                className="text-blue-600 hover:underline"
              >
                07739 870670
              </a>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded">
            <p className="text-sm text-gray-700">
              <strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM
            </p>
            <p className="text-sm text-gray-600 mt-2">
              We typically respond to enquiries within 1-2 business days.
            </p>
          </div>
        </div>

        {/* What We Can Help With */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">How Can We Help?</h2>
          
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">•</span>
              <span>Technical support with SkillScan</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">•</span>
              <span>Questions about screening methodology</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">•</span>
              <span>Training and professional development</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">•</span>
              <span>School or district-wide implementation</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">•</span>
              <span>Custom assessment solutions</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">•</span>
              <span>Data privacy and GDPR compliance queries</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">•</span>
              <span>Billing and subscription support</span>
            </li>
          </ul>

          <div className="mt-6 p-4 bg-green-50 rounded">
            <p className="text-sm text-gray-700">
              <strong>Need immediate help?</strong> Check our documentation and FAQs in the 
              <a href="/about" className="text-blue-600 hover:underline ml-1">About</a> section.
            </p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4">Find Us</h2>
        <div className="w-full h-96 rounded overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2234.5!2d-3.166!3d56.065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48862a9e7e7e7e7e%3A0x7e7e7e7e7e7e7e7e!2sThornton%2C%20Fife%20KY1%204AF!5e0!3m2!1sen!2suk!4v1234567890123!5m2!1sen!2suk"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Solutions Developed Location"
          ></iframe>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Located in Thornton, Fife, we're easily accessible from across Scotland and the UK.
        </p>
      </div>

      {/* About Solutions Developed */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
        <h2 className="text-2xl font-semibold mb-4 text-blue-900">About Solutions Developed</h2>
        <p className="text-gray-700 mb-3">
          Solutions Developed is dedicated to creating innovative educational technology that 
          supports teachers and improves outcomes for learners. Our team combines expertise in 
          education, technology, and learning support to deliver tools that are both 
          evidence-based and practical.
        </p>
        <p className="text-gray-700">
          SkillScan is designed and overseen by qualified teaching professionals with 
          specialization in learning difficulties, ensuring that every aspect of the platform 
          reflects current best practice in assessment and intervention.
        </p>
      </div>
      </div>
    </div>
  );
}
