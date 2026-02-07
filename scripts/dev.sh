#!/bin/bash

# ReplyKingAI Development Server Startup Script

echo "🚀 Starting ReplyKingAI Development Environment..."
echo ""

# Check if dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Check for .env file
if [ ! -f "backend/.env" ]; then
    echo "⚠️  No .env file found. Creating from template..."
    cp backend/.env.example backend/.env
    echo "✏️  Please edit backend/.env with your API keys before continuing."
    echo "   Required: AI_API_KEY (DeepSeek or OpenAI)"
    exit 1
fi

# Create data directory if it doesn't exist
mkdir -p backend/data

echo ""
echo "✅ All dependencies installed"
echo ""
echo "Starting servers in separate terminals..."
echo "  - Backend:  http://localhost:3001"
echo "  - Frontend: http://localhost:3000"
echo ""

# For macOS, use osascript to open new Terminal windows
if [[ "$OSTYPE" == "darwin"* ]]; then
    # Backend
    osascript -e 'tell application "Terminal" to do script "cd '"$(pwd)"'/backend && npm run dev"'
    
    # Frontend
    osascript -e 'tell application "Terminal" to do script "cd '"$(pwd)"'/frontend && npm run dev"'
    
    echo "✅ Servers started in new terminal windows"
else
    echo "Please run these commands in separate terminals:"
    echo ""
    echo "  Terminal 1 (Backend):"
    echo "  cd backend && npm run dev"
    echo ""
    echo "  Terminal 2 (Frontend):"
    echo "  cd frontend && npm run dev"
fi
