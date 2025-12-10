import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/db";
import { DyscalculiaScreening } from "../../../../../models/DyscalculiaScreening";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    await connectToDatabase();

    const screenings = await DyscalculiaScreening.find(
      { teacherId: userId },
      {
        _id: 1,
        teacherId: 1,
        caseId: 1,
        sections: 1,
        createdAt: 1,
        updatedAt: 1,
        readingYear: 1,
      }
    )
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({ screenings }, { status: 200 });
  } catch (err) {
    console.error("DYSCALCULIA LIST ERROR:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
