import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/db";
import { DyslexiaScreening } from "../../../../../models/DyslexiaScreening";
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

    const screening = await DyslexiaScreening.findOne({ caseId }).lean();
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
You are an educational specialist writing a **dyslexia screening support report** for teachers.

Guidance:
- Do mention likely dyslexia indicators based on student responses. 
- Do highlight strengths, difficulties, patterns, and possible indicators.
- Provide actionable strategies and suggested next steps.
- Offer supportive language that helps teachers understand and act.
- Make recommendations for further assessment if needed.
- Use professional tone — this will be shared with educators.
- Use educational terms to make it look pedagogiclaly sound.

STUDENT RESPONSES:
${JSON.stringify(structured, null, 2)}
`;

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
    });

    const report = completion.choices[0].message.content;

    return NextResponse.json({ report });
  } catch (err) {
    console.error("AI REPORT ERROR:", err);
    return NextResponse.json(
      { error: "Failed to generate AI report" },
      { status: 500 }
    );
  }
}
