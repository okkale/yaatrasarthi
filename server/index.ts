import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import { nanoid } from 'nanoid'
import QRCode from 'qrcode'

// Load environment variables
dotenv.config()

const validateEnvironment = () => {
  const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET']
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar])
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing)
    console.error('Please set the following environment variables:')
    missing.forEach(envVar => console.error(`- ${envVar}`))
    process.exit(1)
  }
}

// Validate environment variables
validateEnvironment()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware - JSON parsing only (CORS configured later)
app.use(express.json())

// MongoDB connection
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI
    if (!uri) throw new Error('MONGODB_URI is required')

    console.log('Attempting to connect to MongoDB...')

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })

    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

// Call it after express setup
await connectDB()

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, {
  timestamps: true
})

const User = mongoose.model('User', userSchema, 'app_users')

// Monument Schema
const monumentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    }
  },
  imageUrl: {
    type: String,
    required: true
  },
  ticketPrices: {
    adult: {
      type: Number,
      required: true
    },
    child: {
      type: Number,
      required: true
    },
    foreigner: {
      type: Number,
      required: true
    }
  }
}, {
  timestamps: true
})

const Monument = mongoose.model('Monument', monumentSchema, 'app_monuments')

// Booking Schema
const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  monumentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Monument',
    required: true
  },
  visitDate: {
    type: Date,
    required: true
  },
  numberOfAdults: {
    type: Number,
    required: true,
    min: 0
  },
  numberOfChildren: {
    type: Number,
    required: true,
    min: 0
  },
  numberOfForeigners: {
    type: Number,
    required: true,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  // New fields for token system
  bookingToken: {
    type: String,
    unique: true,
    required: true,
    default: () => nanoid(12) // Generate 12-character unique token
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'expired'],
    default: 'confirmed'
  },
  qrCodeUrl: {
    type: String,
    default: null
  },
  expiryDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
})

const Booking = mongoose.model('Booking', bookingSchema, 'app_bookings')

// Auth middleware
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Access token required' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
    const user = await User.findById(decoded.userId).select('-password')
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' })
    }
    req.user = user
    next()
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' })
  }
}

// CORS configuration
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    const allowedOrigins = [
      'https://yaatrasarthi.netlify.app',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5000'
    ]
    
    console.log('Request origin:', origin)
    
    // Allow requests with no origin (like mobile apps, curl, or server-to-server requests)
    if (!origin) {
      console.log('No origin - allowing request')
      return callback(null, true)
    }
    
    if (allowedOrigins.includes(origin)) {
      console.log('Origin allowed:', origin)
      callback(null, true)
    } else {
      console.log('Origin blocked:', origin)
      console.log('Allowed origins:', allowedOrigins)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200,
  preflightContinue: false
}

// Apply CORS before all routes
app.use(cors(corsOptions))

// Handle preflight requests explicitly
app.options('*', cors(corsOptions))

