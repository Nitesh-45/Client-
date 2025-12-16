/**
 * Socket.io Client Configuration
 * ===============================
 * Configures the socket connection to the backend server.
 * This file exports a socket instance that can be imported anywhere.
 */

import { io } from 'socket.io-client';

// ==========================================
// SOCKET.IO-CLIENT CONFIGURATION
// ==========================================

// Backend server URL - PRODUCTION (Render deployment)
const SOCKET_SERVER_URL = 'https://burner-chat-api-server.onrender.com';

/**
 * Create socket instance with configuration
 * 
 * Options explained:
 * - autoConnect: false - We manually connect when entering a chat room
 * - reconnection: true - Automatically try to reconnect if disconnected
 * - reconnectionAttempts: 10 - Try 10 times before giving up
 * - reconnectionDelay: 1000 - Wait 1 second between attempts
 * - transports: Start with polling, then upgrade to websocket (better for cloud hosting)
 */
const socket = io(SOCKET_SERVER_URL, {
    autoConnect: false,           // Don't connect immediately - we'll connect when joining a room
    reconnection: true,           // Enable automatic reconnection
    reconnectionAttempts: 10,     // Number of reconnection attempts
    reconnectionDelay: 1000,      // Delay between attempts (ms)
    reconnectionDelayMax: 5000,   // Max delay between attempts
    timeout: 20000,               // Connection timeout (ms) - increased for cold starts
    transports: ['polling', 'websocket'], // Start with polling, upgrade to websocket
});

// ==========================================
// CONNECTION EVENT LISTENERS (for debugging)
// ==========================================

socket.on('connect', () => {
    console.log('🔌 Connected to server:', socket.id);
});

socket.on('connect_error', (error) => {
    console.error('❌ Connection error:', error.message);
});

socket.on('disconnect', (reason) => {
    console.log('🔌 Disconnected:', reason);
    // If server disconnected us, try to reconnect
    if (reason === 'io server disconnect') {
        socket.connect();
    }
});

socket.on('reconnect', (attemptNumber) => {
    console.log('🔄 Reconnected after', attemptNumber, 'attempts');
});

socket.on('reconnect_error', (error) => {
    console.error('❌ Reconnection error:', error.message);
});

socket.on('reconnect_failed', () => {
    console.error('❌ Reconnection failed after all attempts');
});

export default socket;
