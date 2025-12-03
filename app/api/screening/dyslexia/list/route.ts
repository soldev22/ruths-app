// app/api/screening/dyslexia/list/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/db";
import { DyslexiaScreening } from "../../../../../models/DyslexiaScreening";
import Question from "../../../../../models/Question";

// ------------------------------
// SIMPLE SCORING ENGINE
// ------------------------------
function scoreSection(section: any) {
  const answers = section.answers;
  const total = Object.keys(answers).length;
  let difficulty = 0;

  for (const ans of Object.values(answers)) {
    const a = String(ans).toLowerCase();

    // crude difficulty heuristics
    if (a.includes("nessesary")) difficulty++;
    if (a.includes("m / w") || a.includes("axa")) difficulty++;
    if (a.includes("during, after, before")) difficulty++;
    if (a.length <= 2) difficulty++;
    if (a.split(/[\s,-]/).length > 4) difficulty++;
  }

  const difficultyPercent =
    total === 0 ? 0 : Math.min(100, Math.round((difficulty / total) * 100));

  return {
    totalQuestions: total,
    difficultyCount: difficulty,
    difficultyPercent,
  };
}

function scoreAllSections(screening: any) {
  return screening.sections.map((section: any) => {
    const s = scoreSection(section);
    return {
      sectionId: section.sectionId,
      ...s,
    };
  });
}

function scoreOverall(screening: any) {
  let totalDifficulty = 0;
  let totalQuestions = 0;

  screening.sections.forEach((section: any) => {
    const s = scoreSection(section);
    totalDifficulty += s.difficultyCount;
    totalQuestions += s.totalQuestions;
  });

  const percent =
    totalQuestions === 0
      ? 0
      : Math.round((totalDifficulty / totalQuestions) * 100);

  let indicator = "Low Indicators";
  if (percent > 25) indicator = "Mild Indicators";
  if (percent > 40) indicator = "Moderate Indicators";
  if (percent > 60) indicator = "Strong Indicators";

  return {
    overallPercent: percent,
    indicator,
  };
}

// ------------------------------
// API HANDLER
// ------------------------------
export async function GET(req: NextRequest) {
  try {
    const caseId = req.nextUrl.searchParams.get("caseId");

    if (!caseId) {
      return NextResponse.json({ error: "Missing caseId" }, { status: 400 });
    }

    await connectToDatabase();

    const screening = await DyslexiaScreening.findOne({ caseId }).lean();

    if (!screening) {
      return NextResponse.json(
        { screening: null, questionLookup: {}, scoring: null, sectionScores: [] },
        { status: 200 }
      );
    }

    const allQuestionIds = screening.sections.flatMap((section: any) =>
      Object.keys(section.answers)
    );

    const questions = await Question.find({
      _id: { $in: allQuestionIds },
    }).lean();

    const questionLookup: Record<string, string> = {};
    questions.forEach((q: any) => {
      questionLookup[q._id.toString()] = q.text;
    });

    const scoring = scoreOverall(screening);
    const sectionScores = scoreAllSections(screening);

    return NextResponse.json({
      screening,
      questionLookup,
      scoring,
      sectionScores,
    });
  } catch (err) {
    console.error("API ERROR /screening/dyslexia/list:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
