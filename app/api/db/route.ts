import { NextRequest, NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/database';

export async function GET() {
  try {
    const db = await getDB();
    return NextResponse.json(db);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    await saveDB(payload);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
