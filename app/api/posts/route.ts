import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/db';
import SocialPost from '../../../models/SocialPost';
import { getUserFromToken } from '../../../lib/getUserFromToken';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    const user = getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');
    const status = searchParams.get('status');
    
    const filter: any = { createdBy: user._id };
    if (campaignId) {
      filter.campaign = campaignId;
    }
    if (status) {
      filter.status = status;
    }

    const posts = await SocialPost.find(filter)
      .populate('campaign', 'name')
      .sort({ scheduledDate: -1 })
      .lean();

    return NextResponse.json({ posts });
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    const user = getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const body = await request.json();
    const {
      campaign,
      content,
      mediaUrls,
      platforms,
      scheduledDate,
      status,
      hashtags,
      mentions,
    } = body;

    if (!campaign || !content || !platforms || !scheduledDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const post = await SocialPost.create({
      campaign,
      content,
      mediaUrls: mediaUrls || [],
      platforms,
      scheduledDate: new Date(scheduledDate),
      status: status || 'draft',
      hashtags: hashtags || [],
      mentions: mentions || [],
      createdBy: user._id,
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
