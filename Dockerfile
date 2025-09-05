# Base image
FROM node:18-alpine as base

# Set working directory
WORKDIR /app

# Copy package.json files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm run install:all

# Copy source code
COPY . .

# Build client
RUN npm run build:client

# Production stage
FROM node:18-alpine
WORKDIR /app

# Copy built files from previous stage
COPY --from=base /app/package*.json ./
COPY --from=base /app/server ./server
COPY --from=base /app/client/dist ./client/dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "run", "start:prod"]