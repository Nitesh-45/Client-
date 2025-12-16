/**
 * Chat Room Component
 * ====================
 * Real-time chat room using Socket.io.
 * Handles joining rooms, sending/receiving messages, and user presence.
 * Users must enter a display name before joining the chat.
 * FULLY RESPONSIVE for mobile, tablet, and desktop.
 */

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '../socket';

function ChatRoom() {
    const { roomId } = useParams();
    const navigate = useNavigate();

    // State
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [username, setUsername] = useState('');
    const [inputUsername, setInputUsername] = useState(''); // For username input screen
    const [hasJoined, setHasJoined] = useState(false); // Track if user has entered name
    const [userCount, setUserCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [copied, setCopied] = useState(false);
    const [usernameError, setUsernameError] = useState('');

    // Refs
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const usernameInputRef = useRef(null);

    /**
     * Scroll to the bottom of messages
     */
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    /**
     * Copy room link to clipboard
     */
    const copyRoomLink = async () => {
        const link = window.location.href;
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    /**
     * Handle username submission and join room
     */
    const handleJoinWithUsername = (e) => {
        e.preventDefault();
        const trimmedName = inputUsername.trim();

        if (!trimmedName) {
            setUsernameError('Please enter your name');
            return;
        }

        if (trimmedName.length < 2) {
            setUsernameError('Name must be at least 2 characters');
            return;
        }

        if (trimmedName.length > 20) {
            setUsernameError('Name must be 20 characters or less');
            return;
        }

        // Set username and join
        setUsername(trimmedName);
        setUsernameError('');
        setHasJoined(true);

        // Connect and join room with custom username
        socket.connect();
    };

    /**
     * Handle sending a message
     */
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || !isConnected) return;

        // Emit message to server
        socket.emit('send_message', { message: inputMessage.trim() });

        // Clear input
        setInputMessage('');
        inputRef.current?.focus();
    };

    // ==========================================
    // SOCKET.IO CONNECTION & EVENT HANDLERS
    // ==========================================
    useEffect(() => {
        if (!hasJoined) return; // Don't connect until user has entered name

        // Join the room once connected
        socket.on('connect', () => {
            setIsConnected(true);
            // Send room ID and custom username to server
            socket.emit('join_room', { roomId, username });
        });

        // Handle receiving user count after joining
        socket.on('user_joined', (data) => {
            setUserCount(data.userCount);
        });

        // Handle user activity (join/leave notifications)
        socket.on('user_activity', (data) => {
            setUserCount(data.userCount);
            // Add system message
            setMessages((prev) => [...prev, {
                id: Date.now(),
                type: 'system',
                message: data.message
            }]);
        });

        // Handle receiving messages
        socket.on('receive_message', (message) => {
            setMessages((prev) => [...prev, {
                ...message,
                type: 'message',
                isOwn: message.senderId === socket.id
            }]);
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        // Cleanup on unmount
        return () => {
            socket.off('connect');
            socket.off('user_joined');
            socket.off('user_activity');
            socket.off('receive_message');
            socket.off('disconnect');
            socket.disconnect();
        };
    }, [roomId, hasJoined, username]);

    // Auto-scroll when new messages arrive
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Focus appropriate input on load
    useEffect(() => {
        if (hasJoined) {
            inputRef.current?.focus();
        } else {
            usernameInputRef.current?.focus();
        }
    }, [hasJoined, isConnected]);

    /**
     * Format timestamp for display
     */
    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // ==========================================
    // USERNAME ENTRY SCREEN
    // ==========================================
    if (!hasJoined) {
        return (
            <div className="min-h-screen min-h-[100dvh] flex flex-col items-center justify-center p-4 safe-area-top safe-area-bottom">
                <div className="w-full max-w-sm sm:max-w-md space-y-5 sm:space-y-6 animate-fadeIn">
                    {/* Room Info */}
                    <div className="text-center space-y-2">
                        <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🔥</div>
                        <h1 className="text-xl sm:text-2xl font-bold text-glow gradient-text">
                            Joining Room
                        </h1>
                        <p className="text-neon-green font-mono text-sm sm:text-lg break-all px-4">{roomId}</p>
                    </div>

                    {/* Username Form */}
                    <div className="card-hacker">
                        <form onSubmit={handleJoinWithUsername} className="space-y-4">
                            <div>
                                <label htmlFor="username" className="block text-xs sm:text-sm text-gray-400 mb-2">
                                    Enter your display name
                                </label>
                                <input
                                    ref={usernameInputRef}
                                    type="text"
                                    id="username"
                                    value={inputUsername}
                                    onChange={(e) => setInputUsername(e.target.value)}
                                    placeholder="Your name..."
                                    className="input-hacker text-base sm:text-lg touch-spacing"
                                    autoComplete="off"
                                    maxLength={20}
                                />
                                {usernameError && (
                                    <p className="text-red-400 text-xs sm:text-sm mt-2">{usernameError}</p>
                                )}
                                <p className="text-gray-600 text-[10px] sm:text-xs mt-2">
                                    This name will be visible to others in the chat
                                </p>
                            </div>

                            <button type="submit" className="btn-neon w-full text-base sm:text-lg py-3 animate-glow touch-spacing">
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                                    </svg>
                                    Join Chat
                                </span>
                            </button>
                        </form>
                    </div>

                    {/* Back link */}
                    <div className="text-center pb-4">
                        <button
                            onClick={() => navigate('/')}
                            className="text-gray-500 hover:text-neon-green transition-colors text-xs sm:text-sm p-2"
                        >
                            ← Back to home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ==========================================
    // MAIN CHAT INTERFACE
    // ==========================================
    return (
        <div className="h-screen h-[100dvh] flex flex-col safe-area-top">
            {/* Header - responsive */}
            <header className="bg-hacker-surface border-b border-hacker-border px-3 sm:px-4 py-2 sm:py-3 flex-shrink-0">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
                    {/* Back button + Room info */}
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                        <button
                            onClick={() => navigate('/')}
                            className="text-gray-400 hover:text-neon-green transition-colors p-1 flex-shrink-0"
                            title="Back to home"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>

                        <div className="min-w-0 flex-1">
                            <h1 className="text-sm sm:text-lg font-semibold text-neon-green flex items-center gap-1 sm:gap-2 truncate">
                                <span className="text-base sm:text-xl flex-shrink-0">🔥</span>
                                <span className="truncate">Room: {roomId}</span>
                            </h1>
                            <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-500">
                                <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0 ${isConnected ? 'bg-neon-green' : 'bg-red-500'}`}></span>
                                <span className="hidden xs:inline">{isConnected ? 'Connected' : 'Connecting...'}</span>
                                <span className="text-gray-600 hidden xs:inline">•</span>
                                <span>{userCount} online</span>
                            </div>
                        </div>
                    </div>

                    {/* Copy link button - responsive */}
                    <button
                        onClick={copyRoomLink}
                        className={`btn-ghost flex items-center gap-1 sm:gap-2 text-xs sm:text-sm flex-shrink-0 ${copied ? 'border-neon-green text-neon-green' : ''
                            }`}
                    >
                        {copied ? (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="hidden sm:inline">Copied!</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <span className="hidden sm:inline">Share</span>
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* Messages Area - responsive */}
            <main className="flex-1 overflow-y-auto p-3 sm:p-4">
                <div className="max-w-4xl mx-auto space-y-2 sm:space-y-3">
                    {/* Welcome message */}
                    {messages.length === 0 && (
                        <div className="text-center py-8 sm:py-12 animate-fadeIn">
                            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💬</div>
                            <p className="text-gray-500 text-sm sm:text-base">No messages yet</p>
                            <p className="text-gray-600 text-xs sm:text-sm mt-2">
                                Share this room link to start chatting!
                            </p>
                        </div>
                    )}

                    {/* Message list */}
                    {messages.map((msg) => (
                        <div key={msg.id} className="animate-slideUp">
                            {msg.type === 'system' ? (
                                // System message (join/leave)
                                <p className="message-system text-[10px] sm:text-xs">{msg.message}</p>
                            ) : (
                                // Regular message
                                <div className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                                    <div className={msg.isOwn ? 'message-own' : 'message-other'}>
                                        {/* Sender name (only for others' messages) */}
                                        {!msg.isOwn && (
                                            <p className="text-[10px] sm:text-xs text-neon-green font-semibold mb-0.5 sm:mb-1">
                                                {msg.sender}
                                            </p>
                                        )}
                                        {/* Message text */}
                                        <p className="text-xs sm:text-sm break-words">{msg.message}</p>
                                        {/* Timestamp */}
                                        <p className={`text-[10px] sm:text-xs mt-0.5 sm:mt-1 ${msg.isOwn ? 'text-neon-green/50' : 'text-gray-500'}`}>
                                            {formatTime(msg.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Scroll anchor */}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Message Input - responsive with safe area */}
            <footer className="bg-hacker-surface border-t border-hacker-border p-2 sm:p-4 flex-shrink-0 safe-area-bottom">
                <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
                    <div className="flex gap-2 sm:gap-3">
                        {/* Username badge - hide on mobile */}
                        {username && (
                            <div className="hidden md:flex items-center px-3 bg-hacker-card border border-hacker-border rounded-lg">
                                <span className="text-sm text-neon-green font-mono truncate max-w-[100px]">{username}</span>
                            </div>
                        )}

                        {/* Input field */}
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder={isConnected ? "Type a message..." : "Connecting..."}
                            disabled={!isConnected}
                            className="input-hacker flex-1 text-sm sm:text-base"
                            autoComplete="off"
                            maxLength={500}
                        />

                        {/* Send button */}
                        <button
                            type="submit"
                            disabled={!isConnected || !inputMessage.trim()}
                            className="btn-neon px-3 sm:px-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:shadow-none flex-shrink-0"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>

                    {/* Character count - responsive */}
                    <div className="flex justify-between mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-gray-600 px-1">
                        <span className="hidden xs:inline">Messages are ephemeral</span>
                        <span className="xs:hidden">Ephemeral chat</span>
                        <span>{inputMessage.length}/500</span>
                    </div>
                </form>
            </footer>
        </div>
    );
}

export default ChatRoom;
