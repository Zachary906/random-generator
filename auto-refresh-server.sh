#!/bin/bash

# Auto-refresh server every hour
# This script restarts the HTTP server every hour to clear memory and refresh the application

while true; do
    echo "Server running... Next refresh in 1 hour (3600 seconds)"
    sleep 3600
    
    echo "$(date): Refreshing server..."
    pkill -f "python.*http.server.*3000" || true
    sleep 2
    
    cd /workspaces/random-generator
    python3 -m http.server 3000 > /tmp/server.log 2>&1 &
    
    echo "$(date): Server restarted"
done
