import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "../../../../lib/getUserFromToken";
import { connectToDatabase } from "../../../../lib/db";
import User from "../../../../models/User";

export async function GET(req: NextRequest) {
  try {
    // Extract token from cookies
    const cookie = req.headers.get("cookie") ?? "";
    const token = cookie.split("auth_token=")[1]?.split(";")[0];
    
    const user = getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const dbUser = await User.findById(user.userId);
    
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Ensure defaults for legacy users
    if (typeof dbUser.screeningsUsed !== "number") dbUser.screeningsUsed = 0;
    if (typeof dbUser.maxScreenings !== "number") dbUser.maxScreenings = 20;
    if (!dbUser.subscriptionStatus) dbUser.subscriptionStatus = "trial";
    if (!dbUser.subscriptionTier) dbUser.subscriptionTier = "trial";
    if (!dbUser.accountType) dbUser.accountType = "individual";
    if (typeof dbUser.prepaidCredits !== "number") dbUser.prepaidCredits = 0;
    await dbUser.save();

    const now = new Date();
    const trialActive = dbUser.trialEndDate && new Date(dbUser.trialEndDate) > now;
    const subscriptionActive = dbUser.subscriptionStatus === 'active';
    
    // Check if user can still screen based on account type
    let canScreen = false;
    let screeningsRemaining: string | number = 0;
    
    if (dbUser.accountType === 'individual') {
      // Individual: check prepaid credits or trial
      canScreen = dbUser.prepaidCredits > 0 || (trialActive && dbUser.screeningsUsed < dbUser.maxScreenings);
      screeningsRemaining = trialActive 
        ? Math.max(dbUser.prepaidCredits, Math.max(0, dbUser.maxScreenings - dbUser.screeningsUsed))
        : dbUser.prepaidCredits;
    } else {
      // School: check subscription status or trial
      canScreen = subscriptionActive || (trialActive && dbUser.screeningsUsed < dbUser.maxScreenings);
      screeningsRemaining = subscriptionActive ? 'unlimited' : 
                            Math.max(0, dbUser.maxScreenings - dbUser.screeningsUsed);
    }
    
    const response = {
      canScreen,
      accountType: dbUser.accountType,
      subscriptionStatus: dbUser.subscriptionStatus,
      subscriptionTier: dbUser.subscriptionTier,
      screeningsUsed: dbUser.screeningsUsed,
      maxScreenings: dbUser.maxScreenings,
      prepaidCredits: dbUser.prepaidCredits,
      trialActive,
      trialEndDate: dbUser.trialEndDate,
      screeningsRemaining,
      message: !canScreen ? (dbUser.accountType === 'individual' ? 
        'No credits remaining. Please purchase more assessments.' : 
        'Trial limit reached. Please upgrade to continue.') : null
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error checking subscription limits:", error);
    return NextResponse.json(
      { error: "Failed to check limits" },
      { status: 500 }
    );
  }
}
