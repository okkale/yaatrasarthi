import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

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
      const response = await axios.get('/api/monuments?limit=6')
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
          <Link to="/" className="block w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-all">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </Link>
          <Link to="/explore" className="block w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-all">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
            </svg>
          </Link>
          <Link to="/dashboard" className="block w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-all">
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