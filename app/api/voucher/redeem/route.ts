import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/db";
import { getUserFromToken } from "../../../../lib/getUserFromToken";
import User from "../../../../models/User";
import Voucher from "../../../../models/Voucher";
import ActivityLog from "../../../../models/ActivityLog";

export async function POST(req: NextRequest) {
  try {
    // Extract token from cookies
    const cookie = req.headers.get("cookie") ?? "";
    const token = cookie.split("auth_token=")[1]?.split(";")[0];
    
    const decodedUser = getUserFromToken(token);
    if (!decodedUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code } = await req.json();
    
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: "Voucher code is required" }, { status: 400 });
    }

    await connectToDatabase();
    
    // Get user
    const user = await User.findById(decodedUser.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find voucher
    const voucher = await Voucher.findOne({ 
      code: code.toUpperCase().trim(),
      isActive: true
    });

    if (!voucher) {
      return NextResponse.json({ error: "Invalid voucher code" }, { status: 404 });
    }

    // Check if expired
    if (voucher.expiryDate && new Date(voucher.expiryDate) < new Date()) {
      return NextResponse.json({ error: "This voucher has expired" }, { status: 400 });
    }

    // Check if voucher is for correct account type
    if (voucher.accountType !== 'both' && voucher.accountType !== user.accountType) {
      return NextResponse.json({ 
        error: `This voucher is only valid for ${voucher.accountType} accounts` 
      }, { status: 400 });
    }

    // Check if already redeemed by this user
    const alreadyRedeemed = voucher.redeemedBy.some(
      (redemption: any) => redemption.userId.toString() === user._id.toString()
    );
    
    if (alreadyRedeemed) {
      return NextResponse.json({ error: "You have already redeemed this voucher" }, { status: 400 });
    }

    // Check max redemptions
    if (voucher.currentRedemptions >= voucher.maxRedemptions) {
      return NextResponse.json({ error: "This voucher has reached its redemption limit" }, { status: 400 });
    }

    // Redeem voucher
    voucher.currentRedemptions += 1;
    voucher.redeemedBy.push({
      userId: user._id,
      userEmail: user.email,
      redeemedAt: new Date()
    });
    
    // If max redemptions reached, deactivate
    if (voucher.currentRedemptions >= voucher.maxRedemptions) {
      voucher.isActive = false;
    }
    
    await voucher.save();

    // Add credits to user
    user.prepaidCredits = (user.prepaidCredits || 0) + voucher.credits;
    await user.save();

    // Log activity
    await ActivityLog.create({
      userId: user._id,
      userEmail: user.email,
      activityType: "login", // Using login as generic activity type
      metadata: {
        action: "voucher_redeemed",
        voucherCode: voucher.code,
        creditsAdded: voucher.credits,
        newBalance: user.prepaidCredits
      }
    });

    console.log(`[VOUCHER] User ${user.email} redeemed voucher ${voucher.code} for ${voucher.credits} credits`);

    return NextResponse.json({
      success: true,
      creditsAdded: voucher.credits,
      newBalance: user.prepaidCredits,
      message: `Successfully redeemed! ${voucher.credits} credits added to your account.`
    });

  } catch (error) {
    console.error("[VOUCHER_REDEEM] Error:", error);
    return NextResponse.json(
      { error: "Failed to redeem voucher" },
      { status: 500 }
    );
  }
}
