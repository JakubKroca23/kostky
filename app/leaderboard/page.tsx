'use client';

import { useState, useEffect } from 'react';

interface PlayerStats {
  id: number;
  name: string;
  wins: number;
  losses: number;
  total_score: number;
  avg_score: number;
  is_ai: boolean;
}

function LeaderboardContent() {
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'wins' | 'avg_score' | 'total_score'>('wins');

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const res = await fetch('/api/players');
      if (!res.ok) throw new Error('Chyba');

      const data = await res.json();
      setPlayers(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Chyba při načítání žebříčku:', error);
      setLoading(false);
    }
  };

  const sortedPlayers = [...players].sort((a, b) => {
    if (sortBy === 'wins') return b.wins - a.wins;
    if (sortBy === 'avg_score') return b.avg_score - a.avg_score;
    return b.total_score - a.total_score;
  });

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">Načítám žebřřiček...</p>
      </div>
    );
  }

  if (sortedPlayers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">Zatím žádní hráči. Vytvořte hru!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 justify-center flex-wrap">
        <button
          onClick={() => setSortBy('wins')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            sortBy === 'wins'
              ? 'bg-primary text-white'
              : 'bg-[#1f2937] text-foreground hover:bg-[#374151]'
          }`}
        >
          Vítězství
        </button>
        <button
          onClick={() => setSortBy('avg_score')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            sortBy === 'avg_score'
              ? 'bg-primary text-white'
              : 'bg-[#1f2937] text-foreground hover:bg-[#374151]'
          }`}
        >
          Průměr
        </button>
        <button
          onClick={() => setSortBy('total_score')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            sortBy === 'total_score'
              ? 'bg-primary text-white'
              : 'bg-[#1f2937] text-foreground hover:bg-[#374151]'
          }`}
        >
          Celkově
        </button>
      </div>

      <div className="space-y-3">
        {sortedPlayers.map((player, idx) => (
          <div
            key={player.id}
            className="card flex items-center justify-between hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full font-bold">
                {idx + 1}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  {player.is_ai && <span className="text-xs bg-accent-orange px-2 py-1 rounded">AI</span>}
                  <span className="font-bold">{player.name}</span>
                </div>
                <p className="text-sm text-muted">
                  {player.wins} vítězství, {player.losses} porážky
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">{Math.round(player.avg_score)}</p>
              <p className="text-xs text-muted">Ø bodů/hra</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-[#1f2937] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Žebřřiček</h1>
          <p className="text-xl text-muted">Celoživostní statistiky hráčů</p>
        </div>

        <div className="card mb-6">
          <LeaderboardContent />
        </div>

        <div className="text-center">
          <a href="/" className="text-primary hover:text-primary/80">
            ← Zpět do lobby
          </a>
        </div>
      </div>
    </main>
  );
}
