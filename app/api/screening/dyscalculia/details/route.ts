import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/db";
import { DyscalculiaScreening } from "../../../../../models/DyscalculiaScreening";
import Question from "../../../../../models/Question";

/* ----------------------------------------------------------------------
   SCORING ENGINE — MATCHES student answers to correct answers
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

  // RAG thresholds
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

    // Find the most recent screening with this caseId that has sections
    const screening = await DyscalculiaScreening.findOne({ 
      caseId,
      sections: { $exists: true, $ne: [] }
    })
      .sort({ createdAt: -1 })
      .lean();
      
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

    // Fetch question text and correctAnswer
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
      flatAnswers,
    });

  } catch (err) {
    console.error("DYSCALCULIA DETAILS API ERROR:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
