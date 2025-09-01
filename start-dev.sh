#!/bin/bash

# Voice Cart Wizard - Development Startup Script
echo "🚀 Starting Voice Cart Wizard Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Start Backend
echo "🔧 Starting Backend API..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Start backend in background
npm run dev &
BACKEND_PID=$!
echo "✅ Backend started with PID: $BACKEND_PID"

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
sleep 5

# Start Frontend
echo "🎨 Starting Frontend..."
cd ..
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start frontend
echo "✅ Starting frontend development server..."
npm run dev

# Cleanup function
cleanup() {
    echo "🛑 Shutting down development environment..."
    kill $BACKEND_PID 2>/dev/null
    echo "✅ Backend stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
echo "🔄 Development environment is running..."
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5000"
echo "🛑 Press Ctrl+C to stop"

# Keep script running
wait
