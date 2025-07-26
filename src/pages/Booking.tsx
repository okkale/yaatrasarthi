import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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

const Booking: React.FC = () => {
  const { monumentId } = useParams<{ monumentId: string }>()
  const navigate = useNavigate()
  
  const [monument, setMonument] = useState<Monument | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookingData, setBookingData] = useState({
    visitDate: '',
    numberOfAdults: 1,
    numberOfChildren: 0,
    numberOfForeigners: 0
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (monumentId) {
      fetchMonument()
    }
  }, [monumentId])

  const fetchMonument = async () => {
    try {
      const response = await axios.get(`/api/monuments/${monumentId}`)
      setMonument(response.data)
    } catch (error) {
      console.error('Error fetching monument:', error)
      navigate('/explore')
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = () => {
    if (!monument) return 0
    
    const adultTotal = bookingData.numberOfAdults * monument.ticketPrices.adult
    const childTotal = bookingData.numberOfChildren * monument.ticketPrices.child
    const foreignerTotal = bookingData.numberOfForeigners * monument.ticketPrices.foreigner
    
    return adultTotal + childTotal + foreignerTotal
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBookingData(prev => ({
      ...prev,
      [name]: name === 'visitDate' ? value : parseInt(value) || 0
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!monument) return
    
    setSubmitting(true)
    try {
      const totalAmount = calculateTotal()
      
      await axios.post('/api/bookings', {
        monumentId: monument._id,
        visitDate: bookingData.visitDate,
        numberOfAdults: bookingData.numberOfAdults,
        numberOfChildren: bookingData.numberOfChildren,
        numberOfForeigners: bookingData.numberOfForeigners,
        totalAmount
      })
      
      // Simulate successful booking
      alert('Booking successful! Redirecting to dashboard...')
      navigate('/dashboard')
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Booking failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!monument) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Monument not found</h2>
          <button
            onClick={() => navigate('/explore')}
            className="btn-primary"
          >
            Back to Explore
          </button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url("${monument.imageUrl}")`
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      
      <div className="relative z-10 py-8">
        <div className="max-w-8xl mx-100% px-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start ml-20 mr-20 py-8 ">
            {/* Left Side - Monument Info */}
            <div className="text-white">
              <div className="">
                <button
                  onClick={() => navigate('/explore')}
                  className="fixed top-4 left-4 text-white opacity-50 hover:opacity-75 transition-opacity duration-300 hover:text-primary-300 mb-4 flex items-center z-50 bg-black bg-opacity-0 backdrop-blur-lg rounded-md px-3 py-1"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Explore
                </button>
                
                <h1 className="text-4xl md:text-4xl font-bold   ">
                  {monument.name}
                </h1>
                <p className="text-xl mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  {monument.location.city}, {monument.location.state}
                </p>
                <p className="text-lg leading-relaxed mb-8">
                  {monument.description}
                </p>
                
                <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm shadow-lg ">
                  <h3 className="text-xl font-semibold mb-4">Ticket Prices</h3> 
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">₹{monument.ticketPrices.adult}</div>
                      <div className="text-sm">Adult</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">₹{monument.ticketPrices.child}</div>
                      <div className="text-sm">Child</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">₹{monument.ticketPrices.foreigner}</div>
                      <div className="text-sm">Foreigner</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Booking Form */}
            <div className="bg-white bg-opacity-95 rounded-2xl p-8 shadow-2xl backdrop-blur-sm ml-40">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Book Your Tickets Now!
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visit Date:
                  </label>
                  <input
                    type="date"
                    name="visitDate"
                    value={bookingData.visitDate}
                    onChange={handleInputChange}
                    min={getTomorrowDate()}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Adults:
                  </label>
                  <input
                    type="number"
                    name="numberOfAdults"
                    value={bookingData.numberOfAdults}
                    onChange={handleInputChange}
                    min="1"
                    max="20"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Children:
                  </label>
                  <input
                    type="number"
                    name="numberOfChildren"
                    value={bookingData.numberOfChildren}
                    onChange={handleInputChange}
                    min="0"
                    max="20"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Foreigners:
                  </label>
                  <input
                    type="number"
                    name="numberOfForeigners"
                    value={bookingData.numberOfForeigners}
                    onChange={handleInputChange}
                    min="0"
                    max="20"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="text-2xl font-bold text-primary-600">
                      ₹{calculateTotal()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    {bookingData.numberOfAdults > 0 && (
                      <div>Adults: {bookingData.numberOfAdults} × ₹{monument.ticketPrices.adult} = ₹{bookingData.numberOfAdults * monument.ticketPrices.adult}</div>
                    )}
                    {bookingData.numberOfChildren > 0 && (
                      <div>Children: {bookingData.numberOfChildren} × ₹{monument.ticketPrices.child} = ₹{bookingData.numberOfChildren * monument.ticketPrices.child}</div>
                    )}
                    {bookingData.numberOfForeigners > 0 && (
                      <div>Foreigners: {bookingData.numberOfForeigners} × ₹{monument.ticketPrices.foreigner} = ₹{bookingData.numberOfForeigners * monument.ticketPrices.foreigner}</div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || calculateTotal() === 0}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold py-4 px-6 rounded-lg text-lg transition-colors duration-200 flex items-center justify-center"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  ) : (
                    <>
                      Proceed to Payment
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Booking