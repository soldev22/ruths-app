"use client";

import { useState } from "react";

export default function UploadQuestionsPage() {
  const [jsonPreview, setJsonPreview] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    setSuccess(null);

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (!Array.isArray(parsed)) {
          setError("The uploaded JSON must contain an array of questions.");
          return;
        }

        setJsonPreview(parsed);
      } catch (err: any) {
        setError("Invalid JSON file. Please check your formatting.");
      }
    };

    reader.readAsText(file);
  }

  async function handleSubmit() {
    if (!jsonPreview) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/questions/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonPreview),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed. Please try again.");
        return;
      }

      setSuccess(`Successfully uploaded ${data.count} questions.`);
      setJsonPreview(null);
    } catch (err: any) {
      setError("Error uploading questions. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Upload Question Set (JSON)</h1>
        </div>

        <p className="mb-6">
          Upload a <strong>.json</strong> file containing your questions. A preview
          will appear below so you can confirm everything before importing.
        </p>

        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="mb-6 block"
        />

        {error && (
          <p className="text-red-600 mb-6">{error}</p>
        )}

        {success && (
          <p className="text-green-600 mb-6">{success}</p>
        )}

        {jsonPreview && (
          <div
            className="border border-gray-300 rounded-lg p-4 bg-gray-100 mb-6 max-h-80 overflow-y-auto"
          >
            <pre className="text-sm">{JSON.stringify(jsonPreview, null, 2)}</pre>
          </div>
        )}

        {jsonPreview && (
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading…" : "Import Questions"}
          </button>
        )}
      </div>
    </div>
  );
}
