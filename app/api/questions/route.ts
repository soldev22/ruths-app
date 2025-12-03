import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/db";
import Question from "../../../models/Question";


// ----------------------------
// GET /api/questions
// ----------------------------
export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const screeningType = searchParams.get("screeningType");
    const readingYear = searchParams.get("readingYear");
    const section = searchParams.get("section");

    const query: any = { active: true };

    if (screeningType) query.screeningType = screeningType;
    if (readingYear) query.readingYear = Number(readingYear);
    if (section) query.section = section;

    const questions = await Question.find(query).sort({
      section: 1,
      order: 1,
    });

    return NextResponse.json(questions, { status: 200 });
  } catch (err) {
    console.error("GET /api/questions error:", err);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

// ----------------------------
// POST /api/questions
// ----------------------------
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();

    const requiredFields = ["screeningType", "section", "text"];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing field: ${field}` },
          { status: 400 }
        );
      }
    }

    const created = await Question.create(data);

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/questions error:", err);
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}

// ----------------------------
// PUT /api/questions?id=xxx
// ----------------------------
export async function PUT(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing question ID" },
        { status: 400 }
      );
    }

    const data = await req.json();
    const updated = await Question.findByIdAndUpdate(id, data, { new: true });

    if (!updated) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("PUT /api/questions error:", err);
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 }
    );
  }
}

// ----------------------------
// DELETE /api/questions?id=xxx
// Soft delete (active = false)
// ----------------------------
export async function DELETE(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing question ID" },
        { status: 400 }
      );
    }

    const deleted = await Question.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    );

    if (!deleted) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Question deactivated", question: deleted },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE /api/questions error:", err);
    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 }
    );
  }
}
