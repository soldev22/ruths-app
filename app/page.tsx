"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

    return (
      <>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center">
          <div className="max-w-2xl w-full p-8 bg-white rounded-xl shadow-lg text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to SkillScan</h1>
            <p className="text-lg text-gray-700 mb-8">Professional Dyslexia & Dyscalculia Screening</p>
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
        <div style={{ position: 'fixed', bottom: 8, right: 12, zIndex: 50, color: '#888', fontSize: '1rem', fontWeight: 600, opacity: 0.7 }}>
          v2
        </div>
      </>
    );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center">
        <div className="max-w-2xl w-full p-8 bg-white rounded-xl shadow-lg text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to SkillScan</h1>
          <p className="text-lg text-gray-700 mb-8">Professional Dyslexia & Dyscalculia Screening</p>
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
      <div style={{ position: 'fixed', bottom: 8, right: 12, zIndex: 50, color: '#888', fontSize: '1rem', fontWeight: 600, opacity: 0.7 }}>
        v2
      </div>
    </>
  );
}
