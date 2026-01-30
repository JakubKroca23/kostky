import { useEffect, useState } from 'react';
import { Scene } from './Scene';
import { socket } from '../socket';

export function Game({ roomId }: { roomId: string, username: string }) {
    const [gameState, setGameState] = useState<any>(null);
    const [rolling, setRolling] = useState(false);
    const [lastResults, setLastResults] = useState<number[] | null>(null);

    useEffect(() => {
        socket.on('update-game-state', (state) => {
            setGameState(state);
        });

        socket.on('player-rolled', ({ forces }) => {
            // In 2D, 'forces' is actually just our results array
            setRolling(true);
            setLastResults(forces);

            // Artificial delay to simulate rolling
            setTimeout(() => {
                setRolling(false);
                // If it was ME rolling, I report my final result to server
                // But in this logic, server broadcasts 'player-rolled' to everyone.
                // The emitter should be the one reporting the result to finalize.
            }, 1000);
        });

        return () => {
            socket.off('update-game-state');
            socket.off('player-rolled');
        };
    }, []);

    const handleRoll = () => {
        if (rolling) return;

        // Generate 6 random dice values
        const results = Array(6).fill(0).map(() => Math.floor(Math.random() * 6) + 1);

        // Use 'forces' key to keep server happy without changes
        socket.emit('roll-dice', { roomId, forces: results });

        // Report result to server (total)
        const total = results.reduce((a, b) => a + b, 0);
        setTimeout(() => {
            socket.emit('dice-result', { roomId, results: total });
        }, 1100);
    };

    return (
        <div className="relative w-full h-full bg-slate-950 overflow-hidden">
            {/* 2D Board */}
            <div className="absolute inset-0 z-0 flex items-center justify-center">
                <Scene results={lastResults} rolling={rolling} />
            </div>

            {/* HUD */}
            <div className="absolute inset-0 z-10 pointer-events-none p-6 flex flex-col justify-between">
                {/* Top Bar */}
                <div className="flex justify-between items-start">
                    <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-2xl">
                        <h2 className="text-2xl font-black bg-gradient-to-br from-blue-400 to-indigo-500 bg-clip-text text-transparent">ROOM: {roomId}</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Live Session</span>
                        </div>
                    </div>

                    {/* Players List */}
                    <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-2xl max-w-xs pointer-events-auto">
                        <h3 className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black mb-4">Board Leaderboard</h3>
                        <div className="space-y-4">
                            {gameState && Object.values(gameState.players).map((p: any) => (
                                <div key={p.id} className="flex items-center justify-between gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shadow-inner border border-white/10"
                                            style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}dd)` }}>
                                            {p.username[0].toUpperCase()}
                                        </div>
                                        <span className="font-bold text-slate-200 tracking-tight">{p.username}</span>
                                    </div>
                                    <div className="text-2xl font-black text-amber-500 drop-shadow-sm">
                                        {gameState.rolls[p.id] || '-'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Controls */}
                <div className="flex justify-center pointer-events-auto pb-12">
                    <button
                        disabled={rolling}
                        onClick={handleRoll}
                        className={`
                            px-16 py-5 rounded-2xl font-black text-2xl shadow-[0_20px_50px_rgba(245,158,11,0.3)] 
                            transition-all duration-300 uppercase tracking-[0.3em] text-white border-b-8
                            ${rolling
                                ? 'bg-slate-800 border-slate-900 scale-95 opacity-50 cursor-not-allowed'
                                : 'bg-gradient-to-b from-amber-400 to-orange-600 border-orange-800 hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-1'
                            }
                        `}
                    >
                        {rolling ? 'Rolling...' : 'Roll Dice'}
                    </button>
                </div>
            </div>
        </div>
    );
}
