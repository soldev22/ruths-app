"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          // Redirect to dashboard if logged in
          router.push("/protected/dashboard");
        }
      } catch (err) {
        // Do nothing if not logged in
      }
    }
    checkAuth();
  }, [router]);

  // Show landing page - inline to avoid import issues
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to SkillScan
        </h1>
        <p className="text-2xl text-gray-700 mb-8">
          Professionally Designed Dyslexia Screening
        </p>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
          Professional online screening tools designed and verified by qualified education professionals. 
          Identify learning difficulties early and provide guidance.
        </p>

        <div className="flex gap-4 justify-center mb-16">
          <a
            href="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition"
          >
            Get Started
          </a>
          <a
            href="/register"
            className="bg-white hover:bg-gray-50 text-blue-600 font-bold py-4 px-8 rounded-lg text-xl shadow-lg border-2 border-blue-600 transition"
          >
            Login
          </a>
        </div>

        {/* Pay Per Use Info */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-8 max-w-3xl mx-auto mb-16 shadow-2xl">
          <div className="text-center">
            <div className="text-6xl mb-4">💳</div>
            <h2 className="text-3xl font-bold mb-4">
              Simple Pay-As-You-Go Pricing
            </h2>
            <div className="bg-white text-gray-900 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center gap-8 mb-4">
                <div>
                  <div className="text-4xl font-bold text-blue-600">£5</div>
                  <div className="text-sm">per assessment</div>
                </div>
                <div className="text-3xl text-gray-300">or</div>
                <div>
                  <div className="text-4xl font-bold text-blue-600">£40</div>
                  <div className="text-sm">bundle of 10</div>
                </div>
              </div>
              <p className="text-lg text-gray-700 font-semibold">
                ✓ No subscription required
              </p>
              <p className="text-md text-gray-600">
                ✓ Purchase credits as needed
              </p>
              <p className="text-md text-gray-600">
                ✓ AI-powered reports included
              </p>
            </div>
            <a
              href="/register"
              className="inline-block bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-12 rounded-lg text-2xl shadow-lg transition transform hover:scale-105"
            >
              Create Account →
            </a>
            <p className="text-sm text-blue-100 mt-4">
              Already have an account?{" "}
              <a href="/register" className="underline font-semibold hover:text-white">
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Schools Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
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
    </div>
  );
}
