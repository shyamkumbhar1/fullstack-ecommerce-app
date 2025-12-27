# Architecture Documentation

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
├── scripts/                   # Management scripts
└── package.json               # Root package.json
```

## API Contract Strategy

All backend stacks follow the same API contracts defined in `shared/api-contracts/`:

- `auth.api.json` - Authentication endpoints
- `products.api.json` - Product endpoints
- `cart.api.json` - Cart endpoints
- `orders.api.json` - Order endpoints
- `users.api.json` - User endpoints
- `payment.api.json` - Payment endpoints

Each stack implements these contracts, ensuring frontend compatibility.

## Frontend-Backend Connection

### Configuration

Frontend uses environment-based API URL:
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_BACKEND` - Backend stack name

### Switching Backends

1. Update `client/.env` with new backend URL
2. Restart frontend (or use hot reload)
3. Frontend automatically connects to new backend

## Adding New Stacks

### Step 1: Create Stack Structure

```
servers/
└── <framework>/
    └── <framework>-<database>/
        ├── src/
        ├── tests/
        └── package.json
```

### Step 2: Follow API Contracts

- Implement all endpoints from `shared/api-contracts/`
- Use same request/response formats
- Follow same authentication flow

### Step 3: Use Shared Resources

- Import types from `shared/types/`
- Use constants from `shared/utils/constants.js`
- Use helpers from `shared/utils/helpers.js`

### Step 4: Update Configuration

- Add stack to `scripts/ports.config`
- Add scripts to root `package.json`
- Update `client/src/config/api.config.js`

## Database Strategy

### Laragon Services

- **MySQL:** Port 3306, default credentials (root, no password)
- **MongoDB:** Port 27017, default connection

### Connection Strings

- MongoDB: `mongodb://localhost:27017/ecommerce`
- MySQL: `mysql://root:@localhost:3306/ecommerce`

### PostgreSQL

- Not available in Laragon
- Use Docker or external service
- PostgreSQL stacks skipped in this setup

## Development Workflow

1. **Start Laragon services** (MySQL, MongoDB)
2. **Start one backend stack** (e.g., `npm run dev:express-mongodb`)
3. **Start frontend** (`npm run client`)
4. **Switch stacks** as needed using `npm run switch:<stack>`

## Testing Strategy

### Backend Tests

- Unit tests: `tests/unit/`
- Integration tests: `tests/integration/`
- Coverage target: 70%+

### Frontend Tests

- Component tests: `src/__tests__/components/`
- Page tests: `src/__tests__/pages/`
- Service tests: `src/__tests__/services/`

## Benefits

- **Clean separation:** Each stack is independent
- **Shared resources:** No code duplication
- **Easy switching:** Frontend works with all backends
- **Consistent APIs:** Same contracts across stacks
- **Professional structure:** Portfolio-ready organization

