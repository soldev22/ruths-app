import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/db";
import { DyslexiaScreening } from "../../../../../models/DyslexiaScreening";
import User from "../../../../../models/User";
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

    // Check subscription limits
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const now = new Date();
    const trialActive = user.trialEndDate && new Date(user.trialEndDate) > now;
    const subscriptionActive = user.subscriptionStatus === 'active';
    const canScreen = subscriptionActive || 
              (trialActive && user.screeningsUsed < user.maxScreenings);

    if (!canScreen) {
      return NextResponse.json({ 
        error: "Screening limit reached", 
        message: "Your trial has ended or you've reached your screening limit. Please upgrade to continue.",
        needsUpgrade: true,
        screeningsUsed: user.screeningsUsed,
        maxScreenings: user.maxScreenings
      }, { status: 403 });
    }

    // check if screening already exists
    let screening = await DyslexiaScreening.findOne({ caseId });

    if (!screening) {
      screening = await DyslexiaScreening.create({
        userId,
        caseId,
        sections: [],
      });
    }

    // Increment screening count on every start (counts usage even if screening already existed)
    user.screeningsUsed = (user.screeningsUsed || 0) + 1;
    await user.save();
    console.log("Incremented screeningsUsed", {
      userId,
      screeningsUsed: user.screeningsUsed,
    });

    const screeningsRemaining = subscriptionActive ? 'unlimited' : 
                                Math.max(0, user.maxScreenings - user.screeningsUsed);

    console.log("[start] success", { userId, screeningsUsed: user.screeningsUsed });

    return NextResponse.json({ 
      screening,
      screeningsRemaining,
      subscriptionStatus: user.subscriptionStatus
    });
  } catch (err) {
    console.error("Start error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
