#!/bin/bash

# Pokémon Wheel Spinner - Public Server
# Starts the application on all network interfaces (0.0.0.0)

PORT=${1:-8000}

echo "🚀 Starting Pokémon Wheel Spinner..."
echo ""
echo "📡 Server will be accessible on:"
echo "   • Local:     http://localhost:$PORT"
echo "   • Network:   http://0.0.0.0:$PORT"
echo "   • Your IP:   http://YOUR_LOCAL_IP:$PORT"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start Python HTTP server on all interfaces
python3 -m http.server $PORT --bind 0.0.0.0
