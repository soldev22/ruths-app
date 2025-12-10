import { NextRequest, NextResponse } from "next/server";
import { stripe } from "../../../../lib/stripe";
import { getUserFromToken } from "../../../../lib/getUserFromToken";
import { connectToDatabase } from "../../../../lib/db";
import User from "../../../../models/User";
import ActivityLog from "../../../../models/ActivityLog";

export async function POST(req: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
    }

    // Extract token from cookies
    const cookie = req.headers.get("cookie") ?? "";
    const token = cookie.split("auth_token=")[1]?.split(";")[0];
    
    const decodedUser = getUserFromToken(token);
    if (!decodedUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Check if payment was successful
    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    await connectToDatabase();

    const userId = session.metadata?.userId;
    const credits = parseInt(session.metadata?.credits || "0");
    const bundleType = session.metadata?.bundleType;

    if (!userId || !credits) {
      return NextResponse.json({ error: "Invalid session metadata" }, { status: 400 });
    }

    // Verify this is the correct user
    if (userId !== decodedUser.userId) {
      return NextResponse.json({ error: "Session user mismatch" }, { status: 403 });
    }

    // Check if credits were already added (by webhook)
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if this transaction was already processed
    const existingLog = await ActivityLog.findOne({
      userId: user._id,
      "metadata.stripeSessionId": session.id,
      "metadata.action": "credit_purchase",
    });

    if (existingLog) {
      console.log(`[VERIFY_SESSION] Credits already added for session ${sessionId}`);
      return NextResponse.json({ 
        success: true,
        alreadyProcessed: true,
        creditsAdded: credits,
        newBalance: user.prepaidCredits,
      });
    }

    // Add credits (webhook didn't fire or hasn't fired yet)
    console.log(`[VERIFY_SESSION] Webhook didn't fire, manually adding ${credits} credits to user ${user.email}`);
    
    const oldBalance = user.prepaidCredits || 0;
    user.prepaidCredits = (user.prepaidCredits || 0) + credits;
    await user.save();

    // Log the activity
    await ActivityLog.create({
      userId: user._id,
      userEmail: user.email,
      activityType: "login",
      metadata: {
        action: "credit_purchase",
        bundleType,
        creditsAdded: credits,
        oldBalance,
        newBalance: user.prepaidCredits,
        amountPaid: session.amount_total,
        currency: session.currency,
        paymentStatus: session.payment_status,
        stripeSessionId: session.id,
        addedVia: "manual_verification", // Mark that this was added manually
      },
    });

    console.log(`[VERIFY_SESSION] Successfully added ${credits} credits. New balance: ${user.prepaidCredits}`);

    return NextResponse.json({ 
      success: true,
      creditsAdded: credits,
      newBalance: user.prepaidCredits,
      oldBalance,
    });
  } catch (error) {
    console.error("[VERIFY_SESSION] Error:", error);
    return NextResponse.json({ error: "Failed to verify session" }, { status: 500 });
  }
}
