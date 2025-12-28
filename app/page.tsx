"use client";

// ...existing code...

export default function Home() {
// ...existing code...

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
        <div className="fixed bottom-2 right-3 z-50 text-gray-500 text-base font-semibold opacity-70">
          v4
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
      <div className="fixed bottom-2 right-3 z-50 text-gray-500 text-base font-semibold opacity-70">
        v4
      </div>
    </>
  );
}
