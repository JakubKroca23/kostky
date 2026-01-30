import { NextRequest, NextResponse } from 'next/server';
import db, { initializeDb } from '@/lib/db';
import { v4 as uuidv4 } from 'crypto';

initializeDb();

export async function POST(request: NextRequest) {
  try {
    const { playerIds } = await request.json();

    if (!playerIds || playerIds.length === 0) {
      return NextResponse.json({ error: 'Chyba' }, { status: 400 });
    }

    const gameCode = uuidv4().slice(0, 8).toUpperCase();

    const gameStmt = db.prepare(`
      INSERT INTO games (game_code, status) VALUES (?, ?)
      RETURNING *
    `);

    const game = gameStmt.get(gameCode, 'lobby');

    // Add players to game
    const gpStmt = db.prepare(`
      INSERT INTO game_players (game_id, player_id, score) VALUES (?, ?, 0)
    `);

    playerIds.forEach((id: number) => {
      gpStmt.run(game.id, id);
    });

    return NextResponse.json(game);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Chyba serveru' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameCode = searchParams.get('code');

    if (!gameCode) {
      return NextResponse.json({ error: 'Chyba' }, { status: 400 });
    }

    const gameStmt = db.prepare(`
      SELECT g.*, json_group_array(json_object('id', p.id, 'name', p.name, 'score', gp.score)) as players
      FROM games g
      LEFT JOIN game_players gp ON g.id = gp.game_id
      LEFT JOIN players p ON gp.player_id = p.id
      WHERE g.game_code = ?
      GROUP BY g.id
    `);

    const game = gameStmt.get(gameCode);
    if (!game) {
      return NextResponse.json({ error: 'Hra nenalezena' }, { status: 404 });
    }

    return NextResponse.json({
      ...game,
      players: JSON.parse(game.players || '[]')
    });
  } catch (error) {
    return NextResponse.json({ error: 'Chyba serveru' }, { status: 500 });
  }
}
