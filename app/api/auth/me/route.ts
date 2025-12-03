import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "../../../../lib/mongodb";
import User from "../../../../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export async function GET() {
  try {
    // ✅ cookies() is async in Next 16 – we must await it
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    await dbConnect();
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        userId: user._id.toString(),
        email: user.email,
        name: user.name ?? null,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Me route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
