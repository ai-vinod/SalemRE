# Salem Real Estate Website

A full-stack real estate website with property listings, blog, user authentication, and admin dashboard.

## Deployment Instructions

### Backend Deployment (Heroku)

1. Create a Heroku account and install the Heroku CLI
2. Login to Heroku CLI:
   ```
   heroku login
   ```
3. Create a new Heroku app:
   ```
   heroku create salemre-api
   ```
4. Add PostgreSQL addon:
   ```
   heroku addons:create heroku-postgresql:hobby-dev
   ```
5. Set environment variables in Heroku dashboard or via CLI:
   ```
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set JWT_EXPIRE=30d
   heroku config:set CLOUDINARY_CLOUD_NAME=your_cloud_name
   heroku config:set CLOUDINARY_API_KEY=your_api_key
   heroku config:set CLOUDINARY_API_SECRET=your_api_secret
   ```
6. Deploy to Heroku:
   ```
   git subtree push --prefix server heroku main
   ```
7. Run database migrations (if needed):
   ```
   heroku run node seeder.js
   ```

### Frontend Deployment (Netlify)

1. Create a Netlify account and install Netlify CLI
2. Login to Netlify CLI:
   ```
   netlify login
   ```
3. Initialize Netlify site:
   ```
   cd client
   netlify init
   ```
4. Deploy to Netlify:
   ```
   netlify deploy --prod
   ```

Alternatively, you can connect your GitHub repository to Netlify for automatic deployments.

## Environment Variables

### Backend (.env)

```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=salemre
DB_USER=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend

The frontend uses Vite's proxy configuration for development and Netlify redirects for production.

## Local Development

### Backend

```
cd server
npm install
npm run dev
```

### Frontend

```
cd client
npm install
npm run dev
```

## Features

- Property listings with search and filters
- User authentication and profiles
- Admin dashboard for managing properties, users, and inquiries
- Blog section with articles
- Contact and inquiry forms
- Responsive design for all devices