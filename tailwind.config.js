/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Custom "hacker" theme colors
                'neon': {
                    green: '#00ff00',
                    greenDark: '#00cc00',
                    greenGlow: 'rgba(0, 255, 0, 0.3)',
                },
                'hacker': {
                    bg: '#0a0a0a',
                    surface: '#111111',
                    card: '#1a1a1a',
                    border: '#2a2a2a',
                }
            },
            fontFamily: {
                'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
            },
            animation: {
                'glow': 'glow 2s ease-in-out infinite alternate',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'typing': 'typing 1s steps(3) infinite',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(0, 255, 0, 0.3), 0 0 10px rgba(0, 255, 0, 0.2)' },
                    '100%': { boxShadow: '0 0 10px rgba(0, 255, 0, 0.5), 0 0 20px rgba(0, 255, 0, 0.3)' },
                },
                typing: {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0 },
                }
            },
            boxShadow: {
                'neon': '0 0 10px rgba(0, 255, 0, 0.5), 0 0 20px rgba(0, 255, 0, 0.3), 0 0 30px rgba(0, 255, 0, 0.1)',
                'neon-lg': '0 0 20px rgba(0, 255, 0, 0.6), 0 0 40px rgba(0, 255, 0, 0.4), 0 0 60px rgba(0, 255, 0, 0.2)',
            }
        },
    },
    plugins: [],
}
