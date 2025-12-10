import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CampaignAnalytics from '@/models/CampaignAnalytics';
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
    const campaignId = searchParams.get('campaignId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    // Verify campaign belongs to user
    const campaign = await Campaign.findOne({
      _id: campaignId,
      createdBy: user._id,
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    const filter: any = { campaign: campaignId };
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const analytics = await CampaignAnalytics.find(filter)
      .sort({ date: -1 })
      .lean();

    // Calculate totals
    const totals = analytics.reduce(
      (acc, curr) => ({
        impressions: acc.impressions + curr.metrics.impressions,
        reach: acc.reach + curr.metrics.reach,
        engagement: acc.engagement + curr.metrics.engagement,
        clicks: acc.clicks + curr.metrics.clicks,
        conversions: acc.conversions + curr.metrics.conversions,
        spend: acc.spend + (curr.metrics.spend || 0),
      }),
      { impressions: 0, reach: 0, engagement: 0, clicks: 0, conversions: 0, spend: 0 }
    );

    return NextResponse.json({ analytics, totals });
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
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
    const { campaign, date, platform, metrics } = body;

    if (!campaign || !date || !platform || !metrics) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify campaign belongs to user
    const campaignDoc = await Campaign.findOne({
      _id: campaign,
      createdBy: user._id,
    });

    if (!campaignDoc) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    const analytics = await CampaignAnalytics.create({
      campaign,
      date: new Date(date),
      platform,
      metrics,
    });

    return NextResponse.json({ analytics }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating analytics:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
