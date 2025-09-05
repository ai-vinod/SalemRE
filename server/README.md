# Salem Real Estate - Backend API

This is the backend API for the Salem Real Estate website. It provides endpoints for managing properties, users, blog posts, and inquiries.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- Cloudinary (for image uploads)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- Cloudinary account (for image uploads)

### Installation

1. Clone the repository
2. Navigate to the server directory: `cd server`
3. Install dependencies: `npm install`
4. Create a `.env` file in the server directory with the following variables:

```
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=salemre
DB_USER=postgres
DB_PASSWORD=yourpassword

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

5. Create a PostgreSQL database named `salemre`
6. Run the development server: `npm run dev`
7. (Optional) Seed the database with sample data: `npm run seed`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `PUT /api/auth/password` - Update user password (protected)

### Users (Admin only)

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/:id/stats` - Get user stats

### Properties

- `GET /api/properties` - Get all properties
- `GET /api/properties/featured` - Get featured properties
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create new property (admin)
- `PUT /api/properties/:id` - Update property (admin)
- `DELETE /api/properties/:id` - Delete property (admin)

### Blog Posts

- `GET /api/blog` - Get all blog posts
- `GET /api/blog/categories` - Get all blog categories
- `GET /api/blog/tags` - Get all blog tags
- `GET /api/blog/:id` - Get single blog post
- `POST /api/blog` - Create new blog post (admin)
- `PUT /api/blog/:id` - Update blog post (admin)
- `DELETE /api/blog/:id` - Delete blog post (admin)

### Inquiries

- `POST /api/inquiries` - Create new inquiry (public)
- `GET /api/inquiries/user` - Get user's inquiries (protected)
- `GET /api/inquiries` - Get all inquiries (admin)
- `GET /api/inquiries/:id` - Get single inquiry (admin)
- `PUT /api/inquiries/:id` - Update inquiry (admin)
- `DELETE /api/inquiries/:id` - Delete inquiry (admin)

### Uploads

- `POST /api/upload/property` - Upload property images (admin)
- `POST /api/upload/blog` - Upload blog image (admin)
- `POST /api/upload/avatar` - Upload user avatar (protected)
- `DELETE /api/upload/:publicId` - Delete image (admin)

## Database Models

### User
- id
- name
- email
- password
- role (admin, agent, user)
- phone
- avatar
- status
- timestamps

### Property
- id
- title
- slug
- description
- type
- status (For Sale, For Rent, Sold, etc.)
- location
- price
- bedrooms
- bathrooms
- area
- features (array)
- images (array)
- isFeatured
- userId (foreign key)
- timestamps

### BlogPost
- id
- title
- slug
- content
- excerpt
- status (published, draft)
- categories (array)
- tags (array)
- featuredImage
- userId (foreign key)
- timestamps

### Inquiry
- id
- name
- email
- message
- propertyType
- budget
- location
- status (new, in-progress, resolved)
- notes
- userId (foreign key)
- propertyId (foreign key)
- timestamps