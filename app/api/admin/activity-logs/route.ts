import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/db";
import ActivityLog from "../../../../models/ActivityLog";
import { getUserFromToken } from "../../../../lib/getUserFromToken";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Get auth token
    const token = req.cookies.get("auth_token")?.value;
    const user = getUserFromToken(token);
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const activityType = searchParams.get("activityType");
    const userId = searchParams.get("userId");
    const userEmail = searchParams.get("userEmail");
    const limit = parseInt(searchParams.get("limit") || "100");
    const skip = parseInt(searchParams.get("skip") || "0");

    // Build query
    const query: any = {};
    if (activityType) query.activityType = activityType;
    if (userId) query.userId = userId;
    if (userEmail) query.userEmail = userEmail;

    // Fetch logs with pagination
    const logs = await ActivityLog.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await ActivityLog.countDocuments(query);

    return NextResponse.json({
      logs,
      pagination: {
        total,
        limit,
        skip,
        hasMore: total > skip + limit
      }
    });
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
