'use client';

import { useState, useEffect } from 'react';
import { DiceRoller } from '@/components/DiceRoller';
import { Scoreboard } from '@/components/Scoreboard';
import { useGamePolling } from '@/hooks/useGamePolling';

interface Player {
  id: number;
  name: string;
  score: number;
  is_ai: boolean;
}

export default function GamePage() {
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);

  const { gameData, loading } = useGamePolling(gameCode, 2000);

  useEffect(() => {
    // Get game code from URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      setGameCode(code);
    }
  }, []);

  useEffect(() => {
    if (gameData && gameData.players) {
      const formattedPlayers: Player[] = gameData.players.map((p: any) => ({
        id: p.id,
        name: p.name,
        score: p.score || 0,
        is_ai: false,
      }));

      setPlayers(formattedPlayers);
    }
  }, [gameData]);

  const handleEndTurn = () => {
    const nextIdx = (currentPlayerIdx + 1) % players.length;
    setCurrentPlayerIdx(nextIdx);
    if (nextIdx === 0) {
      setRoundNumber(roundNumber + 1);
    }
  };

  if (loading || !gameCode) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-[#1f2937] py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted animate-fade-in">Načítám hru...</p>
        </div>
      </main>
    );
  }

  const scores = players.map((p, idx) => ({
    playerId: p.id,
    playerName: p.name,
    score: p.score,
    isAI: p.is_ai,
    isCurrentPlayer: idx === currentPlayerIdx,
  }));

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-[#1f2937] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 animate-slide-in-up">
          <h1 className="text-4xl font-bold mb-2">Hra Kostky</h1>
          <p className="text-muted">
            Kolo {roundNumber} • Na tahu: <span className="text-primary font-bold">{players[currentPlayerIdx]?.name}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 animate-slide-in-up">
            <DiceRoller />
          </div>
          <div className="space-y-6">
            <div className="animate-slide-in-up">
              <Scoreboard scores={scores} gameCode={gameCode} />
            </div>

            <button
              onClick={handleEndTurn}
              className="btn-secondary w-full animate-fade-in"
            >
              Konec tahu
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
