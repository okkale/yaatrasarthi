import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { monumentsAPI } from '../services/api'

interface Monument {
  _id: string
  name: string
  description: string
  location: {
    city: string
    state: string
  }
  imageUrl: string
  ticketPrices: {
    adult: number
    child: number
    foreigner: number
  }
}

const Home: React.FC = () => {
  const [monuments, setMonuments] = useState<Monument[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPopularMonuments()
  }, [])

  const fetchPopularMonuments = async () => {
    try {
      const response = await monumentsAPI.getAll({ limit: 6 })
      setMonuments(response.data)
    } catch (error) {
      console.error('Error fetching monuments:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen -mt-16">
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop")'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            YaatraSarthi
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light max-w-3xl mx-auto leading-relaxed">
            Yaatrasarthi is your smart and reliable gateway to discovering India's most iconic heritage destinations. 
            From awe-inspiring forts and majestic palaces to ancient temples and world-renowned museums, 
            Yaatrasarthi makes exploring the past simple, seamless, and enriching.
          </p>
          <Link 
            to="/explore"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            EXPLORE NOW
          </Link>
        </div>

        {/* Floating Navigation Icons */}
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2 space-y-4">
          <Link to="/" className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-all">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </Link>
          <Link to="/explore" className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-all">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
            </svg>
          </Link>
          <Link to="/dashboard" className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-all">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Pristine Destinations Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Pristine Destinations
          </h2>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="relative">
              <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
{monuments.map((monument) => (
  <div
    key={monument._id}
    className="flex-none w-80 card transform hover:scale-105 transition-transform duration-300"
  >
    <div className="relative h-64 rounded-t-xl overflow-hidden">
      <img
        src={monument.imageUrl}
        alt={monument.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
    </div>
    <div className="p-6 bg-white text-gray-800">
      <h3 className="text-xl font-bold mb-2">{monument.name}</h3>
      <p className="text-gray-600 mb-2">
        {monument.location.city}, {monument.location.state}
      </p>
      <p className="text-sm text-gray-700 line-clamp-3 mb-4">
        {monument.description}
      </p>
      <div className="flex justify-between items-center">
        <span className="text-primary-600 font-semibold">
          From ₹{monument.ticketPrices.adult}
        </span>
        <Link
          to={`/booking/${monument._id}`}
          className="btn-primary text-sm"
        >
          Book Now
        </Link>
      </div>
    </div>
  </div>
))}
              </div>

              {/* Carousel indicators */}
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: Math.ceil(monuments.length / 3) }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-primary-600' : 'bg-gray-600'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-16 text-center max-w-4xl mx-auto">
            <p className="text-lg leading-relaxed text-gray-300">
              Yaatrasarthi is your smart and reliable gateway to discovering India's most iconic heritage destinations. 
              From awe-inspiring forts and majestic palaces to ancient temples and world-renowned museums, 
              Yaatrasarthi makes exploring the past simple, seamless, and enriching. Whether you're planning a 
              solo journey or a family outing, Yaatrasarthi helps you book tickets, get essential visitor information, 
              and explore handpicked places worth visiting — because every corner of India's cultural map has a story to tell. 
              With Yaatrasarthi, finding good places to visit becomes easier than ever. Browse curated heritage sites, 
              learn about their history, and secure your entry — all in just a few clicks.
            </p>
          </div>
        </div>
      </section>

      {/* Integration Bridge Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Bridge <span className="text-primary-600">All Your Apps</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Stop switching between multiple apps. Connect your existing travel tools and manage everything from one intelligent platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Google Maps Integration */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-700 hover:border-primary-500">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-full flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-600 text-white">
                  Connected
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Google Maps</h3>
              <p className="text-gray-300 text-sm mb-4">Navigate to monuments with real-time directions and traffic updates</p>
              <button className="w-full py-2 rounded-lg font-medium transition-all bg-primary-600 text-white hover:bg-primary-700">
                Manage
              </button>
            </div>

            {/* Calendar Integration */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-700 hover:border-primary-500">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-full flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                  </svg>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                  Available
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Google Calendar</h3>
              <p className="text-gray-300 text-sm mb-4">Sync your visit dates and get reminders for upcoming trips</p>
              <button className="w-full py-2 rounded-lg font-medium transition-all bg-primary-600 text-white hover:bg-primary-700">
                Connect
              </button>
            </div>

            {/* Weather Integration */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-700 hover:border-primary-500">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-full flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/>
                  </svg>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-600 text-white">
                  Connected
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Weather Forecast</h3>
              <p className="text-gray-300 text-sm mb-4">Get weather updates for your destination before you visit</p>
              <button className="w-full py-2 rounded-lg font-medium transition-all bg-primary-600 text-white hover:bg-primary-700">
                Manage
              </button>
            </div>

            {/* Photo Storage */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-700 hover:border-primary-500">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-full flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                  Available
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Google Photos</h3>
              <p className="text-gray-300 text-sm mb-4">Automatically backup and organize your monument photos</p>
              <button className="w-full py-2 rounded-lg font-medium transition-all bg-primary-600 text-white hover:bg-primary-700">
                Connect
              </button>
            </div>

            {/* Travel Expense Tracker */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-700 hover:border-primary-500">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-full flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                  Available
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Expense Tracker</h3>
              <p className="text-gray-300 text-sm mb-4">Track your travel expenses and get budget insights</p>
              <button className="w-full py-2 rounded-lg font-medium transition-all bg-primary-600 text-white hover:bg-primary-700">
                Connect
              </button>
            </div>

            {/* Social Media Sharing */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-700 hover:border-primary-500">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-full flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                  </svg>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-600 text-white">
                  Connected
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Social Sharing</h3>
              <p className="text-gray-300 text-sm mb-4">Share your experiences on social media platforms</p>
              <button className="w-full py-2 rounded-lg font-medium transition-all bg-primary-600 text-white hover:bg-primary-700">
                Manage
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">YaatraSarthi</h3>
              <p className="text-gray-400">
                Your gateway to India's magnificent heritage destinations.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/explore" className="hover:text-white transition-colors">Explore</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 YaatrasSarthi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home