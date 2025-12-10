import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/db";
import { DyslexiaScreening } from "../../../../../models/DyslexiaScreening";
import User from "../../../../../models/User";
import ActivityLog from "../../../../../models/ActivityLog";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export async function POST(req: Request) {
  try {
    console.log("[start] incoming request");
    await connectToDatabase();

    const body = await req.json();
    const { caseId } = body;

    if (!caseId) {
      return NextResponse.json({ error: "Missing caseId" }, { status: 400 });
    }

    // read token → get userId
    const cookie = req.headers.get("cookie") ?? "";
    const token = cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("auth_token="))
      ?.replace("auth_token=", "");

    if (!token) {
      console.log("[start] missing auth_token cookie");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.userId;

    // Check prepaid credits
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const prepaidCredits = user.prepaidCredits || 0;
    const canScreen = prepaidCredits > 0;

    if (!canScreen) {
      return NextResponse.json({ 
        error: "No credits available", 
        message: "You have no assessment credits. Please purchase credits to continue.",
        needsUpgrade: true,
        prepaidCredits: 0
      }, { status: 403 });
    }

    // check if screening already exists
    let screening = await DyslexiaScreening.findOne({ caseId });
    const isNewScreening = !screening;

    if (!screening) {
      screening = await DyslexiaScreening.create({
        userId,
        caseId,
        sections: [],
      });
    }

    // Deduct prepaid credit ONLY for new screenings
    if (isNewScreening) {
      user.prepaidCredits = (user.prepaidCredits || 0) - 1;
      user.screeningsUsed = (user.screeningsUsed || 0) + 1;
      await user.save();
      console.log("Deducted credit", {
        userId,
        prepaidCredits: user.prepaidCredits,
        screeningsUsed: user.screeningsUsed,
      });
    }

    // Log the screening start
    try {
      await ActivityLog.create({
        userId: user._id,
        userEmail: user.email,
        activityType: 'screening_started',
        screeningId: screening._id,
        caseId: caseId,
        metadata: {
          isNewScreening,
          screeningsUsed: user.screeningsUsed,
          creditsUsed: isNewScreening ? 1 : 0,
          remainingCredits: user.prepaidCredits || 0,
          accountType: user.accountType,
          userAgent: req.headers.get('user-agent'),
          timestamp: new Date()
        }
      });
      console.log(`[SCREENING_STARTED] User: ${user.email}, Case ID: ${caseId}, Screening ID: ${screening._id}, Credits Used: ${isNewScreening ? 1 : 0}`);
    } catch (logError) {
      console.error('Failed to log screening start:', logError);
    }

    const screeningsRemaining = user.prepaidCredits || 0;

    console.log("[start] success", { userId, prepaidCredits: user.prepaidCredits, screeningsUsed: user.screeningsUsed });

    return NextResponse.json({ 
      screening,
      screeningsRemaining,
      prepaidCredits: user.prepaidCredits
    });
  } catch (err) {
    console.error("Start error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
