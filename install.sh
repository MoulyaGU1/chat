#!/bin/bash

# Clean Install Script for Chat App
# This script removes old dependencies and does a fresh install

echo "🧹 Cleaning up old dependencies..."
rm -rf node_modules package-lock.json

echo "📦 Installing fresh dependencies..."
npm install

echo "✅ Dependencies installed successfully!"
echo ""
echo "Next steps:"
echo "1. Copy .env.local.example to .env.local"
echo "   cp .env.local.example .env.local"
echo ""
echo "2. Edit .env.local with your credentials:"
echo "   NEXT_PUBLIC_CONVEX_URL=<your-convex-url>"
echo "   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-key>"
echo "   CLERK_SECRET_KEY=<your-clerk-secret>"
echo ""
echo "3. Deploy Convex functions:"
echo "   npx convex deploy"
echo ""
echo "4. Run the development server:"
echo "   npm run dev"
echo ""
echo "🚀 App will be available at http://localhost:3000"
