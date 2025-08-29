import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

// Load environment variables
// Uses .env file by default (standard dotenv behavior)
dotenv.config();

const validateEnvironment = () => {
    const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
    const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:', missing);
        console.error('💡 Please set the following environment variables:');
        missing.forEach(envVar => console.error(`   - ${envVar}`));
        console.error('📁 Create a .env.local file based on .env.example for local development');
        console.error('🌐 For production, set these variables in your deployment platform');
        process.exit(1);
    }

    // Validate MongoDB URI format
    if (process.env.MONGODB_URI && !process.env.MONGODB_URI.startsWith('mongodb')) {
        console.error('❌ Invalid MONGODB_URI format. Must start with "mongodb"');
        process.exit(1);
    }

    // Warn about weak JWT secret in production
    if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
        console.warn('⚠️  Warning: JWT_SECRET is shorter than 32 characters. Consider using a stronger secret for production.');
    }
};

// Validate environment variables
validateEnvironment();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(express.json());

// MongoDB connection with enhanced status logging
const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error('MONGODB_URI is required');

        console.log('🔄 Attempting to connect to MongoDB...');
        
        // MongoDB connection event listeners
        mongoose.connection.on('connecting', () => {
            console.log('🔄 Connecting to MongoDB...');
        });

        mongoose.connection.on('connected', () => {
            console.log('✅ MongoDB connected successfully!');
            console.log(`📍 Connected to: ${mongoose.connection.name}`);
        });

        mongoose.connection.on('error', (error) => {
            console.error('❌ MongoDB connection error:', error);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️  MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected');
        });

        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        // Validate initial database initialization after successful connection
        await initializeDatabaseStatus();

    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        process.exit(1);
    }
};

// Function to check and display database initialization status
const initializeDatabaseStatus = async () => {
    try {
        // Check if collections exist and have data
        if (mongoose.connection.db) {
            const collections = await mongoose.connection.db.listCollections().toArray();
            console.log('📊 Available collections:', collections.map(c => c.name));
        }

        // Database verification will be handled by initializeData function later
        console.log('🔍 Database initialization will be checked after schema setup...');
        
    } catch (error) {
        console.error('⚠️  Error checking database status:', error);
    }
};

// Call database connection
await connectDB();

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
});

const User = mongoose.model('User', userSchema, 'app_users');

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
});

const Monument = mongoose.model('Monument', monumentSchema, 'app_monuments');

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
    }
}, {
    timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema, 'app_bookings');

// Auth middleware
const authenticateToken = async (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};

// CORS configuration
const corsOptions = {
    origin: function (origin: any, callback: any) {
        const allowedOrigins = [
            'https://yaatrasarthi.netlify.app',
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
            'http://localhost:5173',
            'http://localhost:5000'
        ];

        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200,
    preflightContinue: false
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'YaatraSarthi API Server',
        status: 'Running',
        version: '1.0.0'
    });
});

// Auth routes
app.post('/api/auth/register', [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req: any, res: any) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/auth/login', [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').exists().withMessage('Password is required')
], async (req: any, res: any) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });

        res.json({
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// User routes
app.get('/api/user/me', authenticateToken, async (req: any, res: any) => {
    try {
        res.json(req.user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Monument routes
app.get('/api/monuments', async (req: any, res: any) => {
    try {
        const { limit, state, city, search } = req.query;
        let query: any = {};

        if (state) query = { ...query, 'location.state': state };
        if (city) query = { ...query, 'location.city': city };
        if (search) {
            query = {
                ...query,
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const monuments = await Monument.find(query)
            .limit(limit ? parseInt(limit as string) : 0)
            .sort({ createdAt: -1 });

        res.json(monuments);
    } catch (error) {
        console.error('Get monuments error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/monuments/:id', async (req: any, res: any) => {
    try {
        const monument = await Monument.findById(req.params.id);
        if (!monument) {
            return res.status(404).json({ message: 'Monument not found' });
        }
        res.json(monument);
    } catch (error) {
        console.error('Get monument error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        const { monumentId, visitDate, numberOfAdults, numberOfChildren, numberOfForeigners, totalAmount } = req.body;

        const monument = await Monument.findById(monumentId);
        if (!monument) {
            return res.status(404).json({ message: 'Monument not found' });
        }

        const booking = new Booking({
            userId: req.user._id,
            monumentId,
            visitDate: new Date(visitDate),
            numberOfAdults,
            numberOfChildren,
            numberOfForeigners,
            totalAmount
        });

        await booking.save();
        await booking.populate('monumentId');

        res.status(201).json({
            message: 'Booking created successfully',
            booking
        });
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/bookings/my-bookings', authenticateToken, async (req: any, res: any) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id })
            .populate('monumentId')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Initialize sample data
const initializeData = async () => {
    try {
        // Check MongoDB connection status
        if (mongoose.connection.readyState !== 1) {
            console.log('⚠️  MongoDB not connected, skipping data initialization');
            return;
        }

        console.log('🔍 Checking database for existing data...');

        const monumentCount = await Monument.countDocuments();
        console.log(`📊 Found ${monumentCount} monuments in database`);

        if (monumentCount === 0) {
            console.log('🚀 No monuments found, initializing sample data...');
            const sampleMonuments = [
                {
                    name: "Taj Mahal",
                    description: "The Taj Mahal is an ivory-white marble mausoleum on the right bank of the river Yamuna in the Indian city of Agra.",
                    location: { city: "Agra", state: "Uttar Pradesh" },
                    imageUrl: "https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800",
                    ticketPrices: { adult: 50, child: 25, foreigner: 1100 }
                },
                {
                    name: "Red Fort",
                    description: "The Red Fort is a historic fortified palace of the Mughal emperors of India located in Delhi.",
                    location: { city: "New Delhi", state: "Delhi" },
                    imageUrl: "https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=800",
                    ticketPrices: { adult: 35, child: 15, foreigner: 550 }
                }
            ];

            await Monument.insertMany(sampleMonuments);
            console.log('✅ Sample monuments added to database');
        } else {
            console.log('✅ Monuments already exist in database, skipping initialization');
        }

        const userCount = await User.countDocuments();
        const bookingCount = await Booking.countDocuments();
        console.log(`📊 Database status: ${userCount} users, ${bookingCount} bookings`);

    } catch (error) {
        console.error('❌ Error initializing data:', error);
    }
};

// Error handling middleware
app.use((error: any, req: any, res: any, next: any) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ message: 'Internal server error' });
});

// Start server
const startServer = async () => {
    try {
        // Initialize data after MongoDB connection is established
        await initializeData();

        app.listen(PORT, () => {
            console.log('=================================');
            console.log('🚀 YaatraSarthi Server Started');
            console.log('=================================');
            console.log(`🌐 Server running on port ${PORT}`);
            console.log(`🗄️  MongoDB: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}`);
            console.log(`🔑 JWT Secret: ${process.env.JWT_SECRET ? '✅ Configured' : '❌ Not set'}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`📍 Server URL: http://localhost:${PORT}`);
            console.log(`🏥 Health check: http://localhost:${PORT}/health`);
            console.log(`📡 API endpoints: http://localhost:${PORT}/api/monuments`);
            console.log('=================================');
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
