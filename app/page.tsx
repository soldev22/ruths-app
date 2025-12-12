"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          // Redirect to dashboard if logged in
          router.push("/protected/dashboard");
        } else {
          // Not logged in, show landing page
          setIsChecking(false);
        }
      } catch (err) {
        // Error or not logged in - show landing page
        setIsChecking(false);
      }
    }
    checkAuth();
  }, [router]);

  // Don't render landing page until we've checked auth
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page - inline to avoid import issues
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to SkillScan
        </h1>
        <p className="text-2xl text-gray-700 mb-8">
          Professional Dyslexia & Dyscalculia Screening
        </p>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          Professional online screening tools designed and verified by qualified education professionals. 
          Identify learning difficulties early and provide guidance.
        </p>

        {/* Login Link - Positioned High */}
        <div className="mb-12">
          <a
            href="/register"
            className="inline-block text-blue-600 hover:text-blue-700 font-semibold text-lg underline mb-2"
          >
            I already have an account →
          </a>
        </div>

        {/* User Type Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">I am a...</h2>
          <div className="flex gap-6 justify-center max-w-4xl mx-auto">
            <a
              href="/register"
              className="flex-1 bg-white hover:bg-green-50 border-2 border-green-600 rounded-xl p-8 shadow-lg transition transform hover:scale-105 group"
            >
              <div className="text-6xl mb-4">👩‍🏫</div>
              <h3 className="text-2xl font-bold text-green-700 mb-3">Teacher</h3>
              <p className="text-gray-600 mb-4">
                Screen multiple students efficiently. Professional reports for parents and SENCO.
              </p>
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4">
                <div className="text-2xl font-bold text-green-700 mb-1">Bundled Pricing</div>
                <p className="text-sm text-gray-600">Contact us for bulk packages tailored to your needs</p>
              </div>
              <ul className="text-sm text-left space-y-2 text-gray-700 mb-4">
                <li>✓ Manage class screenings</li>
                <li>✓ Track student progress</li>
                <li>✓ Generate professional reports</li>
                <li>✓ Bulk operations</li>
                <li>✓ No subscription required</li>
              </ul>
              <span className="inline-block bg-green-600 text-white font-bold py-3 px-6 rounded-lg group-hover:bg-green-700 transition">
                Get Started as Teacher →
              </span>
            </a>
            
            <a
              href="/register"
              className="flex-1 bg-white hover:bg-blue-50 border-2 border-blue-600 rounded-xl p-8 shadow-lg transition transform hover:scale-105 group"
            >
              <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
              <h3 className="text-2xl font-bold text-blue-700 mb-3">Parent / Individual</h3>
              <p className="text-gray-600 mb-4">
                Quick, affordable screening for your child or yourself. Clear results and guidance.
              </p>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
                <div className="text-3xl font-bold text-blue-700 mb-1">£5</div>
                <p className="text-sm text-gray-600">per assessment</p>
              </div>
              <ul className="text-sm text-left space-y-2 text-gray-700 mb-4">
                <li>✓ Complete at home</li>
                <li>✓ Professional reports</li>
                <li>✓ Actionable recommendations</li>
                <li>✓ No subscription required</li>
              </ul>
              <span className="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg group-hover:bg-blue-700 transition">
                Get Started as Parent →
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Schools Section - Full Width */}
      <div className="bg-gradient-to-r from-green-600 to-blue-800 text-white py-20 w-full">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="text-6xl mb-6">🏫</div>
          <h2 className="text-4xl font-bold mb-4">Schools & Organizations</h2>
          <p className="text-xl mb-8">Looking for a solution for your whole school?</p>
          
          <div className="bg-white text-gray-900 rounded-lg p-8 shadow-xl max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Custom Solutions Available</h3>
            <ul className="text-left space-y-3 mb-8 text-lg">
              <li>✓ Unlimited screenings for your team</li>
              <li>✓ Shared access for multiple users</li>
              <li>✓ Bulk voucher codes for your school</li>
              <li>✓ Custom training and support</li>
              <li>✓ Flexible pricing based on your needs</li>
            </ul>
            
            <p className="text-gray-700 mb-6">
              We'll work with you to create a package that fits your school's requirements and budget.
            </p>
            
            <a
              href="mailto:contact@solutionsdeveloped.co.uk?subject=School Enquiry - SkillScan&body=Hi, I'm interested in learning more about SkillScan for our organization.%0D%0A%0D%0AOrganization Name:%0D%0AContact Name:%0D%0ANumber of Users:%0D%0APhone Number:%0D%0A%0D%0APlease tell us a bit about your requirements:"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition"
            >
              📧 Contact Us for School Pricing
            </a>
            
            <p className="text-sm text-gray-600 mt-4">
              Email: <a href="mailto:contact@solutionsdeveloped.co.uk" className="text-blue-600 hover:underline font-semibold">contact@solutionsdeveloped.co.uk</a>
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-blue-50 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-700 mb-8">
            Join education professionals across the UK using SkillScan to identify learning difficulties early
          </p>
          <a
            href="/register"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-lg text-2xl shadow-lg transition"
          >
            Create Your Account
          </a>
          <p className="text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline font-semibold">
              Login here
            </a>
          </p>
        </div>
      </div>
        {/* Version label */}
        <div style={{ position: 'fixed', bottom: 8, right: 12, zIndex: 50, color: '#888', fontSize: '1rem', fontWeight: 600, opacity: 0.7 }}>
          v1
        </div>
      </div>
    </div>
  );
}
