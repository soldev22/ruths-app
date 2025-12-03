"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditQuestionPage({ params }: { params: any }) {
  const router = useRouter();

  // ✅ Unwrap the params Promise
 const { id } = React.use<{ id: string }>(params);

  const [loading, setLoading] = useState(true);
  const [loadingSections, setLoadingSections] = useState(true);

  const [sections, setSections] = useState<string[]>([]);

  const [screeningType, setScreeningType] = useState("");
  const [readingYear, setReadingYear] = useState<any>("");
  const [section, setSection] = useState("");
  const [manualSection, setManualSection] = useState("");

  const [text, setText] = useState("");
  const [options, setOptions] = useState("");
  const [order, setOrder] = useState("");

  // Load existing question
  useEffect(() => {
    async function loadQuestion() {
      try {
        const res = await fetch(`/api/questions/${id}`);
        const data = await res.json();

        setScreeningType(data.screeningType || "");
        setReadingYear(data.readingYear ?? "");
        setSection(data.section || "");
        setText(data.text || "");
        setOptions(data.options?.join(", ") || "");
        setOrder(data.order?.toString() || "");
      } catch (e) {
        console.error("Failed to load question:", e);
      }

      setLoading(false);
    }

    if (id) loadQuestion();
  }, [id]);

  // Load sections list
  useEffect(() => {
    async function loadSections() {
      try {
        const res = await fetch("/api/questions/sections");
        const data = await res.json();
        setSections(data);
      } catch (e) {
        console.error("Failed to load sections:", e);
      }

      setLoadingSections(false);
    }

    loadSections();
  }, []);

  async function handleSubmit(e: any) {
    e.preventDefault();

    const finalSection =
      section === "__manual__" || sections.length === 0
        ? manualSection
        : section;

    const payload = {
      screeningType,
      readingYear: readingYear ? Number(readingYear) : null,
      section: finalSection,
      text,
      options: options
        ? options.split(",").map((o) => o.trim()).filter(Boolean)
        : [],
      order: order ? Number(order) : 0,
    };

    const res = await fetch(`/api/questions/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/questions");
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "30px", textAlign: "center" }}>
        Loading question…
      </div>
    );
  }

  return (
    <div style={{ padding: "30px", maxWidth: "800px", margin: "0 auto" }}>
      <h1
        style={{
          fontSize: "38px",
          fontWeight: "900",
          color: "#0066cc",
          marginBottom: "25px",
        }}
      >
        Edit Question
      </h1>

      <div
        style={{
          background: "#f5f5f5",
          padding: "25px",
          borderRadius: "10px",
          border: "1px solid #ddd",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          {/* Screener Type */}
          <div>
            <label style={{ fontWeight: "bold" }}>Screener Type</label>
            <br />
            <select
              value={screeningType}
              onChange={(e) => setScreeningType(e.target.value)}
              required
              style={{
                marginTop: "8px",
                padding: "10px",
                width: "100%",
                borderRadius: "6px",
                border: "1px solid #aaa",
              }}
            >
              <option value="">Select...</option>
              <option value="dyslexia">Dyslexia</option>
              <option value="dyscalculia">Dyscalculia</option>
              <option value="reading">Reading</option>
            </select>
          </div>

          {/* Reading Year */}
          <div>
            <label style={{ fontWeight: "bold" }}>Reading Year</label>
            <br />
            <select
              value={readingYear}
              onChange={(e) => setReadingYear(e.target.value)}
              style={{
                marginTop: "8px",
                padding: "10px",
                width: "100%",
                borderRadius: "6px",
                border: "1px solid #aaa",
              }}
            >
              <option value="">Not Applicable</option>
              <option value="6">Year 6</option>
              <option value="7">Year 7</option>
              <option value="8">Year 8</option>
              <option value="9">Year 9</option>
              <option value="10">Year 10</option>
              <option value="11">Year 11</option>
            </select>
          </div>

          {/* Section */}
          <div>
            <label style={{ fontWeight: "bold" }}>Section</label>
            <br />

            {loadingSections ? (
              <p style={{ marginTop: "8px" }}>Loading sections…</p>
            ) : sections.length > 0 ? (
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                style={{
                  marginTop: "8px",
                  padding: "10px",
                  width: "100%",
                  borderRadius: "6px",
                  border: "1px solid #aaa",
                }}
              >
                <option value="">Select...</option>
                {sections.map((s, i) => (
                  <option key={i} value={s}>
                    {s}
                  </option>
                ))}
                <option value="__manual__">Add New Section…</option>
              </select>
            ) : (
              <p>No sections found — enter a new one.</p>
            )}

            {(section === "__manual__" || sections.length === 0) && (
              <input
                type="text"
                value={manualSection}
                onChange={(e) => setManualSection(e.target.value)}
                placeholder="Enter new section name"
                required
                style={{
                  marginTop: "10px",
                  padding: "10px",
                  width: "100%",
                  borderRadius: "6px",
                  border: "1px solid #aaa",
                }}
              />
            )}
          </div>

          {/* Question Text */}
          <div>
            <label style={{ fontWeight: "bold" }}>Question Text</label>
            <br />
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              rows={4}
              style={{
                marginTop: "8px",
                padding: "10px",
                width: "100%",
                borderRadius: "6px",
                border: "1px solid #aaa",
              }}
            />
          </div>

          {/* Options */}
          <div>
            <label style={{ fontWeight: "bold" }}>Options</label>
            <br />
            <input
              type="text"
              value={options}
              onChange={(e) => setOptions(e.target.value)}
              placeholder="Yes, No, Sometimes"
              style={{
                marginTop: "8px",
                padding: "10px",
                width: "100%",
                borderRadius: "6px",
                border: "1px solid #aaa",
              }}
            />
          </div>

          {/* Order */}
          <div>
            <label style={{ fontWeight: "bold" }}>Order</label>
            <br />
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              style={{
                marginTop: "8px",
                padding: "10px",
                width: "100%",
                borderRadius: "6px",
                border: "1px solid #aaa",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              marginTop: "10px",
              background: "#0066cc",
              color: "white",
              padding: "12px 20px",
              borderRadius: "6px",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
