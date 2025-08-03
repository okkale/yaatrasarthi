# Deployment Guide for YaatraSarthi

This guide explains how to deploy the YaatraSarthi application with the frontend on Netlify and the backend on a separate service.

## Architecture Overview

- **Frontend**: React application (deployed to Netlify)
- **Backend**: Node.js/Express server (deployed to Render/Heroku)
- **Database**: MongoDB (MongoDB Atlas)

## Prerequisites

1. A Netlify account
2. A Render/Heroku account (for backend deployment)
3. A MongoDB Atlas account (or your own MongoDB instance)

## Deploying the Backend (Node.js/Express Server)

### Option 1: Deploy to Render (Recommended)

1. Create an account at [Render](https://render.com/)
2. Fork this repository or prepare your code for deployment
3. Create a new Web Service on Render:
   - Select your repository
   - Set the build command to `npm install`
   - Set the start command to `npm run server`
   - Set environment variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret key
     - `PORT`: 10000 (Render's default port)

### Option 2: Deploy to Heroku

1. Create an account at [Heroku](https://heroku.com/)
2. Install the Heroku CLI
3. Create a new Heroku app:
   ```bash
   heroku create your-app-name
   ```
4. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-jwt-secret
   heroku config:set PORT=10000
   ```
5. Deploy:
   ```bash
   git push heroku main
   ```

## Deploying the Frontend (React App) to Netlify

1. Create an account at [Netlify](https://netlify.com/)
2. Connect your GitHub repository to Netlify
3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Set environment variables in Netlify:
   - `VITE_API_URL`: The URL of your deployed backend (e.g., https://your-backend.onrender.com)

## Setting up Environment Variables

### For Backend (Render/Heroku)

In your backend deployment service, you need to set these environment variables:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Your JWT secret key
- `PORT`: 10000 (Render's default port) or 5000 (Heroku's default port)

### For Frontend (Netlify)

In Netlify, you need to set this environment variable:
- `VITE_API_URL`: The URL of your deployed backend (e.g., https://your-backend.onrender.com)

You can set this in the Netlify dashboard:
1. Go to your site settings
2. Navigate to "Environment variables"
3. Add a new variable with key `VITE_API_URL` and value as your backend URL
4. Redeploy your site for the changes to take effect

## Environment Variables

### Backend Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Port for the server (default: 5000)

### Frontend Environment Variables
- `VITE_API_URL`: Base URL for API requests (in production)

## Development vs Production

In development:
- Frontend runs on `http://localhost:3000`
- Backend runs on `http://localhost:5000`
- API calls are proxied through Vite configuration

In production:
- Frontend is served from Netlify
- Backend is served from Render/Heroku
- API calls use the `VITE_API_URL` environment variable

## Troubleshooting

### API Calls Returning 404
Ensure that:
1. The backend is deployed and running
2. The `VITE_API_URL` environment variable is set correctly in Netlify
3. The backend routes include the `/api` prefix

### CORS Issues
If you encounter CORS errors:
1. Check that the CORS configuration in `server/index.ts` includes your frontend domain
2. Ensure the `origin` in the CORS configuration matches your Netlify domain

### Database Connection Issues
If the backend fails to connect to MongoDB:
1. Verify the `MONGODB_URI` is correct
2. Ensure the MongoDB Atlas IP whitelist includes your backend service's IP
3. Check that the database credentials are correct
