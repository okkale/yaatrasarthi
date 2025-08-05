import React from 'react'
import { useNavigate } from 'react-router-dom'

interface BookingConfirmationProps {
  booking: {
    _id: string
    bookingToken: string
    monumentId: {
      name: string
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
    qrCodeUrl?: string
    status: string
    expiryDate: string
  }
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ booking }) => {
  const navigate = useNavigate()
  const handleDownloadTicket = () => {
    // Create a printable version of the ticket
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>YaatraSarthi - Booking Confirmation</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .ticket { border: 2px solid #000; padding: 20px; max-width: 600px; margin: 0 auto; }
              .header { text-align: center; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
              .qr-section { text-align: center; margin: 20px 0; }
              .details { margin: 20px 0; }
              .token { font-weight: bold; font-size: 18px; letter-spacing: 2px; }
            </style>
          </head>
          <body>
            <div class="ticket">
              <div class="header">
                <h1>YaatraSarthi</h1>
                <h2>Booking Confirmation</h2>
              </div>
              <div class="details">
                <p><strong>Monument:</strong> ${booking.monumentId.name}</p>
                <p><strong>Location:</strong> ${booking.monumentId.location.city}, ${booking.monumentId.location.state}</p>
                <p><strong>Visit Date:</strong> ${new Date(booking.visitDate).toLocaleDateString()}</p>
                <p><strong>Guests:</strong> ${booking.numberOfAdults} Adults, ${booking.numberOfChildren} Children, ${booking.numberOfForeigners} Foreigners</p>
                <p><strong>Total Amount:</strong> ₹${booking.totalAmount}</p>
                <p><strong>Booking Token:</strong> <span class="token">${booking.bookingToken}</span></p>
                <p><strong>Status:</strong> ${booking.status.toUpperCase()}</p>
                <p><strong>Valid Until:</strong> ${new Date(booking.expiryDate).toLocaleDateString()}</p>
              </div>
              ${booking.qrCodeUrl ? `
                <div class="qr-section">
                  <p><strong>Scan QR Code for Verification:</strong></p>
                  <img src="${booking.qrCodeUrl}" alt="QR Code" style="width: 200px; height: 200px;" />
                </div>
              ` : ''}
              <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #666;">
                <p>Please present this ticket along with a valid ID at the monument entrance.</p>
                <p>This ticket is valid only for the specified date and cannot be transferred.</p>
              </div>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
        <h2 className="text-2xl font-bold text-white">Booking Confirmed! 🎉</h2>
        <p className="text-primary-100">Your ticket has been generated successfully</p>
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Booking Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Booking Details</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Monument:</span>
                <span className="font-medium">{booking.monumentId.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{booking.monumentId.location.city}, {booking.monumentId.location.state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Visit Date:</span>
                <span className="font-medium">{new Date(booking.visitDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Adults:</span>
                <span className="font-medium">{booking.numberOfAdults}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Children:</span>
                <span className="font-medium">{booking.numberOfChildren}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Foreigners:</span>
                <span className="font-medium">{booking.numberOfForeigners}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600 font-semibold">Total Amount:</span>
                <span className="font-bold text-lg">₹{booking.totalAmount}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Booking Token</h4>
              <div className="font-mono text-lg font-bold text-primary-600 tracking-wider">
                {booking.bookingToken}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Present this token at the monument entrance
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-green-800 font-semibold">Status:</span>
                <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-medium">
                  {booking.status.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Valid until: {new Date(booking.expiryDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* QR Code */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Digital Ticket</h3>
            
            {booking.qrCodeUrl ? (
              <div className="space-y-4">
                <div className="bg-white p-4 border-2 border-gray-200 rounded-lg inline-block">
                  <img 
                    src={booking.qrCodeUrl} 
                    alt="Booking QR Code" 
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Scan this QR code for instant verification
                </p>
              </div>
            ) : (
              <div className="bg-gray-100 p-8 rounded-lg">
                <p className="text-gray-500">QR Code generation in progress...</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleDownloadTicket}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            📄 Download Ticket
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            📋 View All Bookings
          </button>
        </div>

        {/* Important Notice */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">📋 Important Instructions</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Present this ticket and a valid photo ID at the monument entrance</li>
            <li>• This ticket is valid only for the specified date and time</li>
            <li>• Ticket cannot be transferred or refunded</li>
            <li>• Arrive at least 30 minutes before your scheduled visit time</li>
            <li>• Keep your booking token safe for verification purposes</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default BookingConfirmation
