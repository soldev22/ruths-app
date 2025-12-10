"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SubscriptionInfo {
  canScreen: boolean;
  accountType: "individual" | "school";
  subscriptionStatus: string;
  subscriptionTier: string;
  screeningsUsed: number;
  maxScreenings: number;
  prepaidCredits: number;
  trialActive: boolean;
  trialEndDate: string | null;
  screeningsRemaining: string | number;
}

function AccountContent() {
  const [info, setInfo] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    async function handlePaymentReturn() {
      const paymentStatus = searchParams.get("payment");
      const sessionId = searchParams.get("session_id");
      
      if (paymentStatus === "success" && sessionId) {
        try {
          // Verify the payment session and ensure credits are added
          const verifyRes = await fetch("/api/payment/verify-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          });
          
          if (verifyRes.ok) {
            const verifyData = await verifyRes.json();
            console.log("Payment verified:", verifyData);
            alert(`Payment successful! ${verifyData.creditsAdded} credit${verifyData.creditsAdded > 1 ? 's have' : ' has'} been added to your account.`);
          } else {
            alert("Payment successful! Your credits have been added to your account.");
          }
        } catch (error) {
          console.error("Failed to verify payment:", error);
          alert("Payment successful! Please refresh the page if credits don't appear.");
        }
        
        // Remove query parameters
        window.history.replaceState({}, '', '/protected/account');
      }
    }

    async function loadInfo() {
      try {
        // First handle payment return if needed
        await handlePaymentReturn();
        
        // Then load account info with cache busting
        const res = await fetch(`/api/subscription/check-limits?t=${Date.now()}`, {
          cache: 'no-store'
        });
        if (res.ok) {
          const data = await res.json();
          setInfo(data);
        }
      } catch (err) {
        console.error("Failed to load subscription info:", err);
      } finally {
        setLoading(false);
      }
    }
    loadInfo();
  }, [searchParams]);

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
          <p>Loading account information...</p>
        </div>
      </div>
    );
  }

  if (!info) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
          <p className="text-red-600">Failed to load account information</p>
        </div>
      </div>
    );
  }

  const trialDaysRemaining = info.trialEndDate 
    ? Math.ceil((new Date(info.trialEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  const screeningsRemainingLabel =
    info.screeningsRemaining === "unlimited"
      ? "Unlimited"
      : `${info.screeningsRemaining} left`;

  const badgeColor =
    info.screeningsRemaining === "unlimited"
      ? "bg-green-100 text-green-800"
      : (Number(info.screeningsRemaining) ?? 0) <= 5
        ? "bg-red-100 text-red-800"
        : "bg-blue-100 text-blue-800";

  // Individual account display
  if (info.accountType === 'individual') {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-4xl font-bold text-gray-900">Account & Credits</h1>
              <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                Individual Teacher
              </span>
            </div>
          </div>

          {/* Credits Balance */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Assessment Credits</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-700 mb-2">Prepaid Credits</h4>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {info.prepaidCredits}
                </div>
                <p className="text-sm text-gray-600">Available assessments</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-700 mb-2">Total Completed</h4>
                <div className="text-4xl font-bold text-gray-600 mb-2">
                  {info.screeningsUsed}
                </div>
                <p className="text-sm text-gray-600">Assessments performed</p>
              </div>
            </div>
          </div>

          {/* Redeem Voucher */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Redeem Voucher</h2>
            <p className="text-gray-600 mb-4">
              Have a voucher code? Enter it below to add credits to your account.
            </p>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const code = formData.get('voucherCode') as string;
              
              try {
                const res = await fetch('/api/voucher/redeem', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ code })
                });
                
                const data = await res.json();
                
                if (res.ok) {
                  alert(data.message);
                  (e.target as HTMLFormElement).reset();
                  window.location.reload();
                } else {
                  alert(data.error || 'Failed to redeem voucher');
                }
              } catch (error) {
                alert('Failed to redeem voucher');
              }
            }} className="flex gap-2">
              <input
                type="text"
                name="voucherCode"
                placeholder="Enter voucher code"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 uppercase"
                required
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition"
              >
                Redeem
              </button>
            </form>
          </div>

          {/* Purchase Credits */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Purchase Assessment Credits</h2>
            <p className="text-gray-600 mb-6">
              Buy credits to perform dyslexia assessments. Credits never expire.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="border-2 border-gray-300 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">£5</div>
                <div className="text-gray-600 mb-3">1 Assessment</div>
                <button 
                  onClick={() => handlePurchase("single")}
                  disabled={processingPayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {processingPayment ? "Processing..." : "Buy Now"}
                </button>
              </div>

              <div className="border-2 border-green-500 rounded-lg p-4 text-center relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                  SAVE £5
                </div>
                <div className="text-2xl font-bold text-green-600 mb-2">£20</div>
                <div className="text-gray-600 mb-3">5 Assessments</div>
                <button 
                  onClick={() => handlePurchase("bundle5")}
                  disabled={processingPayment}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {processingPayment ? "Processing..." : "Buy Now"}
                </button>
              </div>

              <div className="border-2 border-purple-500 rounded-lg p-4 text-center relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">
                  SAVE £10
                </div>
                <div className="text-2xl font-bold text-purple-600 mb-2">£40</div>
                <div className="text-gray-600 mb-3">10 Assessments</div>
                <button 
                  onClick={() => handlePurchase("bundle10")}
                  disabled={processingPayment}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {processingPayment ? "Processing..." : "Buy Now"}
                </button>
              </div>
            </div>

            <div className="text-center">
              <Link href="/protected/pricing" className="text-blue-600 hover:underline">
                View all pricing options →
              </Link>
            </div>
          </div>

          {/* How Credits Work */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3">How Credits Work</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ Each complete dyslexia review uses 1 credit</li>
              <li>✓ Credits are deducted when you start a new assessment</li>
              <li>✓ Credits never expire - use them whenever you need</li>
              <li>✓ Buy bundles to save money on multiple assessments</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // School account display (original code continues below)
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-4xl font-bold text-gray-900">Account & Subscription</h1>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${badgeColor}`}>
              {screeningsRemainingLabel}
            </span>
          </div>
        </div>

      {/* Current Plan Status */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Current Plan</h2>
        
        {info.subscriptionStatus === 'active' && (
          <div className="bg-green-50 border-2 border-green-400 rounded-lg p-4 mb-4">
            <h3 className="font-bold text-lg mb-2">✓ Active Subscription</h3>
            <p className="text-gray-700">
              Plan: <strong className="capitalize">{info.subscriptionTier}</strong>
            </p>
          </div>
        )}

        {info.subscriptionStatus === 'expired' && (
          <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4 mb-4">
            <h3 className="font-bold text-lg mb-2">⚠️ Subscription Expired</h3>
            <p className="text-gray-700">Please upgrade to continue using SkillScan</p>
          </div>
        )}

        {/* Usage Stats */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-700 mb-2">Screenings Used</h4>
            <div className="text-3xl font-bold text-blue-600">
              {info.screeningsUsed}
            </div>
            {info.subscriptionStatus === 'trial' && (
              <p className="text-sm text-gray-600 mt-1">of {info.maxScreenings} trial screenings</p>
            )}
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-700 mb-2">Reviews Remaining</h4>
              <div className="text-3xl font-bold text-green-600">
                {info.screeningsRemaining === 'unlimited' ? '∞' : info.screeningsRemaining}
              </div>
              {info.subscriptionStatus === 'active' && (
                <p className="text-sm text-gray-600 mt-1">unlimited reviews</p>
              )}
          </div>
        </div>
      </div>

      {/* Upgrade Options */}
      {info.subscriptionStatus !== 'active' && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Upgrade Your Plan</h2>
          <p className="text-gray-600 mb-6">
            Get unlimited reviews and premium features with a subscription
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="border-2 border-gray-300 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-2">Starter</h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">£9.99</div>
              <p className="text-sm text-gray-600 mb-3">per month</p>
              <ul className="text-sm space-y-2 mb-4">
                <li>✓ 5 teachers</li>
                <li>✓ Unlimited reviews</li>
                <li>✓ AI reports</li>
                <li>✓ Email support</li>
              </ul>
            </div>

            <div className="border-2 border-green-500 bg-green-50 rounded-lg p-4 relative">
              <div className="absolute -top-3 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                POPULAR
              </div>
              <h3 className="text-lg font-bold mb-2">Professional</h3>
              <div className="text-3xl font-bold text-green-600 mb-2">£35.99</div>
              <p className="text-sm text-gray-600 mb-3">per month</p>
              <ul className="text-sm space-y-2 mb-4">
                <li>✓ 25 teachers</li>
                <li>✓ Priority support</li>
                <li>✓ Training webinars</li>
                <li>✓ Account manager</li>
              </ul>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-2">School</h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">£73.99</div>
              <p className="text-sm text-gray-600 mb-3">per month</p>
              <ul className="text-sm space-y-2 mb-4">
                <li>✓ 50 teachers</li>
                <li>✓ Phone support</li>
                <li>✓ On-site training</li>
                <li>✓ Data analytics</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/protected/pricing"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg"
            >
              Contact Us to Upgrade
            </Link>
            <p className="text-sm text-gray-600 mt-3">
              Annual plans available - save 2 months!
            </p>
          </div>
        </div>
      )}

      {/* Active Subscription Management */}
      {info.subscriptionStatus === 'active' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Manage Subscription</h2>
          <p className="text-gray-600 mb-4">
            Need to change your plan or cancel? Contact us for assistance.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Contact Support
          </Link>
        </div>
      )}

      {/* Back to Dashboard */}
      <div className="mt-6">
        <Link href="/protected/dashboard" className="text-blue-600 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 p-8"><div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">Loading...</div></div>}>
      <AccountContent />
    </Suspense>
  );
}
