# YaatraSarthi - Quick Setup Guide

## 🚀 Quick Start (5 minutes)

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd yaatrasarthi
npm install
```

### 2. Setup Environment
```bash
# Copy the environment template
cp .env.example .env.local

# Edit with your favorite editor
# nano .env.local  or  code .env.local
```

### 3. Start MongoDB
Make sure MongoDB is running:
- **Local MongoDB**: Start MongoDB service
- **MongoDB Atlas**: Update `MONGODB_URI` in `.env.local`

### 4. Run the Application
```bash
npm run dev
```

### 5. Open in Browser
Navigate to: `http://localhost:3000`

## 🔧 Environment Variables Cheat Sheet

### For Local Development (.env.local)
```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/yaatrasarthi
JWT_SECRET=your-local-jwt-secret-here
VITE_API_URL=http://localhost:5000
```

### For Production (Render/Heroku)
```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/yaatrasarthi
JWT_SECRET=your-production-super-secure-jwt-secret
PORT=10000  # Render uses 10000
NODE_ENV=production
```

### For Frontend (Netlify/Vercel)
```bash
VITE_API_URL=https://your-backend.onrender.com
```

## 🐛 Common Issues & Solutions

### 1. MongoDB Connection Failed
**Error**: `MongoDB connection failed`
**Solution**: 
- Check if MongoDB is running locally
- Verify MongoDB Atlas connection string
- Ensure IP is whitelisted in MongoDB Atlas

### 2. JWT Secret Not Set
**Error**: `Missing required environment variables: JWT_SECRET`
**Solution**: Set `JWT_SECRET` in your `.env.local` file

### 3. CORS Errors
**Error**: `CORS policy blocked request`
**Solution**: 
- Backend running on correct port (5000)
- Frontend using Vite proxy in development

### 4. Environment Variables Not Loading
**Solution**: 
- Ensure `.env.local` exists in root directory
- Restart the server after changing environment variables

## 📋 Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run dev:server` | Start only backend server |
| `npm run build` | Build frontend for production |
| `npm run build:server` | Build backend for production |
| `npm start` | Start production server |

## 🔍 Debug Tips

1. **Check Server Logs**: Look for MongoDB connection status
2. **Verify Environment**: Server logs show loaded environment variables
3. **Test API**: Visit `http://localhost:5000/health` to check backend
4. **Check Console**: Browser console shows frontend environment info

## 🚀 Deployment Checklist

### Backend (Render/Heroku)
- [ ] Set `MONGODB_URI` (MongoDB Atlas connection string)
- [ ] Set `JWT_SECRET` (strong random string)
- [ ] Set `NODE_ENV=production`
- [ ] Set `PORT=10000` (Render) or `5000` (Heroku)

### Frontend (Netlify/Vercel)
- [ ] Set `VITE_API_URL` (your backend URL)
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`

## 📞 Need Help?

1. Check the detailed [README.md](./README.md)
2. Review server logs for specific error messages
3. Verify all environment variables are set correctly
4. Ensure MongoDB is accessible from your deployment platform
