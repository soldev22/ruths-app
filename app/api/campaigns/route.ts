import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Campaign from '@/models/Campaign';
import { getUserFromToken } from '@/lib/getUserFromToken';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    const user = getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const filter: any = { createdBy: user._id };
    if (status) {
      filter.status = status;
    }

    const campaigns = await Campaign.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ campaigns });
  } catch (error: any) {
    console.error('Error fetching campaigns:', error);
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

    await dbConnect();

    const body = await request.json();
    const {
      name,
      description,
      status,
      startDate,
      endDate,
      targetAudience,
      goals,
      platforms,
      budget,
    } = body;

    if (!name || !description || !startDate || !endDate || !targetAudience) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const campaign = await Campaign.create({
      name,
      description,
      status: status || 'draft',
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      targetAudience,
      goals: goals || [],
      platforms: platforms || [],
      budget,
      createdBy: user._id,
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating campaign:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
