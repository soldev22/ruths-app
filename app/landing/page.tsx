import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to SkillScan
        </h1>
        <p className="text-2xl text-gray-700 mb-8">
          Evidence-Based Dyslexia Screening for Teachers
        </p>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
          Professional online screening tools designed and verified by qualified teaching professionals. 
          Identify learning difficulties early and provide targeted support.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center mb-16">
          <Link
            href="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition"
          >
            Start Free Trial
          </Link>
          <Link
            href="/register"
            className="bg-white hover:bg-gray-50 text-blue-600 font-bold py-4 px-8 rounded-lg text-xl shadow-lg border-2 border-blue-600 transition"
          >
            Login
          </Link>
        </div>

        {/* Trial Info - More Prominent */}
        <div className="bg-gradient-to-r from-green-400 to-green-500 text-white rounded-xl p-8 max-w-3xl mx-auto mb-16 shadow-2xl">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-4">
              Start Your Free 30-Day Trial Today
            </h2>
            <div className="bg-white text-gray-900 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center gap-8 mb-4">
                <div>
                  <div className="text-4xl font-bold text-green-600">30</div>
                  <div className="text-sm">Days Free</div>
                </div>
                <div className="text-3xl text-gray-300">+</div>
                <div>
                  <div className="text-4xl font-bold text-green-600">20</div>
                  <div className="text-sm">Free Screenings</div>
                </div>
              </div>
              <p className="text-lg text-gray-700 font-semibold">
                ✓ No credit card required
              </p>
              <p className="text-md text-gray-600">
                ✓ Full access to all features
              </p>
              <p className="text-md text-gray-600">
                ✓ AI-powered reports included
              </p>
            </div>
            <Link
              href="/register"
              className="inline-block bg-white text-green-600 hover:bg-gray-100 font-bold py-4 px-12 rounded-lg text-2xl shadow-lg transition transform hover:scale-105"
            >
              Get Started - It's Free! →
            </Link>
            <p className="text-sm text-green-100 mt-4">
              Already have an account?{" "}
              <Link href="/register" className="underline font-semibold hover:text-white">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Teachers Choose SkillScan</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-3">Fast & Easy</h3>
              <p className="text-gray-600">
                Complete screenings in 20-30 minutes. Results available immediately with AI-powered reports.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-3">Evidence-Based</h3>
              <p className="text-gray-600">
                Grounded in peer-reviewed research and validated by specialist teachers with dyslexia expertise.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-3">GDPR Compliant</h3>
              <p className="text-gray-600">
                No student names stored. Complete privacy protection designed for UK schools.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <div className="bg-blue-600 text-white font-bold text-2xl rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              1
            </div>
            <h3 className="font-semibold mb-2">Register Free</h3>
            <p className="text-sm text-gray-600">Create your teacher account in 2 minutes</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <div className="bg-blue-600 text-white font-bold text-2xl rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              2
            </div>
            <h3 className="font-semibold mb-2">Create Cases</h3>
            <p className="text-sm text-gray-600">Start screenings for your students</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <div className="bg-blue-600 text-white font-bold text-2xl rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              3
            </div>
            <h3 className="font-semibold mb-2">Run Screenings</h3>
            <p className="text-sm text-gray-600">Complete assessments with students</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <div className="bg-blue-600 text-white font-bold text-2xl rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              4
            </div>
            <h3 className="font-semibold mb-2">Get Results</h3>
            <p className="text-sm text-gray-600">Download reports and plan interventions</p>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Subscription Plans</h2>
          <p className="text-xl mb-3">Unlimited screenings for your staff</p>
          <p className="text-lg text-blue-100 mb-12">✓ Shared login - All teachers access one account</p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white text-gray-900 rounded-lg p-8 shadow-xl">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <p className="text-sm text-gray-600 mb-4">Perfect for small schools</p>
              <div className="text-5xl font-bold mb-2">£9.99</div>
              <div className="text-gray-600 mb-6">per month</div>
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="text-3xl font-bold text-blue-600">5</div>
                <div className="text-sm text-gray-700">teachers</div>
              </div>
              <ul className="text-left space-y-3 mb-8 text-sm">
                <li>✓ Unlimited screenings</li>
                <li>✓ AI-generated reports</li>
                <li>✓ Word export</li>
                <li>✓ GDPR compliant</li>
                <li>✓ Email support</li>
              </ul>
              <div className="text-sm text-gray-600 pt-4 border-t">
                Annual: <strong>£99.90/year</strong> (save 2 months)
              </div>
            </div>

            {/* Professional Plan */}
            <div className="bg-green-500 text-white rounded-lg p-8 shadow-xl relative transform scale-105">
              <div className="absolute -top-4 right-4 bg-yellow-400 text-gray-900 font-bold px-4 py-1 rounded-full text-sm">
                POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <p className="text-sm text-green-100 mb-4">Most schools choose this</p>
              <div className="text-5xl font-bold mb-2">£35.99</div>
              <div className="text-green-100 mb-6">per month</div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6">
                <div className="text-3xl font-bold">25</div>
                <div className="text-sm">teachers</div>
              </div>
              <ul className="text-left space-y-3 mb-8 text-sm">
                <li>✓ Everything in Starter</li>
                <li>✓ Priority support</li>
                <li>✓ Training webinars</li>
                <li>✓ Dedicated account manager</li>
                <li>✓ Custom reports</li>
              </ul>
              <div className="text-sm text-green-100 pt-4 border-t border-green-400">
                Annual: <strong>£359.90/year</strong> (save 2 months)
              </div>
            </div>

            {/* School Plan */}
            <div className="bg-white text-gray-900 rounded-lg p-8 shadow-xl">
              <h3 className="text-2xl font-bold mb-2">School</h3>
              <p className="text-sm text-gray-600 mb-4">For larger schools</p>
              <div className="text-5xl font-bold mb-2">£73.99</div>
              <div className="text-gray-600 mb-6">per month</div>
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="text-3xl font-bold text-blue-600">50</div>
                <div className="text-sm text-gray-700">teachers</div>
              </div>
              <ul className="text-left space-y-3 mb-8 text-sm">
                <li>✓ Everything in Professional</li>
                <li>✓ Phone support</li>
                <li>✓ On-site training available</li>
                <li>✓ Data export & analytics</li>
                <li>✓ Integration support</li>
              </ul>
              <div className="text-sm text-gray-600 pt-4 border-t">
                Annual: <strong>£739.90/year</strong> (save 2 months)
              </div>
            </div>
          </div>

          <div className="mt-12 bg-white bg-opacity-20 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-lg mb-3">
              <strong>Need more than 50 teachers?</strong>
            </p>
            <p className="text-sm mb-4">
              Contact us for district-wide pricing and custom solutions
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-blue-600 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition"
            >
              Request Quote
            </Link>
          </div>
          
          <div className="mt-8 text-sm text-blue-100">
            <p>💰 <strong>Save vs. Competition:</strong> Other tools charge £7.50 per assessment - You save hundreds!</p>
          </div>
        </div>
      </div>

      {/* Resources Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Learn More</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/about"
            className="bg-white border-2 border-gray-200 hover:border-blue-600 rounded-lg p-6 text-center transition shadow-sm hover:shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-2">About SkillScan</h3>
            <p className="text-gray-600 text-sm">Learn about the science behind online screeners</p>
          </Link>
          <Link
            href="/user-guide"
            className="bg-white border-2 border-gray-200 hover:border-blue-600 rounded-lg p-6 text-center transition shadow-sm hover:shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-2">User Guide</h3>
            <p className="text-gray-600 text-sm">Step-by-step instructions for getting started</p>
          </Link>
          <Link
            href="/faq"
            className="bg-white border-2 border-gray-200 hover:border-blue-600 rounded-lg p-6 text-center transition shadow-sm hover:shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-2">FAQ</h3>
            <p className="text-gray-600 text-sm">Common questions about using SkillScan</p>
          </Link>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-blue-50 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-700 mb-8">
            Join teachers across the UK using SkillScan to identify learning difficulties early
          </p>
          <Link
            href="/register"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-lg text-2xl shadow-lg transition"
          >
            Start Your Free Trial Now
          </Link>
          <p className="text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline font-semibold">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
