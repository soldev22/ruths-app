// app/api/screening/dyslexia/list/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { DyslexiaScreening } from "@/models/DyslexiaScreening";
import { getUserFromToken } from "@/lib/getUserFromToken";

function getTeacherId(req: NextRequest): string | null {
  const token = req.cookies.get("auth_token")?.value;
  const decoded = getUserFromToken(token);
  return decoded?.userId || null;
}

export async function GET(req: NextRequest) {
  await dbConnect();

  const teacherId = getTeacherId(req);

  if (!teacherId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const screenings = await DyslexiaScreening.find({ teacherId }).sort({
    updatedAt: -1,
  });

  return NextResponse.json(
    {
      screenings,
    },
    { status: 200 }
  );
}
