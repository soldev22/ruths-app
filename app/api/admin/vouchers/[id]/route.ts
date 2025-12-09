import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/db";
import { getUserFromToken } from "../../../../../lib/getUserFromToken";
import User from "../../../../../models/User";
import Voucher from "../../../../../models/Voucher";

// DELETE - Delete voucher
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    const voucher = await Voucher.findByIdAndDelete(id);
    
    if (!voucher) {
      return NextResponse.json({ error: "Voucher not found" }, { status: 404 });
    }

    console.log(`[ADMIN_VOUCHER] Deleted voucher ${voucher.code}`);

    return NextResponse.json({ 
      success: true,
      message: "Voucher deleted successfully"
    });

  } catch (error) {
    console.error("[ADMIN_VOUCHER_DELETE] Error:", error);
    return NextResponse.json({ error: "Failed to delete voucher" }, { status: 500 });
  }
}

// PATCH - Toggle voucher active status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    const voucher = await Voucher.findById(id);
    
    if (!voucher) {
      return NextResponse.json({ error: "Voucher not found" }, { status: 404 });
    }

    voucher.isActive = !voucher.isActive;
    await voucher.save();

    console.log(`[ADMIN_VOUCHER] Toggled voucher ${voucher.code} to ${voucher.isActive ? 'active' : 'inactive'}`);

    return NextResponse.json({ 
      success: true,
      isActive: voucher.isActive,
      message: `Voucher ${voucher.isActive ? 'activated' : 'deactivated'} successfully`
    });

  } catch (error) {
    console.error("[ADMIN_VOUCHER_PATCH] Error:", error);
    return NextResponse.json({ error: "Failed to update voucher" }, { status: 500 });
  }
}