// Request logging middleware
app.use((req: any, res: any, next: any) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.get('origin') || 'none'}`)
  next()
})

// Health check endpoint for deployment platforms
app.get('/health', (req: any, res: any) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  })
})

// Root endpoint
app.get('/', (req: any, res: any) => {
  res.json({ 
    message: 'YaatraSarthi API Server',
    status: 'Running',
    version: '1.0.0'
  })
})


// Auth routes
app.post('/api/auth/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg })
    }

    const { name, email, password } = req.body



    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword
    })

    await user.save()

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.post('/api/auth/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg })
    }

    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// User routes
app.get('/api/user/me', authenticateToken, async (req: any, res: any) => {
  try {
    res.json(req.user)
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Monument routes
app.get('/api/monuments', async (req: any, res: any) => {
  try {
    console.log('GET /api/monuments called with query:', req.query)
    const { limit, state, city, search } = req.query
    let query = {}

    if (state) {
      query = { ...query, 'location.state': state }
    }

    if (city) {
      query = { ...query, 'location.city': city }
    }

    if (search) {
      query = {
        ...query,
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      }
    }

    console.log('Monument query:', query)
    const monuments = await Monument.find(query)
      .limit(limit ? parseInt(limit) : 0)
      .sort({ createdAt: -1 })

    console.log('Found', monuments.length, 'monuments')
    res.json(monuments)
  } catch (error) {
    console.error('Get monuments error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.get('/api/monuments/:id', async (req: any, res: any) => {
  try {
    console.log('GET /api/monuments/:id called with id:', req.params.id)
    const monument = await Monument.findById(req.params.id)
    console.log('Found monument:', monument)
    if (!monument) {
      console.log('Monument not found for id:', req.params.id)
      return res.status(404).json({ message: 'Monument not found' })
    }
    res.json(monument)
  } catch (error) {
    console.error('Get monument error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Booking routes
app.post('/api/bookings', authenticateToken, [
  body('monumentId').isMongoId().withMessage('Invalid monument ID'),
  body('visitDate').isISO8601().withMessage('Invalid visit date'),
  body('numberOfAdults').isInt({ min: 1 }).withMessage('At least 1 adult required'),
  body('numberOfChildren').isInt({ min: 0 }).withMessage('Invalid number of children'),
  body('numberOfForeigners').isInt({ min: 0 }).withMessage('Invalid number of foreigners'),
  body('totalAmount').isFloat({ min: 0 }).withMessage('Invalid total amount')
], async (req: any, res: any) => {
  try {
    console.log('POST /api/bookings called with body:', req.body)
    console.log('User from token:', req.user)
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array())
      return res.status(400).json({ message: errors.array()[0].msg })
    }

    const { monumentId, visitDate, numberOfAdults, numberOfChildren, numberOfForeigners, totalAmount } = req.body

    // Verify monument exists
    const monument = await Monument.findById(monumentId)
    console.log('Found monument for booking:', monument)
    if (!monument) {
      console.log('Monument not found for booking:', monumentId)
      return res.status(404).json({ message: 'Monument not found' })
    }

    // Calculate expiry date (visit date + 1 day for flexibility)
    const visitDateObj = new Date(visitDate)
    const expiryDate = new Date(visitDateObj)
    expiryDate.setDate(expiryDate.getDate() + 1)

    // Create booking with token
    const booking = new Booking({
      userId: req.user._id,
      monumentId,
      visitDate: visitDateObj,
      numberOfAdults,
      numberOfChildren,
      numberOfForeigners,
      totalAmount,
      expiryDate
    })

    await booking.save()
    console.log('Booking saved with token:', booking.bookingToken)

    // Generate QR Code
    const qrData = {
      bookingId: booking._id,
      token: booking.bookingToken,
      monumentName: monument.name,
      visitDate: visitDate,
      totalAmount: totalAmount,
      guests: numberOfAdults + numberOfChildren + numberOfForeigners
    }

    try {
      // Generate QR code as data URL
      const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })

      // Update booking with QR code
      booking.qrCodeUrl = qrCodeDataUrl
      await booking.save()
      console.log('QR Code generated and saved for booking')
    } catch (qrError) {
      console.error('QR Code generation error:', qrError)
      // Continue without QR code if generation fails
    }

    // Populate monument data for response
    await booking.populate('monumentId')
    console.log('Booking populated with monument data')

    res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        ...booking.toObject(),
        bookingToken: booking.bookingToken,
        qrCodeUrl: booking.qrCodeUrl,
        status: booking.status,
        expiryDate: booking.expiryDate
      }
    })
  } catch (error) {
    console.error('Create booking error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.get('/api/bookings/my-bookings', authenticateToken, async (req: any, res: any) => {
  try {
    console.log('GET /api/bookings/my-bookings called for user:', req.user._id)
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('monumentId')
      .sort({ createdAt: -1 })

    console.log('Found', bookings.length, 'bookings for user')
    res.json(bookings)
  } catch (error) {
    console.error('Get bookings error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Token verification endpoint
app.get('/api/bookings/verify/:token', async (req: any, res: any) => {
  try {
    const { token } = req.params
    console.log('Verifying booking token:', token)

    const booking = await Booking.findOne({ bookingToken: token })
      .populate('monumentId')
      .populate('userId', 'name email')

    if (!booking) {
      return res.status(404).json({ 
        message: 'Invalid booking token',
        valid: false 
      })
    }

    // Check if booking is expired
    const now = new Date()
    const isExpired = now > booking.expiryDate

    // Check booking status
    const isValid = booking.status === 'confirmed' && !isExpired

    res.json({
      valid: isValid,
      booking: {
        id: booking._id,
        token: booking.bookingToken,
        monument: booking.monumentId,
        user: booking.userId,
        visitDate: booking.visitDate,
        guests: {
          adults: booking.numberOfAdults,
          children: booking.numberOfChildren,
          foreigners: booking.numberOfForeigners
        },
        totalAmount: booking.totalAmount,
        status: booking.status,
        expiryDate: booking.expiryDate,
        isExpired,
        bookingDate: booking.bookingDate
      },
      message: isValid ? 'Valid booking token' : 
               isExpired ? 'Booking token has expired' : 
               `Booking status: ${booking.status}`
    })
  } catch (error) {
    console.error('Token verification error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Get booking by token (for QR code scanning)
app.get('/api/bookings/token/:token', async (req: any, res: any) => {
  try {
    const { token } = req.params
    console.log('Getting booking by token:', token)

    const booking = await Booking.findOne({ bookingToken: token })
      .populate('monumentId')
      .populate('userId', 'name email')

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    res.json({
      booking: {
        ...booking.toObject(),
        qrCodeUrl: booking.qrCodeUrl
      }
    })
  } catch (error) {
    console.error('Get booking by token error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Initialize sample data
const initializeData = async () => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('MongoDB not connected, skipping data initialization')
      return
    }
    
    console.log('MongoDB connected successfully, checking for existing data...')
    
    // Check if collections exist and have data
    if (mongoose.connection.db) {
      const collections = await mongoose.connection.db.listCollections().toArray()
      console.log('Available collections:', collections.map(c => c.name))
    } else {
      console.log('Database connection not available for listing collections')
    }
    
    const monumentCount = await Monument.countDocuments()
    console.log(`Found ${monumentCount} monuments in database`)
    
    if (monumentCount === 0) {
      console.log('No monuments found, initializing sample data...')
      const sampleMonuments = [
        {
          name: "Taj Mahal",
          description: "The Taj Mahal is an ivory-white marble mausoleum on the right bank of the river Yamuna in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favourite wife, Mumtaz Mahal.",
          location: { city: "Agra", state: "Uttar Pradesh" },
          imageUrl: "https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800",
          ticketPrices: { adult: 50, child: 25, foreigner: 1100 }
        },
        {
          name: "Red Fort",
          description: "The Red Fort is a historic walled city in Delhi, India, which served as the main residence of the Mughal Emperors for nearly 200 years, until 1856. It is located in the center of Delhi and houses a number of museums.",
          location: { city: "New Delhi", state: "Delhi" },
          imageUrl: "https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=800",
          ticketPrices: { adult: 35, child: 15, foreigner: 550 }
        },
        {
          name: "Gateway of India",
          description: "The Gateway of India is an arch-monument built in the early twentieth century in the city of Mumbai, in the Indian state of Maharashtra. It was erected to commemorate the landing of King George V and Queen Mary at Apollo Bunder.",
          location: { city: "Mumbai", state: "Maharashtra" },
          imageUrl: "https://images.pexels.com/photos/4321194/pexels-photo-4321194.jpeg?auto=compress&cs=tinysrgb&w=800",
          ticketPrices: { adult: 25, child: 10, foreigner: 300 }
        },
        {
          name: "Hawa Mahal",
          description: "Hawa Mahal is a palace in the city of Jaipur, India. Built from red and pink sandstone, it is on the edge of the City Palace, Jaipur, and extends to the Zenana, or women's chambers.",
          location: { city: "Jaipur", state: "Rajasthan" },
          imageUrl: "https://images.pexels.com/photos/3370598/pexels-photo-3370598.jpeg?auto=compress&cs=tinysrgb&w=800",
          ticketPrices: { adult: 50, child: 20, foreigner: 200 }
        },
        {
          name: "Mysore Palace",
          description: "Mysore Palace, also known as Amba Vilas Palace, is a historical palace and a royal residence at Mysore in the Indian State of Karnataka. It is the official residence of the Wadiyar dynasty.",
          location: { city: "Mysore", state: "Karnataka" },
          imageUrl: "https://images.pexels.com/photos/8847486/pexels-photo-8847486.jpeg?auto=compress&cs=tinysrgb&w=800",
          ticketPrices: { adult: 70, child: 30, foreigner: 200 }
        },
        {
          name: "Qutub Minar",
          description: "The Qutub Minar, also spelled Qutab Minar and Qutb Minar, is a minaret and victory tower that forms part of the Qutb complex, which lies at the site of Delhi's oldest fortified city, Lal Kot.",
          location: { city: "New Delhi", state: "Delhi" },
          imageUrl: "https://images.pexels.com/photos/12480794/pexels-photo-12480794.jpeg?auto=compress&cs=tinysrgb&w=800",
          ticketPrices: { adult: 30, child: 15, foreigner: 550 }
        }
      ]

      await Monument.insertMany(sampleMonuments)
      console.log('Sample monuments added to database')
    } else {
      console.log('Monuments already exist in database, skipping initialization')
    }
    
    // Also check users collection
    const userCount = await User.countDocuments()
    console.log(`Found ${userCount} users in database`)
    
    // Also check bookings collection
    const bookingCount = await Booking.countDocuments()
    console.log(`Found ${bookingCount} bookings in database`)
  } catch (error) {
    console.error('Error initializing data:', error instanceof Error ? error.message : 'Unknown error occurred')
    console.error('Full error:', error)
  }
}

// Error handling middleware
app.use((error: any, req: any, res: any, next: any) => {
  console.error('Unhandled error:', error)
  res.status(500).json({ message: 'Internal server error' })
})

// Start server and initialize data
const startServer = async () => {
  try {
    // Initialize data after MongoDB connection is established
    await initializeData()
    
    app.listen(PORT, () => {
      console.log('=== YaatraSarthi Server Started ===')
      console.log(`Server running on port ${PORT}`)
      console.log(`MongoDB URI: ${process.env.MONGODB_URI ? 'Set' : 'Not set'}`)
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log(`JWT Secret: ${process.env.JWT_SECRET ? 'Set' : 'Not set'}`)
      console.log(`Server URL: http://localhost:${PORT}`)
      console.log(`Health check: http://localhost:${PORT}/health`)
      console.log(`API endpoints: http://localhost:${PORT}/api/monuments`)
      console.log('===================================')
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()