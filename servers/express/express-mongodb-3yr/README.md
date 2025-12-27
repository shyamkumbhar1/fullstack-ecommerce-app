# Express + MongoDB Server (2021)

This project demonstrates mid-level experience with Express and MongoDB from 2021.

## Technology Stack

- **Node.js:** v14+
- **Express:** v4.17.1
- **MongoDB:** v4+ (Mongoose v6.0.13)
- **React:** v17

## Features

- Mix of async/await and promises (transitional pattern)
- Traditional folder structure (root level, no src/)
- Basic error handling
- JWT authentication
- Express-validator v6
- Mongoose v6 with useCreateIndex and useFindAndModify options

## Coding Patterns

This project shows the transition period between callback-based and async/await patterns:

- **Async/Await:** Used in most controllers
- **Promises:** Used in some service methods
- **Mix:** Demonstrates real-world 2021 codebase patterns

## Installation

```bash
npm install
```

## Configuration

Create `.env` file:

```env
NODE_ENV=development
PORT=5006
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key_here
```

## Running

```bash
npm run dev
```

Server runs on port **5006**

## Database Connection

Uses Mongoose 6 connection options:
- `useNewUrlParser: true`
- `useUnifiedTopology: true`
- `useCreateIndex: true`
- `useFindAndModify: false`

## Project Structure

```
express-mongodb-3yr/
├── server.js          # Main entry point
├── config/            # Configuration files
├── controllers/       # Route controllers
├── models/            # Mongoose models
├── routes/            # Express routes
├── services/          # Business logic
├── middleware/        # Custom middleware
├── utils/             # Utility functions
└── tests/             # Test files
```

## Experience Level

This project demonstrates:
- Understanding of transitional coding patterns
- Experience with Mongoose 6
- Knowledge of Express 4.17 features
- Ability to work with mixed async patterns

