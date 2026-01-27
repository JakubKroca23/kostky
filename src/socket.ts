import { io } from 'socket.io-client';

// Connect to backend server
export const socket = io('http://localhost:3001', {
    autoConnect: false // We connect manually when joining
});
