import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/db";
import { DyscalculiaScreening } from "../../../../../models/DyscalculiaScreening";
import Question from "../../../../../models/Question";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { caseId } = await req.json();

    if (!caseId) {
      return NextResponse.json({ error: "Missing caseId" }, { status: 400 });
    }

    await connectToDatabase();

    const screening = await DyscalculiaScreening.findOne({ caseId }).lean();
    if (!screening) {
      return NextResponse.json({ error: "Screening not found" }, { status: 404 });
    }

    const questionIds = screening.sections.flatMap((s: any) =>
      Object.keys(s.answers)
    );

    const questions = await Question.find({
      _id: { $in: questionIds },
    }).lean();

    const questionLookup: Record<string, string> = {};
    questions.forEach((q: any) => {
      questionLookup[q._id.toString()] = q.text;
    });

    const structured = screening.sections.map((section: any) => ({
      section: section.sectionId,
      responses: Object.entries(section.answers).map(([qId, answer]) => ({
        question: questionLookup[qId] || "(Missing question)",
        answer,
      })),
    }));

    const prompt = `
You are an educational specialist writing a dyscalculia screening support report for teachers.

Guidance:
- Do mention likely dyscalculia indicators based on student responses. 
- Do highlight strengths, difficulties, patterns, and possible indicators.
- Provide actionable strategies and suggested next steps.
- Offer supportive language that helps teachers understand and act.
- Make recommendations for further assessment if needed.
- Use professional tone — this will be shared with educators.
- Use educational terms to make it look pedagogically sound.

IMPORTANT FORMATTING RULES:
- DO NOT use markdown formatting (no asterisks, hashes, or other symbols)
- DO NOT use bold, italic, or heading markers
- Write in plain text only
- Use clear paragraph breaks for readability
- Do not use dashes, bullets, or list markers
- Use simple numbered points if needed (e.g., "1. Point here")
- Do not use ## or ### or ** or __ or any markdown syntax
- Do not use - or * or + for lists

REQUIRED STRUCTURE - Include these section headings:

OVERVIEW
[Provide a brief summary of the screening results]

KEY FINDINGS
[Detail the main observations and patterns identified]

AREAS OF CONCERN
[Highlight specific difficulties or indicators related to mathematical thinking]

STRENGTHS IDENTIFIED
[Note positive aspects and mathematical capabilities]

RECOMMENDATIONS
[Provide actionable next steps and strategies for supporting mathematical learning]

FURTHER ASSESSMENT
[Suggest if additional evaluation is needed]

STUDENT RESPONSES:
${JSON.stringify(structured, null, 2)}
`;

    // Safe runtime check: log presence (not value) of the OpenAI key and fail early if missing.
    const hasApiKey = !!process.env.OPENAI_API_KEY;
    try {
      console.error(
        "OPENAI_API_KEY present:",
        hasApiKey,
        "length:",
        process.env.OPENAI_API_KEY?.length ?? 0
      );
    } catch (e) {
      // ignore logging failures
    }

    if (!hasApiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not set in the runtime. Add it to your environment variables and redeploy." },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
    });

    const report = completion.choices[0].message.content;

    return NextResponse.json({ report });
  } catch (err: any) {
    console.error("AI REPORT ERROR:", err?.stack || err);
    const message = err?.message || JSON.stringify(err);
    return NextResponse.json(
      { error: `Failed to generate AI report: ${message}` },
      { status: 500 }
    );
  }
}
