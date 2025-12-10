import { NextRequest, NextResponse } from "next/server";
import { stripe } from "../../../../lib/stripe";
import { connectToDatabase } from "../../../../lib/db";
import User from "../../../../models/User";
import ActivityLog from "../../../../models/ActivityLog";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  if (!stripe) {
    console.error("[WEBHOOK] Stripe not configured");
    return NextResponse.json({ error: "Payment system not configured" }, { status: 503 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("[WEBHOOK] STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error("[WEBHOOK] Signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      await connectToDatabase();

      const userId = session.metadata?.userId;
      const credits = parseInt(session.metadata?.credits || "0");
      const bundleType = session.metadata?.bundleType;

      if (!userId || !credits) {
        console.error("[WEBHOOK] Missing metadata:", { userId, credits });
        return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
      }

      console.log(`[WEBHOOK] Processing payment for user ${userId}, adding ${credits} credits`);
      
      // Get user before update to log old balance
      const userBefore = await User.findById(userId);
      if (!userBefore) {
        console.error("[WEBHOOK] User not found:", userId);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      
      console.log(`[WEBHOOK] Current balance: ${userBefore.prepaidCredits || 0} credits`);

      // Add credits to user account
      const user = await User.findByIdAndUpdate(
        userId,
        { $inc: { prepaidCredits: credits } },
        { new: true }
      );

      if (!user) {
        console.error("[WEBHOOK] Failed to update user:", userId);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
      }

      console.log(`[WEBHOOK] Successfully added ${credits} credits to user ${user.email} (ID: ${userId})`);
      console.log(`[WEBHOOK] New balance: ${user.prepaidCredits} credits (was ${userBefore.prepaidCredits || 0})`);

      // Log the payment activity
      await ActivityLog.create({
        userId: user._id,
        userEmail: user.email,
        activityType: "login", // Using login as a generic activity type
        metadata: {
          action: "credit_purchase",
          bundleType,
          creditsAdded: credits,
          oldBalance: userBefore.prepaidCredits || 0,
          newBalance: user.prepaidCredits,
          amountPaid: session.amount_total,
          currency: session.currency,
          paymentStatus: session.payment_status,
          stripeSessionId: session.id,
        },
      });

      console.log(`[WEBHOOK] Activity logged successfully`);

      return NextResponse.json({ 
        success: true,
        creditsAdded: credits,
        newBalance: user.prepaidCredits,
      });
    } catch (error) {
      console.error("[WEBHOOK] Error processing payment:", error);
      return NextResponse.json({ error: "Failed to process payment" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
