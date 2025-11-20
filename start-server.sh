#!/bin/bash

# Function to start the server
start_server() {
    echo "🚀 Starting server on port 8000..."
    python3 -m http.server 8000 &
    SERVER_PID=$!
    echo "✓ Server started with PID: $SERVER_PID"
    echo "📡 Access at: https://special-train-x5gr4999v9473pp9q-8000.app.github.dev"
    echo ""
}

# Function to stop the server
stop_server() {
    if [ ! -z "$SERVER_PID" ]; then
        echo "🛑 Stopping server (PID: $SERVER_PID)..."
        kill $SERVER_PID 2>/dev/null
        wait $SERVER_PID 2>/dev/null
        echo "✓ Server stopped"
    fi
}

# Trap Ctrl+C to clean up
trap 'stop_server; exit 0' INT TERM

# Kill any existing Python servers on port 8000
pkill -9 -f "python.*8000" 2>/dev/null

# Start the server
start_server

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Press 't' to restart the server"
echo "  Press 'q' to quit"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Read key presses
while true; do
    read -n 1 -s key
    case "$key" in
        t|T)
            echo ""
            echo "🔄 Restarting server..."
            stop_server
            sleep 1
            start_server
            echo "Press 't' to restart, 'q' to quit"
            ;;
        q|Q)
            echo ""
            echo "👋 Shutting down..."
            stop_server
            exit 0
            ;;
    esac
done
