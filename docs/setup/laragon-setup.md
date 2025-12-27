# Laragon Setup Guide

## Installation

1. Download Laragon from [https://laragon.org/](https://laragon.org/)
2. Install Laragon (default location: `C:\laragon`)
3. Start Laragon application

## Database Services

### MySQL Setup

1. **Start MySQL Service:**
   - Open Laragon
   - Click "Start All" or start MySQL individually
   - MySQL runs on port `3306` by default

2. **Default Credentials:**
   - Username: `root`
   - Password: (empty - no password)
   - Port: `3306`

3. **Create Databases:**
   ```sql
   CREATE DATABASE ecommerce;
   CREATE DATABASE ecommerce_test;
   ```

4. **Connection String:**
   ```
   mysql://root:@localhost:3306/ecommerce
   ```

### MongoDB Setup

1. **Install MongoDB (if not included):**
   - Laragon may not include MongoDB by default
   - Download MongoDB from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Or use MongoDB Atlas (cloud)

2. **Start MongoDB Service:**
   - If installed locally, start MongoDB service
   - MongoDB runs on port `27017` by default

3. **Connection String:**
   ```
   mongodb://localhost:27017/ecommerce
   ```

## Environment Configuration

### Express + MongoDB
```env
MONGO_URI=mongodb://localhost:27017/ecommerce
```

### Express + MySQL
```env
DATABASE_URL=mysql://root:@localhost:3306/ecommerce
```

### NestJS + MySQL
```env
DATABASE_URL=mysql://root:@localhost:3306/ecommerce
```

### Laravel + MySQL
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecommerce
DB_USERNAME=root
DB_PASSWORD=
```

## Notes

- PostgreSQL is not available in Laragon
- Use Docker or external service for PostgreSQL stacks
- All MySQL connections use default Laragon credentials (root, no password)
- Fast local development with native services

