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
    await dbUser.save();

    const now = new Date();
    const trialActive = dbUser.trialEndDate && new Date(dbUser.trialEndDate) > now;
    const subscriptionActive = dbUser.subscriptionStatus === 'active';
    
    // Check if user can still screen
    const canScreen = subscriptionActive || 
                      (trialActive && dbUser.screeningsUsed < dbUser.maxScreenings);
    
    const response = {
      canScreen,
      subscriptionStatus: dbUser.subscriptionStatus,
      subscriptionTier: dbUser.subscriptionTier,
      screeningsUsed: dbUser.screeningsUsed,
      maxScreenings: dbUser.maxScreenings,
      trialActive,
      trialEndDate: dbUser.trialEndDate,
      screeningsRemaining: subscriptionActive ? 'unlimited' : 
                           Math.max(0, dbUser.maxScreenings - dbUser.screeningsUsed),
      message: !canScreen ? 'Trial limit reached. Please upgrade to continue.' : null
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
