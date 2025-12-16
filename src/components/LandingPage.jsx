/**
 * Landing Page Component
 * =======================
 * Homepage with options to create a new room or join an existing one.
 * Features a dark "hacker" aesthetic with neon green accents.
 * FULLY RESPONSIVE for mobile, tablet, and desktop.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function LandingPage() {
    const navigate = useNavigate();
    const [joinRoomId, setJoinRoomId] = useState('');
    const [error, setError] = useState('');

    /**
     * Create a new room with a random UUID and navigate to it
     */
    const handleCreateRoom = () => {
        const roomId = uuidv4().split('-')[0]; // Use first segment for shorter URL
        navigate(`/chat/${roomId}`);
    };

    /**
     * Join an existing room by ID
     */
    const handleJoinRoom = (e) => {
        e.preventDefault();
        if (!joinRoomId.trim()) {
            setError('Please enter a room ID');
            return;
        }
        setError('');
        navigate(`/chat/${joinRoomId.trim()}`);
    };

    return (
        <div className="min-h-screen min-h-[100dvh] flex flex-col items-center justify-center p-4 sm:p-6 safe-area-top safe-area-bottom">
            {/* Main Container - responsive max width */}
            <div className="w-full max-w-sm sm:max-w-md space-y-6 sm:space-y-8 animate-fadeIn">

                {/* Logo / Branding */}
                <div className="text-center space-y-3 sm:space-y-4">
                    {/* Animated fire icon - responsive size */}
                    <div className="text-5xl sm:text-6xl md:text-7xl mb-2 sm:mb-4 animate-pulse-slow">🔥</div>

                    {/* Title with glow effect - responsive text */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-glow gradient-text">
                        Burner Chat
                    </h1>

                    {/* Tagline - responsive text */}
                    <p className="text-gray-400 text-base sm:text-lg">
                        Anonymous. Ephemeral. <span className="text-neon-green">Untraceable.</span>
                    </p>

                    {/* Terminal-style subtitle - hide on very small screens */}
                    <div className="font-mono text-xs sm:text-sm text-gray-500 mt-2 sm:mt-4 hidden xs:block">
                        <span className="text-neon-green">$</span> Messages vanish when you leave
                        <span className="cursor-blink"></span>
                    </div>
                </div>

                {/* Create Room Button */}
                <div className="card-hacker space-y-4 sm:space-y-6">
                    <button
                        onClick={handleCreateRoom}
                        className="btn-neon w-full text-base sm:text-lg py-3 sm:py-4 animate-glow touch-spacing"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M12 4v16m8-8H4" />
                            </svg>
                            Create New Room
                        </span>
                    </button>

                    <p className="text-center text-gray-500 text-xs sm:text-sm">
                        Generate a unique link to share with others
                    </p>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex-1 h-px bg-hacker-border"></div>
                    <span className="text-gray-500 text-xs sm:text-sm font-mono">OR</span>
                    <div className="flex-1 h-px bg-hacker-border"></div>
                </div>

                {/* Join Room Form */}
                <div className="card-hacker">
                    <form onSubmit={handleJoinRoom} className="space-y-3 sm:space-y-4">
                        <div>
                            <label htmlFor="roomId" className="block text-xs sm:text-sm text-gray-400 mb-2">
                                Join Existing Room
                            </label>
                            <input
                                type="text"
                                id="roomId"
                                value={joinRoomId}
                                onChange={(e) => setJoinRoomId(e.target.value)}
                                placeholder="Enter room ID..."
                                className="input-hacker touch-spacing"
                                autoComplete="off"
                            />
                            {error && (
                                <p className="text-red-400 text-xs sm:text-sm mt-2">{error}</p>
                            )}
                        </div>

                        <button type="submit" className="btn-ghost w-full touch-spacing">
                            <span className="flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                                </svg>
                                Join Room
                            </span>
                        </button>
                    </form>
                </div>

                {/* Features Grid - responsive */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2 sm:pt-4">
                    <div className="text-center p-2">
                        <div className="text-xl sm:text-2xl mb-1 sm:mb-2">🔒</div>
                        <p className="text-[10px] sm:text-xs text-gray-500">No Login</p>
                    </div>
                    <div className="text-center p-2">
                        <div className="text-xl sm:text-2xl mb-1 sm:mb-2">💨</div>
                        <p className="text-[10px] sm:text-xs text-gray-500">Ephemeral</p>
                    </div>
                    <div className="text-center p-2">
                        <div className="text-xl sm:text-2xl mb-1 sm:mb-2">👻</div>
                        <p className="text-[10px] sm:text-xs text-gray-500">Anonymous</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-[10px] sm:text-xs text-gray-600 pt-2 sm:pt-4 pb-4">
                    <p>No data stored. No cookies. No trace.</p>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
