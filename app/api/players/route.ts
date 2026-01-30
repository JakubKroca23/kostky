import { NextRequest, NextResponse } from 'next/server';
import db, { initializeDb } from '@/lib/db';

// Initialize database
initializeDb();

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'Jméno je povinné' }, { status: 400 });
    }

    const stmt = db.prepare(`
      INSERT INTO players (name, is_ai) VALUES (?, ?)
      RETURNING *
    `);

    const player = stmt.get(name.trim(), 0);
    return NextResponse.json(player);
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json({ error: 'Toto jméno je již používáno' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Chyba serveru' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const stmt = db.prepare('SELECT * FROM players ORDER BY wins DESC, total_score DESC');
    const players = stmt.all();
    return NextResponse.json(players);
  } catch (error) {
    return NextResponse.json({ error: 'Chyba serveru' }, { status: 500 });
  }
}
