"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function QuestionsListInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL
  const screeningType = searchParams.get("screeningType") || "";
  const readingYearFilter = searchParams.get("readingYear") || "";

  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);

  const [detectedYear, setDetectedYear] = useState<string | null>(null);

  // Filter dropdown state
  const [typeSelect, setTypeSelect] = useState(screeningType);
  const [yearSelect, setYearSelect] = useState(readingYearFilter);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Collapsible card state
  const [openCard, setOpenCard] = useState<string | null>(null);

  // Load questions
  useEffect(() => {
    async function load() {
      const query = [];

      if (screeningType) query.push(`screeningType=${screeningType}`);
      if (readingYearFilter) query.push(`readingYear=${readingYearFilter}`);

      const q = query.length ? "?" + query.join("&") : "";

      const res = await fetch(`/api/questions${q}`);
      const data = await res.json();
      setQuestions(data);
      setFilteredQuestions(data);

      // Detect years
      const years = [
        ...new Set(
          data
            .map((q: any) => q.readingYear)
            .filter((y: number | null | undefined): y is number =>
              y !== null && y !== undefined
            )
        ),
      ];

      if (readingYearFilter) {
        setDetectedYear(readingYearFilter);
      } else if (years.length === 1) {
        setDetectedYear(String(years[0]));
      } else if (years.length > 1) {
        setDetectedYear("Multiple Years");
      } else {
        setDetectedYear(null);
      }
    }

    load();
  }, [screeningType, readingYearFilter]);

  // Live search
  useEffect(() => {
    const term = searchTerm.toLowerCase();

    if (!term) {
      setFilteredQuestions(questions);
      return;
    }

    const results = questions.filter((q: any) => {
      const t = term;
      return (
        q.text.toLowerCase().includes(t) ||
        q.section?.toString().toLowerCase().includes(t) ||
        q.screeningType.toLowerCase().includes(t) ||
        (q.readingYear && q.readingYear.toString().includes(t)) ||
        q.options.some((o: string) => o.toLowerCase().includes(t))
      );
    });

    setFilteredQuestions(results);
  }, [searchTerm, questions]);

  function applyFilters() {
    const params = new URLSearchParams();

    if (typeSelect) params.set("screeningType", typeSelect);
    if (yearSelect) params.set("readingYear", yearSelect);

    router.push(`/admin/questions?${params.toString()}`);
  }

  function clearFilters() {
    setTypeSelect("");
    setYearSelect("");
    setSearchTerm("");
    router.push(`/admin/questions`);
  }

  function toggleCard(id: string) {
    setOpenCard((prev) => (prev === id ? null : id));
  }

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
      {/* FILTER BAR */}
      <div
        style={{
          marginBottom: "25px",
          padding: "15px",
          borderRadius: "8px",
          background: "#eef6ff",
          border: "1px solid #cfe2ff",
        }}
      >
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          {/* Screener Type */}
          <div>
            <label style={{ fontWeight: "bold" }}>Screener Type</label>
            <br />
            <select
              value={typeSelect}
              onChange={(e) => setTypeSelect(e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #aaa",
                marginTop: "5px",
              }}
            >
              <option value="">All</option>
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
              value={yearSelect}
              onChange={(e) => setYearSelect(e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #aaa",
                marginTop: "5px",
              }}
            >
              <option value="">All</option>
              <option value="6">Year 6</option>
              <option value="7">Year 7</option>
              <option value="8">Year 8</option>
              <option value="9">Year 9</option>
              <option value="10">Year 10</option>
              <option value="11">Year 11</option>
            </select>
          </div>

          {/* Buttons */}
          <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
            <button
              onClick={applyFilters}
              style={{
                background: "#0066cc",
                color: "white",
                padding: "10px 15px",
                borderRadius: "4px",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Apply
            </button>

            <button
              onClick={clearFilters}
              style={{
                background: "#999",
                color: "white",
                padding: "10px 15px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div style={{ marginBottom: "25px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Search questions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #aaa",
            fontSize: "16px",
          }}
        />

        <button
          onClick={() => setSearchTerm(searchTerm)}
          style={{
            padding: "10px 20px",
            background: "#0066cc",
            borderRadius: "6px",
            color: "white",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {/* HEADER */}
      <div style={{ marginBottom: "25px" }}>
        <h1
          style={{
            marginBottom: "5px",
            fontSize: "38px",
            fontWeight: "900",
            color: "#0066cc",
            letterSpacing: "0.5px",
          }}
        >
          {screeningType ? screeningType.toUpperCase() : "ALL QUESTIONS"}
          {detectedYear ? ` for ${detectedYear}` : ""} ({filteredQuestions.length} Questions)
        </h1>

        <p style={{ marginTop: "8px", fontSize: "18px", color: "#444" }}>
          Use filters, search, and collapsible cards to browse questions.
        </p>
      </div>

      {/* CREATE BUTTON */}
      <Link
        href="/admin/questions/new"
        style={{
          marginBottom: "20px",
          display: "inline-block",
          background: "#0066cc",
          color: "white",
          padding: "10px 20px",
          borderRadius: "6px",
          fontWeight: "bold",
          textDecoration: "none",
        }}
      >
        + Create New Question
      </Link>

      {/* QUESTION CARDS */}
      {filteredQuestions.length === 0 && <p>No questions found.</p>}

      <div
        style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "30px" }}
      >
        {filteredQuestions.map((q: any) => {
          const isOpen = openCard === q._id;

          return (
            <div
              key={q._id}
              style={{
                background: "#f5f5f5",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            >
              <div
                onClick={() => toggleCard(q._id)}
                style={{
                  padding: "15px",
                  fontWeight: "bold",
                  fontSize: "17px",
                  cursor: "pointer",
                  background: "#e6efff",
                  borderBottom: "1px solid #ccc",
                }}
              >
                Section {q.section} — {q.text.substring(0, 40)}...
              </div>

              {isOpen && (
                <div style={{ padding: "20px" }}>
                  <p>
                    <strong>Type:</strong> {q.screeningType}
                    <br />
                    <strong>Reading Year:</strong> {q.readingYear}
                    <br />
                    <strong>Order:</strong> {q.order}
                    <br />
                    <strong>Active:</strong> {q.active ? "Yes" : "No"}
                  </p>

                  <hr style={{ margin: "15px 0" }} />

                  <div>
                    <strong>Question:</strong>
                    <p style={{ marginTop: "8px", fontSize: "16px" }}>{q.text}</p>
                  </div>

                  {q.options?.length > 0 && (
                    <div>
                      <strong>Options:</strong>
                      <ul style={{ marginTop: "5px", marginLeft: "25px" }}>
                        {q.options.map((opt: string, i: number) => (
                          <li key={i}>{opt}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Link
                    href={`/admin/questions/${q._id}`}
                    style={{
                      textDecoration: "underline",
                      display: "inline-block",
                      marginTop: "10px",
                    }}
                  >
                    Edit Question
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function QuestionsListPage() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <QuestionsListInner />
    </Suspense>
  );
}
