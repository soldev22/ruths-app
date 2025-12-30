import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { DyscalculiaScreening } from '@/models/DyscalculiaScreening';

export async function POST(req: NextRequest) {
  try {
    const { caseId, elapsedSeconds } = await req.json();
    if (!caseId || typeof elapsedSeconds !== 'number') {
      return NextResponse.json({ error: 'Missing caseId or elapsedSeconds' }, { status: 400 });
    }
    // Save elapsedSeconds to the DyscalculiaScreening document
    await connectToDatabase();
    await DyscalculiaScreening.findByIdAndUpdate(caseId, { elapsedSeconds });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save time' }, { status: 500 });
  }
}
