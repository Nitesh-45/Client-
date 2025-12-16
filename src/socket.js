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
 * - reconnectionAttempts: 5 - Try 5 times before giving up
 * - reconnectionDelay: 1000 - Wait 1 second between attempts
 */
const socket = io(SOCKET_SERVER_URL, {
    autoConnect: false,        // Don't connect immediately - we'll connect when joining a room
    reconnection: true,        // Enable automatic reconnection
    reconnectionAttempts: 5,   // Number of reconnection attempts
    reconnectionDelay: 1000,   // Delay between attempts (ms)
    timeout: 10000,            // Connection timeout (ms)
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
});

socket.on('reconnect', (attemptNumber) => {
    console.log('🔄 Reconnected after', attemptNumber, 'attempts');
});

socket.on('reconnect_error', (error) => {
    console.error('❌ Reconnection error:', error.message);
});

export default socket;
