import { useEffect, useState, useRef } from 'react';
import { Scene } from './Scene';
import { supabase } from '../supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export function Game({ roomId, username }: { roomId: string, username: string }) {
    const [players, setPlayers] = useState<Record<string, any>>({});
    const [rolls, setRolls] = useState<Record<string, number>>({});
    const [rolling, setRolling] = useState(false);
    const [lastResults, setLastResults] = useState<number[] | null>(null);
    const channelRef = useRef<RealtimeChannel | null>(null);

    useEffect(() => {
        // Subscribe to public channel for the room
        const channel = supabase.channel(`room:${roomId}`, {
            config: {
                presence: {
                    key: username,
                },
            },
        });

        channelRef.current = channel;

        // Presence sync
        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                const formattedPlayers: Record<string, any> = {};

                Object.keys(state).forEach((key) => {
                    formattedPlayers[key] = state[key][0];
                });

                setPlayers(formattedPlayers);
            })
            // Broadcast listener for rolls
            .on('broadcast', { event: 'player-rolled' }, ({ payload }) => {
                const { forces } = payload;
                setRolling(true);
                setLastResults(forces);

                setTimeout(() => {
                    setRolling(false);
                }, 1000);
            })
            // Broadcast listener for final results
            .on('broadcast', { event: 'dice-result' }, ({ payload }) => {
                const { results, playerId } = payload;
                setRolls(prev => ({ ...prev, [playerId]: results }));
            })

            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [roomId, username]);

    const handleRoll = async () => {
        if (rolling || !channelRef.current) return;

        // Generate 6 random dice values
        const results = Array(6).fill(0).map(() => Math.floor(Math.random() * 6) + 1);

        // Broadcast rolling state
        await channelRef.current.send({
            type: 'broadcast',
            event: 'player-rolled',
            payload: { forces: results, playerId: username }
        });

        // Broadcast final result after delay
        const total = results.reduce((a, b) => a + b, 0);
        setTimeout(async () => {
            if (channelRef.current) {
                await channelRef.current.send({
                    type: 'broadcast',
                    event: 'dice-result',
                    payload: { results: total, playerId: username }
                });
            }
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
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Supabase Realtime</span>
                        </div>
                    </div>

                    {/* Players List */}
                    <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-2xl max-w-xs pointer-events-auto">
                        <h3 className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black mb-4">Board Leaderboard</h3>
                        <div className="space-y-4">
                            {Object.values(players).map((p: any) => (
                                <div key={p.username} className="flex items-center justify-between gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shadow-inner border border-white/10"
                                            style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}dd)` }}>
                                            {p.username[0].toUpperCase()}
                                        </div>
                                        <span className="font-bold text-slate-200 tracking-tight">
                                            {p.username} {p.username === username ? '(You)' : ''}
                                        </span>
                                    </div>
                                    <div className="text-2xl font-black text-amber-500 drop-shadow-sm">
                                        {rolls[p.username] || '-'}
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

