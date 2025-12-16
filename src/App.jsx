/**
 * Burner Chat - App Component
 * ============================
 * Main app component with routing setup
 */

import { Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import ChatRoom from './components/ChatRoom'

function App() {
    return (
        <div className="min-h-screen bg-hacker-bg grid-pattern">
            <Routes>
                {/* Landing page - create or join rooms */}
                <Route path="/" element={<LandingPage />} />

                {/* Chat room - dynamic route with room ID */}
                <Route path="/chat/:roomId" element={<ChatRoom />} />
            </Routes>
        </div>
    )
}

export default App
