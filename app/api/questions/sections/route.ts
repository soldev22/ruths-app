import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Question from "@/models/Question";

export async function GET() {
  await connectToDatabase();

  const sections = await Question.distinct("section");

  return NextResponse.json(sections.sort());
}
