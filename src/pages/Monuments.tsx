import React, { useState, useEffect } from 'react'
import { monumentsAPI } from '../services/api'

const Monuments: React.FC = () => {
  const [monuments, setMonuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMonuments = async () => {
      try {
        setLoading(true)
        const response = await monumentsAPI.getAll({ limit: 6 })
        setMonuments(response.data)
        setError('')
      } catch (err) {
        console.error('Error fetching monuments:', err)
        setError('Failed to load monuments')
      } finally {
        setLoading(false)
      }
    }

    fetchMonuments()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="monuments-page">
      <h1>Pristine Destinations</h1>
      <div className="monuments-grid">
        {monuments.map((monument: any) => (
          <div key={monument._id} className="monument-card">
            <img src={monument.imageUrl} alt={monument.name} />
            <h3>{monument.name}</h3>
            <p>{monument.location.city}, {monument.location.state}</p>
            <p>{monument.description.substring(0, 100)}...</p>
            <p>From ₹{monument.ticketPrices.adult}</p>
            <button>Book Now</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Monuments