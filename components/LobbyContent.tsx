'use client';

import { useState, useEffect } from 'react';
import { PlayerInput } from '@/components/PlayerInput';
import { PlayerList } from '@/components/PlayerList';

interface Player {
  id: number;
  name: string;
  is_ai: boolean;
}

export function LobbyContent() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCode, setGameCode] = useState('');

  const handlePlayerAdded = (name: string) => {
    const newPlayer: Player = {
      id: Date.now(),
      name,
      is_ai: false,
    };
    setPlayers([...players, newPlayer]);
  };

  const handleAIAdded = () => {
    const aiIndex = players.filter(p => p.is_ai).length + 1;
    const newAI: Player = {
      id: Date.now() + Math.random(),
      name: `AI Hráč ${aiIndex}`,
      is_ai: true,
    };
    setPlayers([...players, newAI]);
  };

  const handleRemovePlayer = (id: number) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const handleStartGame = async () => {
    if (players.length < 2) {
      alert('Potřebujete alespoň 2 hráče');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerIds: players.map(p => p.id) }),
      });

      if (!res.ok) throw new Error('Chyba při vytváření hry');

      const game = await res.json();
      setGameCode(game.game_code);
      setGameStarted(true);
    } catch (error) {
      alert('Chyba při zahájení hry');
    } finally {
      setLoading(false);
    }
  };

  if (gameStarted) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Hra zahájená!</h2>
        <p className="text-xl">Kód hry: <span className="text-primary font-bold">{gameCode}</span></p>
        <a
          href={`/game?code=${gameCode}`}
          className="btn-primary inline-block mt-4"
        >
          Jít na hru
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PlayerInput
            onPlayerAdded={handlePlayerAdded}
            onAIAdded={handleAIAdded}
            playersCount={players.length}
          />
        </div>
        <div>
          <PlayerList players={players} onRemovePlayer={handleRemovePlayer} />
        </div>
      </div>

      <button
        onClick={handleStartGame}
        disabled={players.length < 2 || loading}
        className="btn-primary w-full py-4 text-lg disabled:opacity-50"
      >
        {loading ? 'Zahajuji hru...' : `Spustit hru (${players.length} hráčů)`}
      </button>
    </div>
  );
}
