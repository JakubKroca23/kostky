'use client';

import { useEffect, useState, useCallback } from 'react';

export function useGamePolling(gameCode: string | null, interval: number = 1000) {
  const [gameData, setGameData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGame = useCallback(async () => {
    if (!gameCode) return;

    try {
      const res = await fetch(`/api/games?code=${gameCode}`);
      if (!res.ok) throw new Error('Hra nenalezena');

      const data = await res.json();
      setGameData(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [gameCode]);

  useEffect(() => {
    fetchGame();
    const timer = setInterval(fetchGame, interval);

    return () => clearInterval(timer);
  }, [fetchGame, interval]);

  return { gameData, loading, error, refetch: fetchGame };
}
