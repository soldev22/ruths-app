import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/db';
import User from '../../../../models/User';

// One-time setup endpoint to make mt@mt.com admin
export async function POST(req: Request) {
  try {
    const { secret } = await req.json();
    
    // Simple secret check
    if (secret !== 'make-me-admin-2025') {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 403 });
    }

    await connectToDatabase();
    
    const result = await User.updateOne(
      { email: 'mt@mt.com' },
      { $set: { isAdmin: true } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'mt@mt.com is now an admin',
      modified: result.modifiedCount,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
