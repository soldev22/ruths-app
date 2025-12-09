"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PricingPage() {
  const [accountType, setAccountType] = useState<"individual" | "school" | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setAccountType(data.user?.accountType || "individual");
        }
      } catch (err) {
        console.error("Failed to load user:", err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const handlePurchase = async (bundleType: string) => {
    setProcessingPayment(true);
    try {
      const res = await fetch("/api/payment/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bundleType }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        alert(data.error || "Failed to create checkout session");
        setProcessingPayment(false);
        return;
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to process payment");
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            {accountType === "individual" ? "Purchase Assessments" : "Subscription Plans"}
          </h1>
        </div>

        {accountType === "individual" ? (
          /* Individual Teacher Pricing */
          <div className="max-w-2xl mx-auto">
            <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-3 text-blue-900">Pay Per Assessment</h2>
              <p className="text-gray-700 mb-4">
                As an individual teacher, you pay only for the assessments you use.
              </p>
              <div className="text-5xl font-bold text-blue-600 mb-2">£5</div>
              <div className="text-gray-600 mb-6">per dyslexia review</div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Single Assessment */}
              <div className="bg-white border-2 border-gray-300 rounded-lg p-6 hover:shadow-md transition">
                <h3 className="text-xl font-bold mb-2">Single Assessment</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">£5</div>
                <div className="text-gray-600 mb-4">one-time payment</div>
                <ul className="text-sm space-y-2 mb-6">
                  <li>✓ 1 complete dyslexia review</li>
                  <li>✓ AI-generated report</li>
                  <li>✓ Word export</li>
                  <li>✓ GDPR compliant</li>
                </ul>
                <button 
                  onClick={() => handlePurchase("single")}
                  disabled={processingPayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {processingPayment ? "Processing..." : "Purchase Now"}
                </button>
              </div>

              {/* Bundle of 5 */}
              <div className="bg-white border-2 border-green-500 rounded-lg p-6 hover:shadow-md transition relative">
                <div className="absolute -top-3 right-4 bg-green-500 text-white font-bold px-3 py-1 rounded-full text-sm">
                  SAVE £5
                </div>
                <h3 className="text-xl font-bold mb-2">Bundle of 5</h3>
                <div className="text-4xl font-bold text-green-600 mb-2">£20</div>
                <div className="text-gray-600 mb-4">
                  <span className="line-through text-gray-400">£25</span> Save £5
                </div>
                <ul className="text-sm space-y-2 mb-6">
                  <li>✓ 5 complete dyslexia reviews</li>
                  <li>✓ AI-generated reports</li>
                  <li>✓ Word export</li>
                  <li>✓ GDPR compliant</li>
                  <li>✓ Credits never expire</li>
                </ul>
                <button 
                  onClick={() => handlePurchase("bundle5")}
                  disabled={processingPayment}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {processingPayment ? "Processing..." : "Purchase Bundle"}
                </button>
              </div>

              {/* Bundle of 10 */}
              <div className="bg-white border-2 border-purple-500 rounded-lg p-6 hover:shadow-md transition relative md:col-span-2">
                <div className="absolute -top-3 right-4 bg-purple-500 text-white font-bold px-3 py-1 rounded-full text-sm">
                  SAVE £10
                </div>
                <div className="md:flex md:items-center md:justify-between">
                  <div className="md:flex-1">
                    <h3 className="text-xl font-bold mb-2">Bundle of 10</h3>
                    <div className="text-4xl font-bold text-purple-600 mb-2">£40</div>
                    <div className="text-gray-600 mb-4">
                      <span className="line-through text-gray-400">£50</span> Save £10
                    </div>
                  </div>
                  <div className="md:flex-1">
                    <ul className="text-sm space-y-2 mb-6">
                      <li>✓ 10 complete dyslexia reviews</li>
                      <li>✓ AI-generated reports</li>
                      <li>✓ Word export</li>
                      <li>✓ GDPR compliant</li>
                      <li>✓ Credits never expire</li>
                      <li>✓ Priority email support</li>
                    </ul>
                  </div>
                  <div className="md:ml-6">
                    <button 
                      onClick={() => handlePurchase("bundle10")}
                      disabled={processingPayment}
                      className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition whitespace-nowrap disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {processingPayment ? "Processing..." : "Purchase Bundle"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-lg font-semibold mb-3">How It Works</h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li><strong>1.</strong> Purchase assessment credits using the buttons above</li>
                <li><strong>2.</strong> Credits are added to your account immediately</li>
                <li><strong>3.</strong> Each time you complete a review, one credit is used</li>
                <li><strong>4.</strong> Credits never expire - use them whenever you need</li>
              </ol>
            </div>
          </div>
        ) : (
          /* School Subscription Plans */
          <>
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
        </>
        )}

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
