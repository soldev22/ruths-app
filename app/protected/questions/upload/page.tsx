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
    <div
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <h1 style={{ marginBottom: "1rem" }}>Upload Question Set (JSON)</h1>

      <p style={{ marginBottom: "1rem" }}>
        Upload a <strong>.json</strong> file containing your questions. A preview
        will appear below so you can confirm everything before importing.
      </p>

      <input
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        style={{ marginBottom: "1rem" }}
      />

      {error && (
        <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>
      )}

      {success && (
        <p style={{ color: "green", marginBottom: "1rem" }}>{success}</p>
      )}

      {jsonPreview && (
        <div
          style={{
            border: "1px solid #444",
            borderRadius: "8px",
            padding: "1rem",
            background: "#fafafa",
            marginBottom: "1.5rem",
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          <pre>{JSON.stringify(jsonPreview, null, 2)}</pre>
        </div>
      )}

      {jsonPreview && (
        <button
          onClick={handleSubmit}
          disabled={uploading}
          style={{
            padding: "0.8rem 1.4rem",
            background: "black",
            color: "white",
            borderRadius: "6px",
            width: "100%",
          }}
        >
          {uploading ? "Uploading…" : "Import Questions"}
        </button>
      )}
    </div>
  );
}
