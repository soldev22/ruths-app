// app/api/screening/dyslexia/section/route.ts

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { connectToDatabase } from "../../../../../lib/db";
import { DyslexiaScreening } from "../../../../../models/DyslexiaScreening";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const {
      screeningId,
      sectionId,
      answers,
      caseId,
      pupilId,
      assessorId,
    } = body;

    console.log("API received payload:", body);

    if (!sectionId || !answers) {
      return NextResponse.json(
        { error: "sectionId and answers are required" },
        { status: 400 }
      );
    }

    const idToUse = screeningId || randomUUID();

    let screening = await DyslexiaScreening.findOne({ screeningId: idToUse });

    if (!screening) {
      screening = new DyslexiaScreening({
        screeningId: idToUse,
        caseId: caseId || undefined,
        pupilId,
        assessorId,
        sections: [],
      });
    } else {
      if (caseId && !screening.caseId) {
        screening.caseId = caseId;
      }
    }

    const idx = screening.sections.findIndex(
      (s: any) => s.sectionId === sectionId
    );

    const sectionData = {
      sectionId,
      answers,
      completedAt: new Date(),
    };

    if (idx >= 0) {
      screening.sections[idx] = sectionData;
    } else {
      screening.sections.push(sectionData);
    }

    await screening.save();

    return NextResponse.json({ success: true, screeningId: idToUse });
  } catch (err: any) {
    console.error("Error saving dyslexia screening section:", err);

    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
