import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/db";
import Question from "../../../../models/Question";


export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await connectToDatabase();
    const question = await Question.findById(id);

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    return NextResponse.json({ question });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
