import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/db";
import { getUserFromToken } from "../../../../lib/getUserFromToken";
import User from "../../../../models/User";
import Voucher from "../../../../models/Voucher";

// GET - List all vouchers
export async function GET(req: NextRequest) {
  try {
    // Extract token from cookies
    const cookie = req.headers.get("cookie") ?? "";
    const token = cookie.split("auth_token=")[1]?.split(";")[0];
    
    const decodedUser = getUserFromToken(token);
    if (!decodedUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    // Check if user is admin
    const user = await User.findById(decodedUser.userId);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const vouchers = await Voucher.find({})
      .sort({ createdAt: -1 })
      .populate('createdBy', 'email')
      .lean();

    return NextResponse.json({ vouchers });
  } catch (error) {
    console.error("[ADMIN_VOUCHERS_GET] Error:", error);
    return NextResponse.json({ error: "Failed to fetch vouchers" }, { status: 500 });
  }
}

// POST - Create new voucher
export async function POST(req: NextRequest) {
  try {
    // Extract token from cookies
    const cookie = req.headers.get("cookie") ?? "";
    const token = cookie.split("auth_token=")[1]?.split(";")[0];
    
    const decodedUser = getUserFromToken(token);
    if (!decodedUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    // Check if user is admin
    const user = await User.findById(decodedUser.userId);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { code, credits, maxRedemptions, expiryDate, accountType, description } = await req.json();

    // Validate inputs
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: "Valid voucher code is required" }, { status: 400 });
    }

    if (!credits || credits < 1) {
      return NextResponse.json({ error: "Credits must be at least 1" }, { status: 400 });
    }

    // Check if code already exists
    const existing = await Voucher.findOne({ code: code.toUpperCase().trim() });
    if (existing) {
      return NextResponse.json({ error: "Voucher code already exists" }, { status: 400 });
    }

    // Create voucher
    const voucher = await Voucher.create({
      code: code.toUpperCase().trim(),
      credits,
      maxRedemptions: maxRedemptions || 1,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      accountType: accountType || 'both',
      description: description || '',
      createdBy: user._id,
      isActive: true
    });

    console.log(`[ADMIN_VOUCHER] Created voucher ${voucher.code} for ${credits} credits`);

    return NextResponse.json({ 
      success: true, 
      voucher,
      message: "Voucher created successfully"
    });

  } catch (error) {
    console.error("[ADMIN_VOUCHERS_POST] Error:", error);
    return NextResponse.json({ error: "Failed to create voucher" }, { status: 500 });
  }
}
