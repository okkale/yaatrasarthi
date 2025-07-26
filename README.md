# MonumentPass - Historical Monument Ticket Booking Website

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

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd monumentpass
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   The `.env` file is already configured with default values:
   ```
   MONGODB_URI=mongodb://localhost:27017/monumentpass
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

   **Important**: Change the `JWT_SECRET` to a strong, unique value in production.

4. **Database Setup**
   
   Ensure MongoDB is running locally, or update the `MONGODB_URI` in `.env` to point to your MongoDB Atlas cluster.

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
monumentpass/
├── src/
│   ├── components/
│   │   └── Navbar.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── pages/
│   │   ├── LoginSignup.tsx
│   │   ├── Home.tsx
│   │   ├── Explore.tsx
│   │   ├── Booking.tsx
│   │   └── Dashboard.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── server/
│   └── index.ts
├── package.json
├── vite.config.ts
├── tailwind.config.js
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
- `npm run client` - Start only the frontend development server
- `npm run server` - Start only the backend server
- `npm run build` - Build the project for production
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