import { NextRequest, NextResponse } from "next/server";
import { stripe, PRICES, BUNDLES } from "../../../../lib/stripe";
import { getUserFromToken } from "../../../../lib/getUserFromToken";

export async function POST(req: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { error: "Payment system not configured. Please contact support." },
        { status: 503 }
      );
    }

    // Extract token from cookies
    const cookie = req.headers.get("cookie") ?? "";
    const token = cookie.split("auth_token=")[1]?.split(";")[0];
    
    const decodedUser = getUserFromToken(token);
    if (!decodedUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get full user from database
    const User = (await import("../../../../models/User")).default;
    await import("../../../../lib/db").then(m => m.connectToDatabase());
    const user = await User.findById(decodedUser.userId);
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only individual accounts can purchase credits
    if (user.accountType !== 'individual') {
      return NextResponse.json(
        { error: "Only individual accounts can purchase credits" },
        { status: 400 }
      );
    }

    const { bundleType } = await req.json();

    if (!bundleType || !BUNDLES[bundleType as keyof typeof BUNDLES]) {
      return NextResponse.json({ error: "Invalid bundle type" }, { status: 400 });
    }

    const bundle = BUNDLES[bundleType as keyof typeof BUNDLES];

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: `SkillScan Dyslexia ${bundle.credits === 1 ? 'Assessment' : `${bundle.credits} Assessment Bundle`}`,
              description: bundle.credits === 1 
                ? 'Single dyslexia screening assessment'
                : `Bundle of ${bundle.credits} assessments${bundle.savings > 0 ? ` - Save £${(bundle.savings / 100).toFixed(2)}` : ''}`,
            },
            unit_amount: bundle.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/protected/account?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/protected/pricing?payment=cancelled`,
      customer_email: user.email,
      metadata: {
        userId: user._id.toString(),
        bundleType,
        credits: bundle.credits.toString(),
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("[CREATE_CHECKOUT] Error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
