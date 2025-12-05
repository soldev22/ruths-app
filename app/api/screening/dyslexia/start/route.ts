import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/db";
import { DyslexiaScreening } from "../../../../../models/DyslexiaScreening";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { caseId } = body;

    if (!caseId) {
      return NextResponse.json({ error: "Missing caseId" }, { status: 400 });
    }

    // read token → get userId
    const cookie = req.headers.get("cookie") ?? "";
    const token = cookie.split("auth_token=")[1];

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const userId = decoded.userId;

    // check if screening already exists
    let screening = await DyslexiaScreening.findOne({ caseId });

    if (!screening) {
      screening = await DyslexiaScreening.create({
        userId,
        caseId,
        sections: [],
      });
    }

    return NextResponse.json({ screening });
  } catch (err) {
    console.error("Start error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
