import cors from 'cors'

const allowedOrigins = [
  'http://localhost:3000',                    // Development frontend
  'https://yaatrasarthi.netlify.app',         // Your Netlify URL
  'https://yaatrasarthi.netlify.app'         // Replace with your actual Netlify URL
]

export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.log(`🚫 Blocked request from origin: ${origin}`)
      callback(new Error('Not allowed by CORS policy'), false)
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control'
  ],
  optionsSuccessStatus: 200
}

export const corsDebugMiddleware = (req: any, res: any, next: any) => {
  console.log(`Request origin: ${req.headers.origin || 'undefined'}`)
  if (!req.headers.origin) {
    console.log('No origin - allowing request')
  }
  next()
}