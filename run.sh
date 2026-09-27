#!/usr/bin/env bash
set -e

# Determine script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 1. Load .env configuration if present
if [ -f "$SCRIPT_DIR/.env" ]; then
    echo ">>> Loading personal environment variables from .env..."
    set -a
    source "$SCRIPT_DIR/.env"
    set +a
fi

# Set default port to 8081 if unspecified
export PORT="${PORT:-8081}"

# 2. Release port if occupied
if command -v lsof >/dev/null 2>&1; then
    OCCUPIED_PID=$(lsof -ti :"$PORT" 2>/dev/null || true)
    if [ -n "$OCCUPIED_PID" ]; then
        echo ">>> Port $PORT is occupied by PID $OCCUPIED_PID. Releasing..."
        kill -9 $OCCUPIED_PID 2>/dev/null || true
        sleep 1
    fi
fi

# 3. Summary banner
echo "=================================================="
echo " Starting St. Xavier's College Room Allocation"
if [ -n "$DB_URL" ]; then
    echo " Database     : Cloud PostgreSQL ($DB_URL)"
else
    echo " Database     : Local In-Memory (H2 Fallback)"
fi
echo " Web Port     : $PORT"
echo " Java Version : $(java -version 2>&1 | head -n 1)"
echo " Portal URL   : http://localhost:$PORT"
echo "=================================================="

# 4. Make Maven Wrapper executable & start Spring Boot
chmod +x ./mvnw
./mvnw spring-boot:run
