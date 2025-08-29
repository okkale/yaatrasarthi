import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/AuthContext'
import LoginSignup from './pages/LoginSignup'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Booking from './pages/Booking'
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar'
import Monuments from './pages/Monuments'
import AIChat from './components/bot'
import botIcon from './Assets/bot.png'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return user ? <>{children}</> : <Navigate to="/auth" />
}

const AppContent: React.FC = () => {
  const { user } = useAuth()
  const location = useLocation()
  const [isChatOpen, setIsChatOpen] = React.useState(false)
  const [currentLanguage, setCurrentLanguage] = React.useState('en')

  return (
    <div className="min-h-screen bg-gray-50">
      {!(location.pathname === '/dashboard' || location.pathname.startsWith('/booking')) && <Navbar />}
      <Routes>
        <Route path="/auth" element={!user ? <LoginSignup /> : <Navigate to="/" />} />
        <Route path="/" element={<Home />} />
        <Route path="/monuments" element={<Monuments />} />
        <Route path="/explore" element={
          <ProtectedRoute>
            <Explore />
          </ProtectedRoute>
        } />
        <Route path="/booking/:monumentId" element={
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* AI Chatbot */}
      <AIChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentLanguage={currentLanguage}
      />

      {/* Chatbot Toggle Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-40 flex items-center justify-center group"
        >
          <img src={botIcon} alt="AI Chat Bot" className="h-8 w-8" />
          <div className="absolute right-full mr-3 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Chat with YatraBuddy
          </div>
        </button>
      )}
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App
