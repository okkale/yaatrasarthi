import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

interface Booking {
  _id: string
  monumentId: {
    _id: string
    name: string
    imageUrl: string
    location: {
      city: string
      state: string
    }
  }
  visitDate: string
  numberOfAdults: number
  numberOfChildren: number
  numberOfForeigners: number
  totalAmount: number
  bookingDate: string
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('profile')

  useEffect(() => {
    fetchBookings()
  }, [])

  // Determine API base URL based on environment
  const getApiBaseUrl = () => {
    // In production, use the environment variable VITE_API_URL
    // In development, use relative URLs (will be proxied)
    // @ts-ignore
    return import.meta.env.VITE_API_URL || '';
  };

  const apiBaseUrl = getApiBaseUrl();

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/bookings/my-bookings`)
      setBookings(response.data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getTotalTickets = (booking: Booking) => {
    return booking.numberOfAdults + booking.numberOfChildren + booking.numberOfForeigners
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center relative "
      style={{
      backgroundImage: 'url("https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop")'
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40  "></div>
      
      <div className="relative z-10 py-4 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 mt-0"> 
              <div className="bg-gray-900 bg-opacity-90 text-white rounded-2xl p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-8 text-center">Yaatra Sarthi</h2>
                
                <nav className="space-y-2 ">
                  <button
                    onClick={() => setActiveSection('profile')}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                      activeSection === 'profile' 
                        ? 'bg-primary-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    Dashboard
                  </button>
                  
                  <button
                    onClick={() => setActiveSection('bookings')}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                      activeSection === 'bookings' 
                        ? 'bg-primary-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                    </svg>
                    My Bookings
                  </button>
                  
                  <Link
                    to="/explore"
                    className="w-full flex items-center px-4 py-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" />
                    </svg>
                    Explore Destinations
                  </Link>
                  
                  <div className="w-full flex items-center px-4 py-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" />
                    </svg>
                    My Blogs
                  </div>
                  
                  <div className="w-full flex items-center px-4 py-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" />
                    </svg>
                    Feedback
                  </div>
                  
                  <button
                    onClick={logout}
                    className="w-full flex items-center px-4 py-3 rounded-lg transition-colors text-gray-300 hover:bg-red-600 hover:text-white mt-4"
                  >
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" />
                    </svg>
                    Logout
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3  mt-0  mb-0">
              <div className="bg-white bg-opacity-95 rounded-2xl p-8 backdrop-blur-sm">
                {activeSection === 'profile' && (
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">User Profile</h1>
                    
                    <div className="flex items-center mb-8">
                      <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-6">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                        <p className="text-gray-600">{user?.email}</p>
                        <button className="mt-2 text-primary-600 hover:text-primary-700 font-medium">
                          Edit Profile
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">My Bookings</h3>
                        <p className="text-gray-600 mb-4">View and manage your bookings</p>
                        <button
                          onClick={() => setActiveSection('bookings')}
                          className="btn-primary"
                        >
                          View Bookings
                        </button>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Explore Destinations</h3>
                        <p className="text-gray-600 mb-4">Browse and book heritage destinations</p>
                        <Link to="/explore" className="btn-primary">
                          Explore Now
                        </Link>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">My Blogs</h3>
                        <p className="text-gray-600 mb-4">Manage your blog posts</p>
                        <button className="btn-secondary">
                          Coming Soon
                        </button>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Feedback</h3>
                        <p className="text-gray-600 mb-4">Send your feedback or queries</p>
                        <button className="btn-secondary">
                          Coming Soon
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'bookings' && (
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>
                    
                    {loading ? (
                      <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                      </div>
                    ) : bookings.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">🎫</div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
                        <p className="text-gray-600 mb-6">Start exploring and book your first monument visit!</p>
                        <Link to="/explore" className="btn-primary">
                          Explore Monuments
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {bookings.map(booking => (
                          <div key={booking._id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start space-x-4">
                              <img
                                src={booking.monumentId.imageUrl}
                                alt={booking.monumentId.name}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                  {booking.monumentId.name}
                                </h3>
                                <p className="text-gray-600 mb-3 flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
                                  </svg>
                                  {booking.monumentId.location.city}, {booking.monumentId.location.state}
                                </p>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-500">Visit Date:</span>
                                    <div className="font-medium">{formatDate(booking.visitDate)}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Tickets:</span>
                                    <div className="font-medium">{getTotalTickets(booking)} tickets</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Total Amount:</span>
                                    <div className="font-medium text-primary-600">₹{booking.totalAmount}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Booked On:</span>
                                    <div className="font-medium">{formatDate(booking.bookingDate)}</div>
                                  </div>
                                </div>
                                
                                <div className="mt-3 text-xs text-gray-500">
                                  Adults: {booking.numberOfAdults} | Children: {booking.numberOfChildren} | Foreigners: {booking.numberOfForeigners}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard