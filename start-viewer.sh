#!/bin/bash

# Title
echo -e "\033]0;Keycloak Token Viewer\007"

# Change to script directory
cd "$(dirname "$0")" || exit

# Load PORT from .env file
PORT=$(grep -E "^PORT=" .env 2>/dev/null | cut -d'=' -f2)
PORT=${PORT:-3000}

# Flag untuk mencegah browser terbuka dua kali
BROWSER_OPENED=false

# Check if port is already in use
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Server already running on port $PORT"
    echo "📱 Open http://localhost:$PORT in browser"
    echo
    if [ "$BROWSER_OPENED" = false ]; then
        BROWSER_OPENED=true
        open http://localhost:$PORT 2>/dev/null || xdg-open http://localhost:$PORT 2>/dev/null
    fi
else
    # Jalankan server, browser akan dibuka oleh server.js
    node server.js
fi