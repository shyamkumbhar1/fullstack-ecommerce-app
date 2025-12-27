# Laravel + MongoDB Server (2024)

This project demonstrates modern experience with Laravel and MongoDB from 2024.

## Technology Stack

- **PHP:** v8.1+
- **Laravel:** v10+
- **MongoDB:** via jenssegers/mongodb v4.0
- **Composer:** Latest

## Features

- Modern Laravel patterns
- Eloquent ORM with MongoDB
- Service providers
- Modern middleware
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
php artisan serve --port=5004
```

Server runs on port **5004**

## Project Structure

```
laravel-mongodb/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   └── Middleware/
│   ├── Models/
│   └── Services/
├── config/
├── routes/
└── composer.json
```

## Experience Level

This project demonstrates:
- Modern Laravel architecture
- PHP 8.1+ features
- MongoDB integration
- Service-oriented design
- API development

