import { NextRequest, NextResponse } from 'next/server';
import db, { initializeDb } from '@/lib/db';
import { calculateScore } from '@/lib/scoring';

initializeDb();

export async function POST(request: NextRequest) {
  try {
    const { roundId, playerId, diceValues } = await request.json();

    const result = calculateScore(diceValues);

    const rollStmt = db.prepare(`
      INSERT INTO rolls (round_id, player_id, dice_values, score, combination)
      VALUES (?, ?, ?, ?, ?)
      RETURNING *
    `);

    const roll = rollStmt.get(roundId, playerId, JSON.stringify(diceValues), result.score, result.combination);

    // Update player score in game
    const roundStmt = db.prepare('SELECT game_id FROM rounds WHERE id = ?');
    const round = roundStmt.get(roundId);

    const updateScoreStmt = db.prepare(`
      UPDATE game_players
      SET score = score + ?
      WHERE game_id = ? AND player_id = ?
    `);

    updateScoreStmt.run(result.score, round.game_id, playerId);

    return NextResponse.json(roll);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Chyba serveru' }, { status: 500 });
  }
}
