import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar: React.FC = () => {
  const { user } = useAuth()
  const location = useLocation()

  if (location.pathname === '/auth') {
    return null
  }

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-white font-semibold' : 'text-white hover:text-primary-600'
  }

  return (
    <nav className="bg-black bg-opacity-30 shadow-lg sticky top-0 z-50">
      <div className="max-w-8x1 mx-auto px-0 sm:px-0 lg:px-0">
        <div className="flex items-center h-16 justify-between">
          <div className="flex items-center justify-start ml-10 ">
            <Link to="/" className="text-3xl font-bold text-white font-squada ">
              YaatraSarthi
            </Link>
          </div>

          <div className="hidden md:flex ml-auto items-center space-x-8 mr-10 ">
            <div className="flex items-baseline space-x-8  ">
              {user && (
                <>
                  {/* <Link to="/" className={`px-3 py-2 text-sm font-medium transition-colors ${isActive('/')}`}>
                    Home
                  </Link>
                  <Link to="/explore" className={`px-3 py-2 text-sm font-medium transition-colors ${isActive('/explore')}`}>
                    Explore
                  </Link> */}
                </>
              )}
              {!user && (
                <Link to="/auth" className={`px-3 py-2 text-sm font-medium transition-colors ${isActive('/auth')}`}>
                  Login / Signup
                </Link>
              )}
            </div>

            {user ? (
              <Link to="/dashboard" className={`px-3 py-2 text-sm font-medium transition-colors ${isActive('/dashboard')}`}>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                </div>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
