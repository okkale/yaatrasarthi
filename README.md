# YaatraSarthi - Historical Monument Ticket Booking Website

A full-stack web application for booking tickets to historical monuments in India, built with React, TypeScript, Node.js, Express, and MongoDB.

## Features

### Core Features
- **User Authentication**: Secure login/signup with JWT tokens
- **Monument Discovery**: Browse and search historical monuments
- **Ticket Booking**: Book tickets with date selection and visitor count
- **User Dashboard**: View profile and manage bookings
- **Responsive Design**: Works on all devices

### Design Elements
- **Modern UI**: Clean, professional design with Tailwind CSS
- **Interactive Elements**: Smooth animations and hover effects
- **Monument Galleries**: Beautiful image displays with cards
- **Intuitive Navigation**: Easy-to-use interface
- **Visual Feedback**: Loading states and form validations

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Vite** for development

### Backend
- **Node.js** with Express and TypeScript
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation

## Environment Setup

### Environment Variables

The application uses environment variables for configuration. Create the following files:

#### 1. `.env.example` (Template - included in repository)
```bash
# Copy this file to .env.local for local development

# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/yaatrasarthi

# JWT Configuration  
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production

# Client Configuration (for Vite)
VITE_API_URL=http://localhost:5000
```

#### 2. `.env.local` (Local Development - gitignored)
```bash
# YaatraSarthi Local Development Environment
# This file is gitignored - use for local development only

# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/yaatrasarthi

# JWT Configuration
JWT_SECRET=local-development-jwt-secret-key-change-this-in-production

# Client Configuration (for Vite)
VITE_API_URL=http://localhost:5000
```

### Required Environment Variables

#### Server-side (Backend)
- `MONGODB_URI`: MongoDB connection string (required)
- `JWT_SECRET`: JWT secret key for authentication (required)
- `PORT`: Server port (optional, defaults to 5000)
- `NODE_ENV`: Environment mode (development/production)

#### Client-side (Frontend)
- `VITE_API_URL`: API base URL for production deployments

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd yaatrasarthi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   - Update `MONGODB_URI` for your MongoDB instance
   - Change `JWT_SECRET` to a strong, unique value

4. **Database Setup**
   
   Ensure MongoDB is running locally, or update the `MONGODB_URI` in `.env.local` to point to your MongoDB Atlas cluster.

5. **Start the application**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000) concurrently.

6. **Access the application**
   
   Open your browser and navigate to `http://localhost:3000`

### Sample Data

The application automatically seeds the database with sample monuments when started for the first time, including:
- Taj Mahal
- Red Fort
- Gateway of India
- Hawa Mahal
- Mysore Palace
- Qutub Minar

## Deployment

### Backend Deployment (Render/Heroku)
Set these environment variables in your deployment platform:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Strong JWT secret key
- `PORT`: 10000 (Render) or 5000 (Heroku)
- `NODE_ENV`: production

### Frontend Deployment (Netlify/Vercel)
Set this environment variable:
- `VITE_API_URL`: URL of your deployed backend (e.g., https://your-backend.onrender.com)

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/user/me` - Get current user (protected)

### Monuments
- `GET /api/monuments` - Get all monuments (with filtering)
- `GET /api/monuments/:id` - Get specific monument

### Bookings
- `POST /api/bookings` - Create new booking (protected)
- `GET /api/bookings/my-bookings` - Get user's bookings (protected)

## Project Structure

```
yaatrasarthi/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── bot.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── pages/
│   │   ├── LoginSignup.tsx
│   │   ├── Home.tsx
│   │   ├── Explore.tsx
│   │   ├── Booking.tsx
│   │   ├── Monuments.tsx
│   │   └── Dashboard.tsx
│   ├── services/
│   │   └── api.ts
│   ├── config/
│   │   └── api.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── server/
│   └── index.ts
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── .env.example
├── .env.local (gitignored)
└── README.md
```

## Database Schemas

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed)
}
```

### Monument Schema
```javascript
{
  name: String (required),
  description: String (required),
  location: {
    city: String (required),
    state: String (required)
  },
  imageUrl: String (required),
  ticketPrices: {
    adult: Number (required),
    child: Number (required),
    foreigner: Number (required)
  }
}
```

### Booking Schema
```javascript
{
  userId: ObjectId (reference to User),
  monumentId: ObjectId (reference to Monument),
  visitDate: Date (required),
  numberOfAdults: Number (required),
  numberOfChildren: Number (required),
  numberOfForeigners: Number (required),
  totalAmount: Number (required),
  bookingDate: Date (default: now)
}
```

## Available Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run dev:server` - Start only the backend server
- `npm run build` - Build the frontend for production
- `npm run build:server` - Build the backend for production
- `npm start` - Start the production server
- `npm run preview` - Preview the production build

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the repository or contact the development team.
