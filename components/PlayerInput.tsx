'use client';

import { useState } from 'react';

interface PlayerInputProps {
  onPlayerAdded: (name: string) => void;
  onAIAdded: () => void;
  playersCount: number;
}

export function PlayerInput({ onPlayerAdded, onAIAdded, playersCount }: PlayerInputProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Zadejte své jméno');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      onPlayerAdded(name);
      setName('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAI = async () => {
    const aiName = `AI Hráč ${playersCount}`;
    onAIAdded();
  };

  return (
    <form onSubmit={handleAddPlayer} className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Zadejte vaše jméno"
          className="flex-1 px-4 py-2 bg-[#1f2937] border border-[#374151] rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-primary"
          disabled={loading}
        />
        <button
          type="submit"
          className="btn-primary disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Přidávám...' : 'Přidat se'}
        </button>
      </div>

      {error && <p className="text-accent-red text-sm">{error}</p>}

      <button
        type="button"
        onClick={handleAddAI}
        className="btn-secondary w-full"
      >
        + Přidat AI hráče
      </button>
    </form>
  );
}
