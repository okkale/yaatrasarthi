import React, { useState, useEffect } from 'react'
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

const Explore: React.FC = () => {
  const [monuments, setMonuments] = useState<Monument[]>([])
  const [filteredMonuments, setFilteredMonuments] = useState<Monument[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  const states = [
    'Delhi', 'Maharashtra', 'Rajasthan', 'Uttar Pradesh', 'Karnataka',
    'Tamil Nadu', 'Gujarat', 'West Bengal', 'Kerala', 'Madhya Pradesh'
  ]

  const cities = [
    'New Delhi', 'Mumbai', 'Jaipur', 'Agra', 'Bangalore',
    'Chennai', 'Ahmedabad', 'Kolkata', 'Kochi', 'Bhopal'
  ]

  useEffect(() => {
    fetchMonuments()
  }, [])

  useEffect(() => {
    filterMonuments()
  }, [monuments, searchQuery, selectedState, selectedCity])

  const fetchMonuments = async () => {
    try {
      const response = await axios.get('/api/monuments')
      setMonuments(response.data)
    } catch (error) {
      console.error('Error fetching monuments:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterMonuments = () => {
    let filtered = monuments

    if (searchQuery) {
      filtered = filtered.filter(monument =>
        monument.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        monument.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedState) {
      filtered = filtered.filter(monument =>
        monument.location.state === selectedState
      )
    }

    if (selectedCity) {
      filtered = filtered.filter(monument =>
        monument.location.city === selectedCity
      )
    }

    setFilteredMonuments(filtered)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Monuments
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover India's magnificent heritage sites and book your tickets instantly
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search monuments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {filteredMonuments.length} monument{filteredMonuments.length !== 1 ? 's' : ''} found
              </h2>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedState('')
                  setSelectedCity('')
                }}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear Filters
              </button>
            </div>

            {filteredMonuments.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🏛️</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">No monuments found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredMonuments.map(monument => (
                  <div key={monument._id} className="card animate-fade-in">
                    <div className="relative h-64 rounded-t-xl overflow-hidden">
                      <img
                        src={monument.imageUrl}
                        alt={monument.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-semibold text-primary-600">
                        From ₹{monument.ticketPrices.adult}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {monument.name}
                      </h3>
                      <p className="text-gray-600 mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                        {monument.location.city}, {monument.location.state}
                      </p>
                      <p className="text-gray-700 text-sm mb-6 line-clamp-3">
                        {monument.description}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          <div>Adult: ₹{monument.ticketPrices.adult}</div>
                          <div>Child: ₹{monument.ticketPrices.child}</div>
                        </div>
                        <Link
                          to={`/booking/${monument._id}`}
                          className="btn-primary"
                        >
                          Book Now
                        </Link>
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
  )
}

export default Explore