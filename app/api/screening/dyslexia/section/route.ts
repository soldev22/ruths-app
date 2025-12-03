// app/api/screening/dyslexia/section/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/db";
import { DyslexiaScreening } from "../../../../../models/DyslexiaScreening";
import { getUserFromToken } from "../../../../../lib/getUserFromToken";
;

// helper to get teacherId (falls back to "anonymous" in dev / if not logged in)
function getTeacherId(req: NextRequest): string {
  const token = req.cookies.get("auth_token")?.value;
  const decoded = getUserFromToken(token);
  return decoded?.userId || "anonymous";
}

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const { sectionId, answers, caseId } = await req.json();

  if (!sectionId || !answers || !caseId) {
    return NextResponse.json(
      { error: "sectionId, answers, and caseId are required" },
      { status: 400 }
    );
  }

  const teacherId = getTeacherId(req);

  // Find screening for this teacher + case
  let screening = await DyslexiaScreening.findOne({ teacherId, caseId });

  // Create if it doesn't exist
  if (!screening) {
    screening = new DyslexiaScreening({
      teacherId,
      caseId,
      sections: [],
    });
  } else if (!screening.teacherId) {
    // upgrade old records without teacherId
    screening.teacherId = teacherId;
  }

  // Update or insert this section
  const idx = screening.sections.findIndex(
    (s: any) => s.sectionId === sectionId
  );

  if (idx >= 0) {
    screening.sections[idx].answers = answers;
  } else {
    screening.sections.push({ sectionId, answers });
  }

  await screening.save();

  return NextResponse.json(
    {
      ok: true,
      screeningId: screening._id.toString(),
    },
    { status: 200 }
  );
}

export async function GET(req: NextRequest) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const caseId = searchParams.get("caseId");

  if (!caseId) {
    return NextResponse.json(
      { error: "caseId is required" },
      { status: 400 }
    );
  }

  const teacherId = getTeacherId(req);

  const screening = await DyslexiaScreening.findOne({ teacherId, caseId });

  if (!screening) {
    return NextResponse.json({ exists: false }, { status: 200 });
  }

  return NextResponse.json(
    {
      exists: true,
      screening,
    },
    { status: 200 }
  );
}
