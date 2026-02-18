#!/usr/bin/env bash
# Render.com start script

set -e

echo "🚀 Starting Watch Store API..."

# Run the compiled server
node dist/server.js
