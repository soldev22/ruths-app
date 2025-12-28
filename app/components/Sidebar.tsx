"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setIsAdmin(data.user?.isAdmin || false);
        }
      } catch (err) {
        console.error("Error checking admin status:", err);
      }
    }
    checkAdmin();
  }, []);

  return (
    <div
      className={`transition-all duration-200 bg-blue-900 text-white min-h-screen border-r border-gray-200 ${open ? 'w-60 p-3' : 'w-10 p-1'}`}
    >
      {/* TOGGLE BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="block mb-5 bg-none border-none cursor-pointer font-bold text-white focus:outline-none"
      >
        {open ? "◀ Hide" : "▶"}
      </button>

      {/* MAIN NAV */}
      {open && (
        <>
          <div className="mb-5">
            <Link 
              href="/protected/case/new" 
              className="inline-block w-full bg-blue-600 text-white no-underline rounded-lg font-semibold mb-3 py-2 text-center hover:bg-blue-700 transition"
            >
              ➕ New Assessment
            </Link>
            <br />
            <Link href="/protected/dashboard" className="text-white no-underline hover:underline">Dashboard</Link>
            <br />
            <Link href="/protected/account" className="text-white no-underline hover:underline">Account & Billing</Link>
            <br />
            <Link href="/protected/pricing" className="text-white no-underline hover:underline">View Plans & Pricing</Link>
            <br />
            <Link href="/user-guide" className="text-white no-underline hover:underline">User Guide</Link>
            <br />
            <Link href="/about" className="text-white no-underline hover:underline">About</Link>
            <br />
            <Link href="/faq" className="text-white no-underline hover:underline">FAQ</Link>
            <br />
            <Link href="/scoring-guide" className="text-white no-underline hover:underline">Scoring Guide</Link>
            <br />
            <Link href="/privacy" className="text-white no-underline hover:underline">Privacy & GDPR</Link>
            <br />
            <Link href="/contact" className="text-white no-underline hover:underline">Contact Us</Link>
            <br />
          </div>

          {/* ADMIN - Only visible to admin users */}
          {isAdmin && (
            <>
              <div className="text-xs text-blue-200 mt-6 mb-2">ADMIN</div>

              <div>
                <Link href="/admin/activity-logs" style={{ color: "white", textDecoration: "none" }}>Activity Logs</Link>
                <br />
                <Link href="/admin/vouchers" style={{ color: "white", textDecoration: "none" }}>Vouchers</Link>
                <br />
                
              </div>

              
                  <div>{/* Social Media links removed */}</div>
                <br />
            
            </>
          )}
        </>
      )}
    </div>
  );
}
