#!/usr/bin/env bash
# Render.com build script

set -e

echo "🔨 Starting build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build TypeScript
echo "🏗️ Building TypeScript..."
npm run build

echo "✅ Build completed successfully!"
