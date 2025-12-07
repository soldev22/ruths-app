"use client";

import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Subscription Plans</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Starter Plan */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-8 shadow-sm hover:shadow-md transition">
            <h3 className="text-2xl font-bold mb-2">Starter</h3>
            <p className="text-sm text-gray-600 mb-4">Perfect for small schools</p>
            <div className="text-5xl font-bold mb-2 text-blue-600">£9.99</div>
            <div className="text-gray-600 mb-6">per month</div>
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="text-3xl font-bold text-blue-600">5</div>
              <div className="text-sm text-gray-700">teachers</div>
            </div>
            <ul className="text-left space-y-3 mb-8 text-sm">
              <li>✓ Unlimited reviews</li>
              <li>✓ AI-generated reports</li>
              <li>✓ Word export</li>
              <li>✓ GDPR compliant</li>
              <li>✓ Email support</li>
            </ul>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg mb-4 transition">
              Get Started
            </button>
            <div className="text-sm text-gray-600 pt-4 border-t">
              Annual: <strong>£99.90/year</strong> (save 2 months)
            </div>
          </div>

          {/* Professional Plan */}
          <div className="bg-white border-2 border-green-500 rounded-lg p-8 shadow-sm hover:shadow-md transition relative transform md:scale-105">
            <div className="absolute -top-4 right-4 bg-green-500 text-white font-bold px-4 py-1 rounded-full text-sm">
              POPULAR
            </div>
            <h3 className="text-2xl font-bold mb-2">Professional</h3>
            <p className="text-sm text-gray-600 mb-4">Most schools choose this</p>
            <div className="text-5xl font-bold mb-2 text-green-600">£35.99</div>
            <div className="text-gray-600 mb-6">per month</div>
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <div className="text-3xl font-bold text-green-600">25</div>
              <div className="text-sm text-gray-700">teachers</div>
            </div>
            <ul className="text-left space-y-3 mb-8 text-sm">
              <li>✓ Everything in Starter</li>
              <li>✓ Priority support</li>
              <li>✓ Training webinars</li>
              <li>✓ Dedicated account manager</li>
              <li>✓ Custom reports</li>
            </ul>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg mb-4 transition">
              Get Started
            </button>
            <div className="text-sm text-gray-600 pt-4 border-t">
              Annual: <strong>£359.90/year</strong> (save 2 months)
            </div>
          </div>

          {/* School Plan */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-8 shadow-sm hover:shadow-md transition">
            <h3 className="text-2xl font-bold mb-2">School</h3>
            <p className="text-sm text-gray-600 mb-4">For larger schools</p>
            <div className="text-5xl font-bold mb-2 text-blue-600">£73.99</div>
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
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg mb-4 transition">
              Get Started
            </button>
            <div className="text-sm text-gray-600 pt-4 border-t">
              Annual: <strong>£739.90/year</strong> (save 2 months)
            </div>
          </div>
        </div>

        {/* Custom Plans */}
        <div className="bg-white rounded-lg shadow-sm p-8 text-center mb-8">
          <h2 className="text-2xl font-bold mb-3">Need more than 50 teachers?</h2>
          <p className="text-gray-600 mb-6">
            Contact us for district-wide pricing and custom solutions
          </p>
          <Link
            href="/contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            Request Quote
          </Link>
        </div>

        {/* Back to Account */}
        <div>
          <Link href="/protected/account" className="text-blue-600 hover:underline">
            ← Back to Account & Subscription
          </Link>
        </div>
      </div>
    </div>
  );
}
