import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/db";
import { DyslexiaScreening } from "../../../../../models/DyslexiaScreening";
import Question from "../../../../../models/Question";

/* ----------------------------------------------------------------------
   REAL SCORING ENGINE — MATCHES student answers to correct answers
---------------------------------------------------------------------- */

// Normalise user text (hybrid matching)
function normalise(str: string): string {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:'"-]/g, "")
    .replace(/\s+/g, " ");
}

// Check if answer is correct
function isCorrect(user: string, correct: string | string[]): boolean {
  if (!user || !correct) return false;

  const ua = normalise(user);

  if (Array.isArray(correct)) {
    return correct.some((c) => normalise(c) === ua);
  }

  return normalise(correct) === ua;
}

// Score one section
function scoreSection(section: any, questionLookup: Record<string, any>) {
  const answers = section.answers;
  const qIds = Object.keys(answers);

  let correct = 0;

  for (const qId of qIds) {
    const q = questionLookup[qId];
    if (!q) continue;

    if (isCorrect(answers[qId], q.correctAnswer)) {
      correct++;
    }
  }

  const total = qIds.length;
  const percent = total ? Math.round((correct / total) * 100) : 0;

  // RAG thresholds (industry standard)
  let rag = "green";
  if (percent < 80) rag = "amber";
  if (percent < 60) rag = "red";

  return { correct, total, percent, rag };
}

// Score all sections
function scoreAllSections(screening: any, lookup: Record<string, any>) {
  return screening.sections.map((sec: any) => ({
    sectionId: sec.sectionId,
    ...scoreSection(sec, lookup),
  }));
}

// Final overall classification
function scoreOverall(sectionScores: any[]) {
  let red = 0, amber = 0, green = 0;
  let total = 0;
  let correct = 0;

  sectionScores.forEach((s) => {
    if (s.rag === "red") red++;
    else if (s.rag === "amber") amber++;
    else green++;

    correct += s.correct || 0;
    total += s.total || 0;
  });

  const overallPercent = total ? Math.round((correct / total) * 100) : 0;

  let classification = "Low Risk";
  if (red >= 2 || (red === 1 && amber >= 2)) classification = "High Risk";
  else if (red === 1 || amber > 0) classification = "Moderate Risk";

  return { red, amber, green, classification, overallPercent };
}



/* ----------------------------------------------------------------------
   MAIN API HANDLER
---------------------------------------------------------------------- */

export async function GET(req: NextRequest) {
  try {
    const caseId = req.nextUrl.searchParams.get("caseId");
    if (!caseId) {
      return NextResponse.json({ error: "Missing caseId" }, { status: 400 });
    }

    await connectToDatabase();

    const screening = await DyslexiaScreening.findOne({ caseId }).lean();
    if (!screening) {
      return NextResponse.json({
        screening: null,
        questionLookup: {},
        scoring: null,
        sectionScores: [],
      });
    }

    // Gather all question IDs used
    const qIds = screening.sections.flatMap((s: any) =>
      Object.keys(s.answers)
    );

    // Fetch question text
 // LINE 78–85 — PATCHED: store full question object including correctAnswer
const questions = await Question.find({ _id: { $in: qIds } }).lean();
const questionLookup: Record<string, any> = {};
questions.forEach((q: any) => {
  questionLookup[q._id.toString()] = {
    text: q.text,
    correctAnswer: q.correctAnswer,
  };
});


    // Compute scoring
    const sectionScores = scoreAllSections(screening, questionLookup);
    const scoring = scoreOverall(sectionScores);

    // Flatten structure for the UI
   // Flatten structure for the UI
const flatAnswers = screening.sections.flatMap((sec: any) =>
  Object.entries(sec.answers).map(([qId, ans]) => ({
    sectionId: sec.sectionId,
    questionId: qId,
    questionText: questionLookup[qId]?.text || "Unknown question",
    correctAnswer: questionLookup[qId]?.correctAnswer || null,
    answer: ans,
  }))
);


    return NextResponse.json({
      screening,
      questionLookup,
      scoring,
      sectionScores,
      flatAnswers, // NEW
    });

  } catch (err) {
    console.error("DETAILS API ERROR:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
