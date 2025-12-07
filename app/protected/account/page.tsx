"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SubscriptionInfo {
  canScreen: boolean;
  subscriptionStatus: string;
  subscriptionTier: string;
  screeningsUsed: number;
  maxScreenings: number;
  trialActive: boolean;
  trialEndDate: string | null;
  screeningsRemaining: string | number;
}

export default function AccountPage() {
  const [info, setInfo] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInfo() {
      try {
        const res = await fetch("/api/subscription/check-limits");
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
  }, []);

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
        
        {info.subscriptionStatus === 'trial' && (
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 mb-4">
            <h3 className="font-bold text-lg mb-2">🎉 Free Trial Active</h3>
            <p className="text-gray-700">
              <strong>{trialDaysRemaining}</strong> days remaining
            </p>
            {info.trialEndDate && (
              <p className="text-sm text-gray-600">
                Trial ends: {new Date(info.trialEndDate).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

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
