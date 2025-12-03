import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/db";
import Question from "../../../../models/Question";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const data = await req.json();

    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: "Uploaded JSON must be an array of questions" },
        { status: 400 }
      );
    }

    const results = [];

    for (const q of data) {
      if (!q.screeningType || !q.section || !q.text) {
        continue;
      }

      const newQuestion = await Question.create({
        screeningType: q.screeningType,
        readingYear: q.readingYear ?? null,
        section: q.section,
        text: q.text,
        options: q.options || [],
        order: q.order || 0,
        active: true,
      });

      results.push(newQuestion);
    }

    return NextResponse.json({
      message: "Questions uploaded successfully",
      count: results.length,
      questions: results,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Failed to upload questions" },
      { status: 500 }
    );
  }
}
