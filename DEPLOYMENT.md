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
   - Set the build command to `npm install && npm run build:server`
   - Set the start command to `npm start`
   - Set environment variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret key
     - `PORT`: 10000 (Render's default port)
     - `NODE_ENV`: production

**Important**: Make sure the build process completes successfully and generates the compiled JavaScript files in the `dist-server` directory. The `npm start` command runs the compiled JavaScript file (`dist-server/index.js`) rather than using `tsx` to run the TypeScript file directly, which is more efficient and avoids issues with missing dependencies in production.

### Verifying Successful Build on Render

To ensure your build process completes successfully on Render.com:

1. **Check Build Logs**: After deployment, go to your Render dashboard and check the build logs. Look for these key messages:
   - `npm run build:server` should execute without errors
   - You should see TypeScript compilation progress
   - The build should complete with a success message

2. **Verify dist-server Directory**: The build process should generate compiled JavaScript files in the `distThe steps to ensure your build process completes successfully and runs properly on Render.com are:

1. In your package.json, you have a script `"build:server": "tsc --project tsconfig.node.json"` which compiles your server TypeScript files from the `server` directory into JavaScript files in the `dist-server` directory.

2. Your start script `"start": "node dist-server/index.js"` runs the compiled JavaScript server file.

3. On Render.com, configure your service with:
   - Build command: `npm install && npm run build:server`
   - Start command: `npm start`
   - Environment variables: `MONGODB_URI`, `JWT_SECRET`, `PORT` (usually 10000), and `NODE_ENV=production`

4. Ensure your `tsconfig.node.json` has `"outDir": "./dist-server"` and `"rootDir": "./server"` so the compiled files go to the correct directory.

5. Deploy your project on Render.com. Render will run the build command to compile your server code, then start the server using the compiled JavaScript files.

This setup avoids running TypeScript files directly with `tsx` in production, which can cause missing dependency issues. Instead, it uses the compiled JavaScript files for better performance and reliability.


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
   heroku config:set NODE_ENV=production
   ```
5. Add a buildpack for Node.js:
   ```bash
   heroku buildpacks:set heroku/nodejs
   ```
6. Add a `heroku-postbuild` script to your package.json to compile the server code:
   ```json
   "scripts": {
     "heroku-postbuild": "npm run build:server"
   }
   ```
7. Deploy:
   ```bash
   git push heroku main
   ```

**Important**: Make sure the build process completes successfully and generates the compiled JavaScript files in the `dist-server` directory. The start script (`npm start`) runs the compiled JavaScript file (`dist-server/index.js`) rather than using `tsx` to run the TypeScript file directly, which is more efficient and avoids issues with missing dependencies in production.

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
- `MONGODB_URI`: Your MongoDB connection string (make sure it's a valid MongoDB Atlas connection string)
- `JWT_SECRET`: Your JWT secret key (use a strong, random string)
- `PORT`: 10000 (Render's default port) or 5000 (Heroku's default port)
- `NODE_ENV`: Set to "production"

Example MongoDB URI format:
```
mongodb+srv://<username>:<password>@cluster0.abc123.mongodb.net/yaatrasarthi?retryWrites=true&w=majority
```

### For Frontend (Netlify)

In Netlify, you need to set this environment variable:
- `VITE_API_URL`: The URL of your deployed backend (e.g., https://your-backend.onrender.com)

You can set this in the Netlify dashboard:
1. Go to your site settings
2. Navigate to "Environment variables"
3. Add a new variable with key `VITE_API_URL` and value as your backend URL
4. Redeploy your site for the changes to take effect

## Troubleshooting Database Issues

If you're still experiencing database connection issues:

1. Verify your MongoDB Atlas connection string is correct
2. Ensure your MongoDB Atlas cluster has IP whitelist entries for your backend service:
   - For Render: Add `0.0.0.0/0` to the IP whitelist
   - For Heroku: Add `0.0.0.0/0` to the IP whitelist
3. Check that your database credentials are correct
4. Verify that the collections exist in your database:
   - `app_users` for user data
   - `app_monuments` for monument data
   - `app_bookings` for booking data
5. Check the backend logs for any MongoDB connection errors
6. Ensure the database initialization is working correctly by checking the logs for messages about data initialization

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
