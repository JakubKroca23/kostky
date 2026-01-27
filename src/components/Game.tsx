import { useEffect, useState } from 'react';
import { Scene } from './Scene';
import { socket } from '../socket';

export function Game({ roomId }: { roomId: string, username: string }) {
    const [gameState, setGameState] = useState<any>(null);
    const [lastRollForces, setLastRollForces] = useState<number[][] | null>(null);
    const [, setMyResults] = useState<Record<number, number>>({});

    // Audio effects could go here

    useEffect(() => {
        socket.on('update-game-state', (state) => {
            setGameState(state);
        });

        socket.on('player-rolled', ({ forces }) => {
            setMyResults({}); // Reset local results
            setLastRollForces(forces); // Trigger physics in Scene
        });

        return () => {
            socket.off('update-game-state');
            socket.off('player-rolled');
        };
    }, []);

    const handleRoll = () => {
        // Generate random forces for 6 dice
        const forces = Array(6).fill(0).map(() => [
            (Math.random() - 0.5) * 15, // x
            10 + Math.random() * 10,    // y (up)
            (Math.random() - 0.5) * 15  // z
        ]);
        socket.emit('roll-dice', { roomId, forces });
    };

    // Collect results from physics simulation
    const handleDieStop = (id: number, value: number) => {
        setMyResults(prev => {
            const newRes = { ...prev, [id]: value };
            // If all 6 dice stopped, send to server
            if (Object.keys(newRes).length === 6) {
                const total = Object.values(newRes).reduce((a, b) => a + b, 0);
                socket.emit('dice-result', { roomId, results: total });
            }
            return newRes;
        });
    };

    return (
        <div className="relative w-full h-full bg-gray-900">
            {/* 3D Scene */}
            <div className="absolute inset-0 z-0">
                <Scene rollForces={lastRollForces} onDiceResult={handleDieStop} />
            </div>

            {/* HUD */}
            <div className="absolute inset-0 z-10 pointer-events-none p-6 flex flex-col justify-between">
                {/* Top Bar */}
                <div className="flex justify-between items-start">
                    <div className="bg-gray-800/80 backdrop-blur p-4 rounded-xl border border-gray-700">
                        <h2 className="text-xl font-bold text-blue-400">Room: {roomId}</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-gray-300 text-sm">Online</span>
                        </div>
                    </div>

                    {/* Players List */}
                    <div className="bg-gray-800/80 backdrop-blur p-4 rounded-xl border border-gray-700 max-w-xs pointer-events-auto">
                        <h3 className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-3">Players</h3>
                        <div className="space-y-3">
                            {gameState && Object.values(gameState.players).map((p: any) => (
                                <div key={p.id} className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-lg"
                                            style={{ backgroundColor: p.color }}>
                                            {p.username[0].toUpperCase()}
                                        </div>
                                        <span className="font-medium text-gray-200">{p.username}</span>
                                    </div>
                                    <div className="text-xl font-bold text-yellow-500">
                                        {gameState.rolls[p.id] || '-'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Controls */}
                <div className="flex justify-center pointer-events-auto pb-8">
                    <button
                        onClick={handleRoll}
                        className="px-12 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full font-black text-2xl shadow-lg hover:scale-110 active:scale-95 transition-transform border-4 border-yellow-300/30 text-white uppercase tracking-widest"
                    >
                        ROLL DICE
                    </button>
                </div>
            </div>
        </div>
    );
}
