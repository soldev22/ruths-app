import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { connectToDatabase } from '../../../../lib/db';
import MarketingSettings from '../../../../models/MarketingSettings';
import { getUserFromToken } from '../../../../lib/getUserFromToken';
import User from '../../../../models/User';

// GET current settings
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    console.log('[Marketing Settings] Token:', token ? `${token.substring(0, 20)}...` : 'none');
    
    const decoded = getUserFromToken(token);
    console.log('[Marketing Settings] Decoded:', decoded);
    
    if (!decoded?.userId) {
      console.log('[Marketing Settings] No userId in token');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectToDatabase();
    
    // Check if user is admin
    const user = await User.findById(decoded.userId);
    console.log('[Marketing Settings] User:', user?.email, 'isAdmin:', user?.isAdmin);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Only allow admin users
    if (!user.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    let settings = await MarketingSettings.findOne();
    if (!settings) {
      settings = await MarketingSettings.create({
        twitterBotEnabled: false,
        totalTweetsPosted: 0,
      });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST update settings
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    const decoded = getUserFromToken(token);
    
    if (!decoded?.userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectToDatabase();
    
    // Check if user is admin
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Only allow admin users
    if (!user.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { twitterBotEnabled } = await req.json();
    
    let settings = await MarketingSettings.findOne();
    if (!settings) {
      settings = await MarketingSettings.create({
        twitterBotEnabled,
        totalTweetsPosted: 0,
      });
    } else {
      settings.twitterBotEnabled = twitterBotEnabled;
      settings.updatedAt = new Date();
      await settings.save();
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
