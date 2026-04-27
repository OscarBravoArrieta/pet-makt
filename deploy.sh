#!/bin/bash

set -e

echo "Starting deployment process ..."

# 1. Install root dependencies
echo "Installing root dependencies..."
npm install

# 2. Backend build and deployment
echo "Navigating to backend directory..."
cd apps/pet-markt-be

echo "Generating Prisma client ..."
npx prisma generate

echo "Building backend application..."
npx nx build pet-markt-be

echo "Copying .env and ecosystem config to dist ... "
cp .env ./dist/
cp ecosystem.config.js ./dist/

echo "Navigatting to backen dist directory ..."
cd dist

echo "Stoping and deleting existing 'backend' pm2 process ..."
pm2 stop backend || true

# Continue even if stop or delete fails (process might not exist)
pm2 delete backend || true

echo "Starting backend with pm2 ..."
pm2 start ./ecosystem.config.js --only backend

echo "Verifying backend process ..."
pm2 describe backend

# frontend

echo "Navigating to frontend directory..."
cd ../../..

echo "Building frontend application..."
npx nx build pet-markt-web

echo "Copying frontend ecosystem config to dist ... "
mkdir -p dist/apps/pet-markt-web/server
cp apps/pet-markt-web/ecosystem.config.js dist/apps/pet-markt-web/server/

echo "Navigatting to frontend dist directory ..."
cd dist/apps/pet-markt-web/server

echo "Stoping and deleting existing 'frontend' pm2 process ..."
pm2 stop frontend || true
pm2 delete frontend || true

echo "Starting frontend with pm2 ..."
pm2 start ./ecosystem.config.js --only frontend

echo "Navigating back to root directory ..."
cd ../../../../

exit 0


