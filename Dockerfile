# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Install system dependencies for TTS engines
RUN apk add --no-cache \
    espeak \
    espeak-ng \
    festival \
    alsa-lib-dev \
    ffmpeg \
    sox

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install dependencies
RUN npm install
RUN cd server && npm install
RUN cd client && npm install

# Copy source code
COPY . .

# Build client
RUN cd client && npm run build

# Create necessary directories
RUN mkdir -p server/output server/temp server/cache

# Expose port
EXPOSE 5001

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5001

# Start the application
CMD ["npm", "start"]
