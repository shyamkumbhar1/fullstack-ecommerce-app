# Laravel + MongoDB Server (2021)

This project demonstrates mid-level experience with Laravel and MongoDB from 2021.

## Technology Stack

- **PHP:** v7.4 / v8.0
- **Laravel:** v8
- **MongoDB:** via jenssegers/mongodb v3.9
- **Composer:** Standard

## Features

- Laravel v8 patterns
- Eloquent ORM with MongoDB
- Service providers
- Middleware
- JWT authentication
- API resources

## Installation

```bash
composer install
```

## Configuration

Create `.env` file:

```env
APP_ENV=local
APP_DEBUG=true
DB_CONNECTION=mongodb
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=ecommerce
JWT_SECRET=your_jwt_secret_key_here
```

## Running

```bash
php artisan serve --port=5012
```

Server runs on port **5012**

## Experience Level

This project demonstrates:
- Understanding of Laravel v8
- PHP 7.4/8.0 features
- Mid-level framework knowledge
- Transitional patterns

