# Express + MongoDB Setup Guide

## Prerequisites

- Node.js (v14 or higher)
- Laragon with MongoDB service running
- npm or yarn

## Installation

1. **Navigate to server directory:**
   ```bash
   cd servers/express/express-mongodb
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Configure `.env` file:**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   # ... other variables
   ```

## Laragon Setup

1. **Start Laragon:**
   - Open Laragon application
   - Click "Start All" to start MongoDB service
   - MongoDB should be running on port `27017`

2. **Verify MongoDB connection:**
   - Check Laragon services panel
   - MongoDB should show as "Running"

## Running the Application

1. **Development mode:**
   ```bash
   npm run dev
   ```

2. **Production mode:**
   ```bash
   npm start
   ```

3. **Server will start on:**
   - URL: `http://localhost:5000`
   - API: `http://localhost:5000/api`

## Database Connection

The application connects to MongoDB using Laragon's MongoDB service:
- Host: `localhost`
- Port: `27017`
- Database: `ecommerce`

## Testing

1. **Run all tests:**
   ```bash
   npm test
   ```

2. **Run unit tests:**
   ```bash
   npm run test:unit
   ```

3. **Run integration tests:**
   ```bash
   npm run test:integration
   ```

## Troubleshooting

### MongoDB Connection Error
- Ensure Laragon MongoDB service is running
- Check MongoDB port (default: 27017)
- Verify connection string in `.env` file

### Port Already in Use
- Use `npm run kill-port` to kill process on port 5000
- Or change PORT in `.env` file

