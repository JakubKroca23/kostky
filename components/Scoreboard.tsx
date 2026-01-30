'use client';

interface GameScore {
  playerId: number;
  playerName: string;
  score: number;
  isAI: boolean;
  isCurrentPlayer: boolean;
}

interface ScoreboardProps {
  scores: GameScore[];
  gameCode?: string;
}

export function Scoreboard({ scores, gameCode }: ScoreboardProps) {
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Skóre</h2>
        {gameCode && <span className="text-xs text-muted bg-[#0f1419] px-3 py-1 rounded">Kód: {gameCode}</span>}
      </div>

      <div className="space-y-2">
        {sortedScores.map((entry, idx) => (
          <div
            key={entry.playerId}
            className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
              entry.isCurrentPlayer
                ? 'bg-primary/20 border-primary'
                : 'bg-[#0f1419] border-[#374151]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="font-bold text-muted w-6">{idx + 1}.</span>
              <span className="flex items-center gap-2">
                {entry.isAI && <span className="text-xs bg-accent-orange px-2 py-1 rounded">AI</span>}
                <span className={entry.isCurrentPlayer ? 'font-bold text-primary' : ''}>
                  {entry.playerName}
                </span>
              </span>
            </div>
            <span className="text-xl font-bold text-accent-green">{entry.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
