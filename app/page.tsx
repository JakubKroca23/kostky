'use client';

import { LobbyContent } from '@/components/LobbyContent';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-[#1f2937] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Hra Kostky</h1>
          <p className="text-xl text-muted">Kombinační hra se 6 kostkami pro více hráčů</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <LobbyContent />
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="text-4xl mb-2">🎲</div>
            <h3 className="font-bold mb-2">Kombinace</h3>
            <p className="text-sm text-muted">Páry, trojice, postupky a další kombinace</p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-2">👥</div>
            <h3 className="font-bold mb-2">Multiplayer</h3>
            <p className="text-sm text-muted">Hrajte s přáteli a AI hráči</p>
          </div>
          <a href="/leaderboard" className="card text-center hover:border-primary transition-colors">
            <div className="text-4xl mb-2">📊</div>
            <h3 className="font-bold mb-2">Žebřřiček</h3>
            <p className="text-sm text-muted">Sledujte statistiky a vítěze</p>
          </a>
        </div>
      </div>
    </main>
  );
}
