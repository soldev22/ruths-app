"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

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
          const verifyRes = await fetch("/api/payment/verify-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          });
          if (verifyRes.ok) {
            const verifyData = await verifyRes.json();
            alert(`Payment successful! ${verifyData.creditsAdded} credit${verifyData.creditsAdded > 1 ? 's have' : ' has'} been added to your account.`);
          } else {
            alert("Payment successful! Your credits have been added to your account.");
          }
        } catch {
          alert("Payment successful! Please refresh the page if credits don't appear.");
        }
        window.history.replaceState({}, '', '/protected/account');
      }
    }
    async function loadInfo() {
      try {
        await handlePaymentReturn();
        const res = await fetch(`/api/subscription/check-limits?t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setInfo(data);
        }
      } catch {
        // Failed to load subscription info
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
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("Failed to process payment");
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-background">
        <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
          <p>Loading account information...</p>
        </div>
      </div>
    );
  }
  if (!info) {
    return (
      <div className="w-full min-h-screen bg-surface-alt">
        <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
          <p className="text-error">Failed to load account information</p>
        </div>
      </div>
    );
  }

  if (info.accountType === 'individual') {
    return (
      <div className="w-full min-h-screen bg-surface-alt">
        <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
          <div className="rounded-2xl shadow-sm p-6 mb-8 bg-surface">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-4xl font-livvic-bold text-primary">Account and credits</h1>
              <span className="px-3 py-1 text-sm font-livvic-medium rounded-full bg-secondary text-on-secondary">
                Individual teacher
              </span>
            </div>
          </div>
          {/* Credits Balance */}
          <div className="rounded-lg shadow-md p-6 mb-6 bg-surface">
            <h2 className="text-2xl font-livvic-bold mb-4 text-primary">Assessment credits</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-lg p-6 bg-secondary-light">
                <h4 className="font-livvic-medium mb-2 text-secondary">Prepaid credits</h4>
                <div className="text-4xl font-livvic-bold mb-2 text-accent">{info.prepaidCredits}</div>
                <p className="text-sm text-tertiary">Available assessments</p>
              </div>
              <div className="rounded-lg p-6 bg-background-alt">
                <h4 className="font-livvic-medium mb-2 text-secondary">Total completed</h4>
                <div className="text-4xl font-livvic-bold mb-2 text-tertiary">{info.screeningsUsed}</div>
                <p className="text-sm text-tertiary">Assessments performed</p>
              </div>
            </div>
          </div>
          {/* Redeem Voucher */}
          <div className="rounded-lg shadow-md p-6 mb-6 bg-surface">
            <h2 className="text-2xl font-livvic-bold mb-4 text-primary">Redeem voucher</h2>
            <p className="mb-4 text-tertiary">
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
              } catch {
                alert('Failed to redeem voucher');
              }
            }} className="flex gap-2">
              <input
                type="text"
                name="voucherCode"
                placeholder="Enter voucher code"
                className="flex-1 font-livvic border rounded-lg px-4 py-2 uppercase border-border bg-background-alt text-primary"
                required
              />
              <button
                type="submit"
                className="font-livvic-bold py-2 px-6 rounded-lg transition bg-success text-on-success"
              >
                Redeem
              </button>
            </form>
          </div>
          {/* Purchase Credits */}
          <div className="rounded-lg shadow-md p-6 mb-6 bg-surface">
            <h2 className="text-2xl font-livvic-bold mb-4 text-primary">Purchase assessment credits</h2>
            <p className="mb-6 text-tertiary">
              Buy credits to perform dyslexia assessments. Credits never expire.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {/* Single credit */}
              <div className="border-2 rounded-lg p-4 text-center border-border bg-background-alt">
                <div className="text-2xl font-livvic-bold mb-2 text-accent">£5</div>
                <div className="mb-3 text-tertiary">1 Assessment</div>
                <button
                  onClick={() => handlePurchase("single")}
                  disabled={processingPayment}
                  className="w-full font-livvic-bold py-2 px-4 rounded transition bg-primary text-on-primary disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {processingPayment ? "Processing..." : "Buy now"}
                </button>
              </div>
              {/* 5 credit bundle */}
              <div className="border-2 rounded-lg p-4 text-center relative border-success bg-background-alt">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 font-livvic-bold px-2 py-1 rounded bg-success text-on-success text-xs">
                  SAVE £5
                </div>
                <div className="text-2xl font-livvic-bold mb-2 text-success">£20</div>
                <div className="mb-3 text-tertiary">5 Assessments</div>
                <button
                  onClick={() => handlePurchase("bundle5")}
                  disabled={processingPayment}
                  className="w-full font-livvic-bold py-2 px-4 rounded transition bg-success text-on-success disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {processingPayment ? "Processing..." : "Buy now"}
                </button>
              </div>
              {/* 10 credit bundle */}
              <div className="border-2 rounded-lg p-4 text-center relative border-accent-alt bg-background-alt">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 font-livvic-bold px-2 py-1 rounded bg-accent-alt text-on-accent-alt text-xs">
                  SAVE £10
                </div>
                <div className="text-2xl font-livvic-bold mb-2 text-accent-alt">£40</div>
                <div className="mb-3 text-tertiary">10 Assessments</div>
                <button
                  onClick={() => handlePurchase("bundle10")}
                  disabled={processingPayment}
                  className="w-full font-livvic-bold py-2 px-4 rounded transition bg-accent-alt text-on-accent-alt disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {processingPayment ? "Processing..." : "Buy now"}
                </button>
              </div>
            </div>
            <div className="text-center">
              <Link href="/protected/pricing" className="font-livvic text-primary">
                View all pricing options →
              </Link>
            </div>
          </div>
          {/* How Credits Work */}
          <div className="rounded-lg p-6 bg-info-light border-l-4 border-info">
            <h3 className="font-livvic-bold text-lg mb-3 text-primary">How credits work</h3>
            <ul className="space-y-2 text-sm text-secondary">
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

  // School account display (placeholder)
  return (
    <div className="w-full min-h-screen bg-surface-alt flex items-center justify-center">
      <div className="text-center p-10 bg-surface rounded-lg shadow">
        <h1 className="text-3xl font-livvic-bold mb-4">School Account</h1>
        <p className="text-lg text-tertiary">School account management coming soon.</p>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen p-8 bg-background"><div className="max-w-4xl mx-auto p-8 rounded-lg shadow bg-surface">Loading...</div></div>}>
      <AccountContent />
    </Suspense>
  );
}
