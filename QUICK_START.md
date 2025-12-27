# Quick Start Guide

## Prerequisites

- Laragon installed and running
- Node.js (v14 or higher)
- npm or yarn

## Step 1: Start Laragon Services

1. Open Laragon application
2. Click "Start All" to start MySQL and MongoDB services
3. Verify services are running (green indicators)

## Step 2: Setup Backend

1. **Navigate to backend directory:**
   ```bash
   cd servers/express/express-mongodb
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` with Laragon database URLs:**
   ```env
   MONGO_URI=mongodb://localhost:27017/ecommerce
   ```

5. **Start backend:**
   ```bash
   npm run dev
   ```
   Or from root:
   ```bash
   npm run dev:express-mongodb
   ```

## Step 3: Setup Frontend

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` with backend URL:**
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_BACKEND=express-mongodb
   ```

5. **Start frontend:**
   ```bash
   npm start
   ```
   Or from root:
   ```bash
   npm run client
   ```

## Step 4: Access Application

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`
- Health Check: `http://localhost:5000/api/health`

## Switch Backend Stack

To switch to a different backend:

1. **Using script:**
   ```bash
   npm run switch:express-mysql
   ```

2. **Or manually:**
   - Update `client/.env` with new backend URL
   - Restart frontend

3. **Start new backend:**
   ```bash
   npm run dev:express-mysql
   ```

## Stop All Services

```bash
npm run stop:all
```

## Available Stacks

- `express-mongodb` (Port 5000)
- `express-mysql` (Port 5001)
- `nestjs-mongodb` (Port 5002)
- `nestjs-mysql` (Port 5003)
- `laravel-mongodb` (Port 5004)
- `laravel-mysql` (Port 5005)

## Notes

- Run one stack at a time for best performance
- Frontend automatically reloads when backend URL changes
- All databases use Laragon services (MySQL, MongoDB)

