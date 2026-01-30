'use client';

interface Player {
  id: number;
  name: string;
  is_ai: boolean;
}

interface PlayerListProps {
  players: Player[];
  onRemovePlayer?: (id: number) => void;
}

export function PlayerList({ players, onRemovePlayer }: PlayerListProps) {
  return (
    <div className="card space-y-3">
      <h3 className="text-xl font-bold">Hráči v herně ({players.length})</h3>
      <div className="space-y-2">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex items-center justify-between bg-[#0f1419] p-3 rounded-lg border border-[#374151]"
          >
            <span className="flex items-center gap-2">
              {player.is_ai && <span className="text-xs bg-accent-orange px-2 py-1 rounded">AI</span>}
              <span>{player.name}</span>
            </span>
            {onRemovePlayer && (
              <button
                onClick={() => onRemovePlayer(player.id)}
                className="text-accent-red hover:text-accent-red/80 text-sm"
              >
                Odebrat
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
