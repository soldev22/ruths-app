"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function StartInner() {
  const params = useSearchParams();
  const router = useRouter();
  const caseId = params.get("caseId");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [limitInfo, setLimitInfo] = useState<any>(null);

  useEffect(() => {
    // Check limits on page load
    async function checkLimits() {
      try {
        const res = await fetch("/api/subscription/check-limits");
        if (res.ok) {
          const data = await res.json();
          setLimitInfo(data);
          if (!data.canScreen) {
            setError(data.message || "Screening limit reached");
          }
        }
      } catch (err) {
        console.error("Failed to check limits:", err);
      }
    }
    checkLimits();
  }, []);

  async function handleStart() {
    if (!caseId) {
      setError("No case ID provided");
      return;
    }

    if (limitInfo && !limitInfo.canScreen) {
      setError(limitInfo.message || "Screening limit reached");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/screening/dyslexia/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ caseId }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.needsUpgrade) {
          setError(data.message);
          setLimitInfo({
            canScreen: false,
            screeningsUsed: data.screeningsUsed,
            maxScreenings: data.maxScreenings,
          });
          return;
        }

        setError(data.error || "Failed to start screening");
        return;
      }

      // Success - navigate to wizard and signal start already counted
      router.push(`/screening/dyslexia/start/${caseId}?started=1`);
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  if (limitInfo && !limitInfo.canScreen) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-red-50 border-2 border-red-400 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-red-900 mb-4">⚠️ Review Limit Reached</h2>
          <p className="text-red-800 mb-4">
            {limitInfo.trialActive 
              ? `You've used ${limitInfo.screeningsUsed} of ${limitInfo.maxScreenings} trial reviews.`
              : "Your trial has ended."}
          </p>
          <p className="text-red-700 mb-6">
            Upgrade to continue with unlimited reviews.
          </p>
        </div>

        <div className="bg-white border-2 border-blue-600 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Choose Your Plan</h3>
          <div className="space-y-4">
            <div className="border rounded p-4">
              <h4 className="font-semibold">Starter - £9.99/month</h4>
              <p className="text-sm text-gray-600">5 teachers, unlimited screenings</p>
            </div>
            <div className="border rounded p-4 bg-green-50">
              <h4 className="font-semibold">Professional - £35.99/month</h4>
              <p className="text-sm text-gray-600">25 teachers, priority support</p>
            </div>
            <div className="border rounded p-4">
              <h4 className="font-semibold">School - £73.99/month</h4>
              <p className="text-sm text-gray-600">50 teachers, dedicated account manager</p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <Link
            href="/contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg"
          >
            Contact Us to Upgrade
          </Link>
          <div>
            <Link href="/protected/dashboard" className="text-blue-600 hover:underline">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Start Dyslexia Review</h1>
      <p className="text-gray-600 mb-6">Case ID: <strong>{caseId}</strong></p>

      {limitInfo && (
        <div className="bg-blue-50 border border-blue-400 rounded-lg p-4 mb-6">
          <p className="text-sm">
            {limitInfo.subscriptionStatus === 'active' 
              ? '✓ Unlimited reviews available'
              : `📊 Reviews remaining: ${limitInfo.screeningsRemaining} of ${limitInfo.maxScreenings}`}
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-400 rounded-lg p-4 mb-6 text-red-800">
          {error}
        </div>
      )}

      <button
        onClick={handleStart}
        disabled={loading || (limitInfo && !limitInfo.canScreen)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? "Starting..." : "Begin Screening"}
      </button>
    </div>
  );
}
