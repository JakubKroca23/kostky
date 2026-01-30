import { NextRequest, NextResponse } from 'next/server';
import db, { initializeDb } from '@/lib/db';

initializeDb();

export async function POST(request: NextRequest) {
  try {
    const { gameId } = await request.json();

    if (!gameId) {
      return NextResponse.json({ error: 'Chyba' }, { status: 400 });
    }

    // Get current round
    const roundStmt = db.prepare(`
      SELECT * FROM rounds WHERE game_id = ? ORDER BY id DESC LIMIT 1
    `);

    let round = roundStmt.get(gameId);

    if (!round) {
      // Create first round
      const createRoundStmt = db.prepare(`
        INSERT INTO rounds (game_id, round_number, current_player_id)
        VALUES (?, ?, (SELECT player_id FROM game_players WHERE game_id = ? LIMIT 1))
        RETURNING *
      `);

      round = createRoundStmt.get(gameId, 1, gameId);
    }

    return NextResponse.json(round);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Chyba serveru' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { roundId, currentPlayerId } = await request.json();

    const updateStmt = db.prepare(`
      UPDATE rounds SET current_player_id = ? WHERE id = ?
    `);

    updateStmt.run(currentPlayerId, roundId);

    const stmt = db.prepare('SELECT * FROM rounds WHERE id = ?');
    const round = stmt.get(roundId);

    return NextResponse.json(round);
  } catch (error) {
    return NextResponse.json({ error: 'Chyba serveru' }, { status: 500 });
  }
}
