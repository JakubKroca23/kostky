import React, { useState } from 'react';
import { supabase } from '../supabase';

interface LobbyProps {
    onJoin: (room: string, user: string) => void;
}

export function Lobby({ onJoin }: LobbyProps) {
    const [username, setUsername] = useState('');
    const [roomId, setRoomId] = useState('room1');

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim() && roomId.trim()) {
            // In Supabase, we join a channel and track presence
            const channel = supabase.channel(`room:${roomId}`, {
                config: {
                    presence: {
                        key: username,
                    },
                },
            });

            await channel.subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({
                        id: Math.random().toString(36).substr(2, 9),
                        username,
                        color: '#' + Math.floor(Math.random() * 16777215).toString(16),
                        online_at: new Date().toISOString(),
                    });
                    onJoin(roomId, username);
                }
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-white overflow-hidden relative">
            {/* Background elements for "premium" feel */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>

            <div className="z-10 flex flex-col items-center">
                <div className="mb-12 text-center">
                    <h1 className="text-7xl font-black mb-2 tracking-tighter bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
                        DICE MASTER
                    </h1>
                    <div className="px-4 py-1 bg-blue-600 rounded-full text-[10px] font-black tracking-[0.4em] uppercase inline-block shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                        2D EDITION
                    </div>
                </div>

                <form onSubmit={handleJoin} className="bg-slate-900/60 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl w-[400px] border border-white/10">
                    <div className="mb-6">
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-3 text-slate-500">Your Identity</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-5 py-4 bg-slate-800/50 border border-white/5 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg font-bold placeholder:text-slate-600"
                            placeholder="Enter username..."
                            required
                        />
                    </div>
                    <div className="mb-10">
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-3 text-slate-500">Battle Room</label>
                        <input
                            type="text"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            className="w-full px-5 py-4 bg-slate-800/50 border border-white/5 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg font-bold placeholder:text-slate-600"
                            placeholder="e.g. room1"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl font-black text-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)] border-b-4 border-blue-900"
                    >
                        START ROLLING
                    </button>
                </form>
            </div>
        </div>
    );
}


