# Express + MongoDB Server (2018)

This project demonstrates senior-level experience with legacy Express and MongoDB from 2018.

## Technology Stack

- **Node.js:** v10+
- **Express:** v4.16.4
- **MongoDB:** v3+ (Mongoose v5.7.0)
- **React:** v16

## Features

- Callback-based code (traditional Node.js pattern)
- Legacy MVC structure
- Traditional error handling
- JWT authentication
- Express-validator v5
- Mongoose v5 with callback-based methods

## Coding Patterns

This project demonstrates the callback-based pattern that was standard in 2018:

- **Callbacks:** All database operations use callbacks
- **Function declarations:** Traditional function syntax
- **Error handling:** Manual error checking in callbacks
- **Middleware:** Traditional Express middleware patterns

## Installation

```bash
npm install
```

## Configuration

Create `.env` file:

```env
NODE_ENV=development
PORT=5007
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key_here
```

## Running

```bash
npm run dev
```

Server runs on port **5007**

## Database Connection

Uses Mongoose 5 connection options:
- `useNewUrlParser: true`
- `useUnifiedTopology: true`
- `useCreateIndex: true`
- `useFindAndModify: false`
- Callback-based connection

## Project Structure

```
express-mongodb-6yr/
├── app.js             # Main entry point (older naming)
├── config/            # Configuration files
├── controllers/       # Route controllers (callback-based)
├── models/            # Mongoose models (callback-based)
├── routes/            # Express routes
├── services/          # Business logic (callback-based)
├── middleware/        # Custom middleware
└── utils/             # Utility functions
```

## Code Examples

### Controller Pattern (2018)
```javascript
exports.getProducts = function(req, res, next) {
  Product.find({ isActive: true }, function(err, products) {
    if (err) {
      return next(err);
    }
    res.status(200).json({
      success: true,
      data: products
    });
  });
};
```

### Model Pattern (2018)
```javascript
UserSchema.pre('save', function(next) {
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(this.password, salt, function(err, hash) {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  });
});
```

## Experience Level

This project demonstrates:
- Deep understanding of callback-based patterns
- Experience with legacy codebases
- Ability to maintain and upgrade older systems
- Knowledge of Mongoose 5 and Express 4.16
- Senior-level experience with Node.js ecosystem evolution

## Legacy Considerations

- No modern async/await patterns
- Callback-based error handling
- Traditional function declarations
- Older middleware patterns
- Mongoose 5 specific methods

