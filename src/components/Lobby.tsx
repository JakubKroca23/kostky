import React, { useState } from 'react';
import { socket } from '../socket';

interface LobbyProps {
    onJoin: (room: string, user: string) => void;
}

export function Lobby({ onJoin }: LobbyProps) {
    const [username, setUsername] = useState('');
    const [roomId, setRoomId] = useState('room1');

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim() && roomId.trim()) {
            socket.auth = { username };
            socket.connect();
            socket.emit('join-room', { roomId, username });
            onJoin(roomId, username);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
            <h1 className="text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                Dice Master 3D
            </h1>
            <form onSubmit={handleJoin} className="bg-gray-800 p-8 rounded-xl shadow-2xl w-96 border border-gray-700">
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-gray-300">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="Enter your name"
                        required
                    />
                </div>
                <div className="mb-8">
                    <label className="block text-sm font-medium mb-2 text-gray-300">Room ID</label>
                    <input
                        type="text"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                        placeholder="e.g. room1"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-bold text-lg hover:opacity-90 transform transition hover:scale-105"
                >
                    Enter Game
                </button>
            </form>
        </div>
    );
}
