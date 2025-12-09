import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {connectToDatabase} from "../../../../lib/db";
import User from "../../../../models/User";
import ActivityLog from "../../../../models/ActivityLog";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { name, email, password, accountType } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    // Calculate trial dates
    const trialStartDate = new Date();
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 30); // 30 days from now

    const user = await User.create({
      name: name || "",
      email,
      password: hashed,
      accountType: accountType || 'individual',
      subscriptionTier: 'trial',
      subscriptionStatus: 'trial',
      trialStartDate,
      trialEndDate,
      screeningsUsed: 0,
      maxScreenings: 0, // No free trial - must purchase credits
      prepaidCredits: 0,
    });

    // Log the registration
    try {
      await ActivityLog.create({
        userId: user._id,
        userEmail: user.email,
        activityType: 'registration',
        metadata: {
          accountType: user.accountType,
          userAgent: req.headers.get('user-agent'),
          timestamp: new Date()
        }
      });
      console.log(`[REGISTRATION] New user registered: ${user.email} (ID: ${user._id}, Type: ${user.accountType})`);
    } catch (logError) {
      console.error('Failed to log registration activity:', logError);
    }

    return NextResponse.json(
      { 
        message: "User registered", 
        userId: user._id.toString(),
        trialInfo: {
          trialEndDate,
          maxScreenings: 0
        }
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
