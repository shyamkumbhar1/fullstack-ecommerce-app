# E-Commerce Multi-Stack Platform

A full-featured e-commerce platform built with multiple backend stacks (Express, NestJS, Laravel) and different databases (MongoDB, MySQL), all connected to a single React frontend.

## Project Structure

```
ecommerce-platform/
├── client/                    # React frontend
├── servers/                   # Backend servers
│   └── express/
│       └── express-mongodb/   # Express + MongoDB stack
├── shared/                    # Shared resources
│   ├── api-contracts/         # API specifications
│   ├── types/                 # JSDoc type definitions
│   └── utils/                 # Shared utilities
├── docs/                      # Documentation
└── scripts/                   # Management scripts
```

## Features

- **Authentication:** JWT-based authentication
- **Products:** Full CRUD operations
- **Cart:** Shopping cart management
- **Orders:** Order processing and management
- **Payments:** Razorpay integration
- **Admin Panel:** User and product management
- **Email Service:** Transactional emails

## Quick Start

See [QUICK_START.md](QUICK_START.md) for detailed setup instructions.

### Prerequisites

- Laragon (for MySQL and MongoDB)
- Node.js (v14 or higher)
- npm or yarn

### Basic Setup

1. **Start Laragon services:**
   - Open Laragon
   - Click "Start All"

2. **Start backend:**
   ```bash
   npm run dev:express-mongodb
   ```

3. **Start frontend:**
   ```bash
   npm run client
   ```

## Available Stacks

### Express + MongoDB (Multiple Versions)
- **Express + MongoDB (2024)** - Modern (Port 5000)
- **Express + MongoDB (2021)** - 3 Years Old (Port 5006)
- **Express + MongoDB (2018)** - 6 Years Old / Legacy (Port 5007)

### Express + MySQL
- **Express + MySQL** (Port 5001)

### NestJS + MongoDB (Multiple Versions)
- **NestJS + MongoDB (2024)** - Modern (Port 5002)
- **NestJS + MongoDB (2021)** - 3 Years Old (Port 5008)
- **NestJS + MongoDB (2018)** - 6 Years Old / Legacy (Port 5009)

### NestJS + MySQL (Multiple Versions)
- **NestJS + MySQL (2024)** - Modern (Port 5003)
- **NestJS + MySQL (2021)** - 3 Years Old (Port 5010)
- **NestJS + MySQL (2018)** - 6 Years Old / Legacy (Port 5011)

### Laravel + MongoDB (Multiple Versions)
- **Laravel + MongoDB (2024)** - Modern (Port 5004)
- **Laravel + MongoDB (2021)** - 3 Years Old (Port 5012)
- **Laravel + MongoDB (2018)** - 6 Years Old / Legacy (Port 5013)

### Laravel + MySQL (Multiple Versions)
- **Laravel + MySQL (2024)** - Modern (Port 5005)
- **Laravel + MySQL (2021)** - 3 Years Old (Port 5014)
- **Laravel + MySQL (2018)** - 6 Years Old / Legacy (Port 5015)

### Experience Demonstration
All framework projects demonstrate experience across different technology eras:

**Express + MongoDB:**
- **Modern (2024):** Latest patterns, async/await, modern structure
- **3 Years Old (2021):** Transitional patterns, mix of async/await and promises
- **6 Years Old (2018):** Legacy patterns, callback-based, traditional MVC

**NestJS (MongoDB & MySQL):**
- **Modern (2024):** NestJS v10+, TypeScript v5+, latest patterns
- **3 Years Old (2021):** NestJS v8, TypeScript v4.5, transitional patterns
- **6 Years Old (2018):** NestJS v6, TypeScript v3.7, early framework patterns

**Laravel (MongoDB & MySQL):**
- **Modern (2024):** Laravel v10+, PHP 8.1+, modern patterns
- **3 Years Old (2021):** Laravel v8, PHP 7.4/8.0, transitional patterns
- **6 Years Old (2018):** Laravel v5.8, PHP 7.1+, legacy patterns

## Documentation

- [Quick Start Guide](QUICK_START.md)
- [Laragon Setup](docs/setup/laragon-setup.md)
- [Express + MongoDB Setup](docs/setup/express-mongodb-setup.md)
- [Architecture Documentation](docs/architecture.md)

## Switching Backends

To switch between backend stacks:

```bash
# Modern (2024)
npm run switch:express-mongodb
npm run dev:express-mongodb

# 3 Years Old (2021)
npm run switch:express-mongodb-3yr
npm run dev:express-mongodb-3yr

# 6 Years Old / Legacy (2018)
npm run switch:express-mongodb-6yr
npm run dev:express-mongodb-6yr
```

Frontend will automatically connect to the new backend.

## Development

### Run Tests

```bash
# Backend tests
cd servers/express/express-mongodb
npm test

# Frontend tests
cd client
npm test
```

### Project Management

- **Start stack:** `npm run dev:<stack-name>`
- **Switch stack:** `npm run switch:<stack-name>`
- **Stop all:** `npm run stop:all`

## Database Configuration

All stacks use Laragon services:
- **MySQL:** `mysql://root:@localhost:3306/ecommerce`
- **MongoDB:** `mongodb://localhost:27017/ecommerce`

## License

ISC

