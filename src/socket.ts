import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_BACKEND_URL || 'https://kostky-zihg.onrender.com';

// Connect to backend server
export const socket = io(URL, {
    autoConnect: false // We connect manually when joining
});

