#!/bin/bash
# Switch backend stack script
# Usage: ./scripts/switch-stack.sh express-mongodb

STACK=$1

if [ -z "$STACK" ]; then
  echo "Error: Stack name required"
  echo "Usage: ./scripts/switch-stack.sh <stack-name>"
  exit 1
fi

# Get port from config
PORT=$(grep "^$STACK=" scripts/ports.config | cut -d'=' -f2)

if [ -z "$PORT" ]; then
  echo "Error: Stack '$STACK' not found in ports.config"
  exit 1
fi

# Stop current backend processes (if running)
echo "Stopping current backend processes..."
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "nest start" 2>/dev/null || true
pkill -f "php artisan serve" 2>/dev/null || true

# Update frontend .env
ENV_FILE="client/.env"
echo "REACT_APP_API_URL=http://localhost:$PORT/api" > "$ENV_FILE"
echo "REACT_APP_BACKEND=$STACK" >> "$ENV_FILE"

echo "✅ Switched to $STACK on port $PORT"
echo "Frontend .env updated: $ENV_FILE"
echo "Start backend with: npm run dev:$STACK"

