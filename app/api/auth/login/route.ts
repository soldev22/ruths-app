import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "../../../../lib/db";
import User from "../../../../models/User";
import ActivityLog from "../../../../models/ActivityLog";


const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Log the login activity
    try {
      await ActivityLog.create({
        userId: user._id,
        userEmail: user.email,
        activityType: 'login',
        metadata: {
          userAgent: req.headers.get('user-agent'),
          timestamp: new Date()
        }
      });
      console.log(`[LOGIN] User logged in: ${user.email} (ID: ${user._id})`);
    } catch (logError) {
      console.error('Failed to log login activity:', logError);
      // Don't fail the login if logging fails
    }

    const res = NextResponse.json(
      {
        message: "Login successful",
      },
      { status: 200 }
    );

    // ✅ Set httpOnly cookie for auth
    res.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
